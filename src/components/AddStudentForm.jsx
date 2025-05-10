import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../services/mockApi';
import { motion } from 'framer-motion';

// Define Zod schema for form validation
const studentSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  course: z.string().min(1, { message: 'Course is required' }),
  customCourse: z.string().optional(),
  grade: z.string().optional(),
  enrollmentDate: z.string().refine(date => {
    if (!date) return true;
    
    // Extract only the date part from the input date
    const selectedDate = new Date(date);
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = selectedDate.getDate();
    
    // Extract only the date part from today
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    
    // Compare dates without time components
    if (selectedYear > todayYear) return false;
    if (selectedYear === todayYear && selectedMonth > todayMonth) return false;
    if (selectedYear === todayYear && selectedMonth === todayMonth && selectedDay > todayDay) return false;
    
    return !isNaN(selectedDate.getTime());
  }, {
    message: 'Enrollment date cannot be in the future'
  }),
  performance: z.number().min(0).max(100).optional(),
  attendance: z.number().min(0).max(100).optional(),
  activityDescription: z.string().optional(),
  activityDate: z.string().refine(date => {
    if (!date) return true;
    
    // Extract only the date part from the input date
    const selectedDate = new Date(date);
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = selectedDate.getDate();
    
    // Extract only the date part from today
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    
    // Compare dates without time components
    if (selectedYear > todayYear) return false;
    if (selectedYear === todayYear && selectedMonth > todayMonth) return false;
    if (selectedYear === todayYear && selectedMonth === todayMonth && selectedDay > todayDay) return false;
    
    return !isNaN(selectedDate.getTime());
  }, {
    message: 'Activity date cannot be in the future'
  })
}).refine(data => {
  // If 'custom' is selected, customCourse must be filled
  return data.course !== 'custom' || (data.course === 'custom' && data.customCourse.trim().length > 0);
}, {
  message: "Custom course name is required",
  path: ["customCourse"]
});

// Predefined list of courses
const PREDEFINED_COURSES = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Biology',
  'Chemistry',
  'Literature',
  'History',
  'Psychology',
  'Art History',
  'Engineering',
  'Economics',
  'Business Administration',
  'Political Science',
  'Sociology',
  'Philosophy',
  'Foreign Languages',
  'Music',
  'Fine Arts',
  'Medicine',
  'Law'
];

export default function AddStudentForm({ user, onStudentAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isCustomCourse, setIsCustomCourse] = useState(false);
  const [allCourses, setAllCourses] = useState([]);

  // Initialize react-hook-form with zod resolver
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    setValue,
    watch,
    getValues
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      course: '',
      customCourse: '',
      grade: 'C+',
      enrollmentDate: new Date().toISOString().split('T')[0],
      performance: 75,
      attendance: 90,
      activityDescription: 'Joined course',
      activityDate: new Date().toISOString().split('T')[0]
    }
  });

  // Load existing courses from the API when component mounts
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await api.getStudents();
        const existingCourses = [...new Set(response.data.map(student => student.course))];
        // Combine existing courses with predefined ones, remove duplicates
        const combinedCourses = [...new Set([...existingCourses, ...PREDEFINED_COURSES])];
        setAllCourses(combinedCourses.sort());
      } catch (error) {
        console.error('Failed to load courses', error);
        setAllCourses(PREDEFINED_COURSES);
      }
    };
    
    loadCourses();
  }, []);

  // Watch the course selection to handle custom course input
  const selectedCourse = watch('course');
  
  useEffect(() => {
    setIsCustomCourse(selectedCourse === 'custom');
    
    // Clear custom course when switching back to predefined
    if (selectedCourse !== 'custom') {
      setValue('customCourse', '');
    }
  }, [selectedCourse, setValue]);

  // Handler for performance change
  const handlePerformanceChange = (e) => {
    const performance = parseInt(e.target.value, 10);
    if (!isNaN(performance)) {
      // Update the form with the new performance value
      setValue('performance', performance);
      
      // Calculate the corresponding grade
      if (performance >= 93) setValue('grade', 'A+');
      else if (performance >= 90) setValue('grade', 'A');
      else if (performance >= 87) setValue('grade', 'A-');
      else if (performance >= 83) setValue('grade', 'B+');
      else if (performance >= 80) setValue('grade', 'B');
      else if (performance >= 77) setValue('grade', 'B-');
      else if (performance >= 73) setValue('grade', 'C+');
      else if (performance >= 70) setValue('grade', 'C');
      else if (performance >= 67) setValue('grade', 'C-');
      else if (performance >= 60) setValue('grade', 'D');
      else setValue('grade', 'F');
    }
  };

  // Handler for grade change
  const handleGradeChange = (e) => {
    const grade = e.target.value;
    setValue('grade', grade);
    
    // Update performance based on grade
    switch (grade) {
      case 'A+': setValue('performance', 95); break;
      case 'A': setValue('performance', 91); break;
      case 'A-': setValue('performance', 88); break;
      case 'B+': setValue('performance', 85); break;
      case 'B': setValue('performance', 81); break;
      case 'B-': setValue('performance', 78); break;
      case 'C+': setValue('performance', 75); break;
      case 'C': setValue('performance', 71); break;
      case 'C-': setValue('performance', 68); break;
      case 'D': setValue('performance', 65); break;
      case 'F': setValue('performance', 50); break;
      default: break;
    }
  };

  const onSubmit = async (data) => {
    // Make sure user is authenticated
    if (!user) {
      setSubmitError('You must be logged in to add a student');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');
    
    try {
      // Process activity data
      const { activityDescription, activityDate, customCourse, ...studentData } = data;
      
      // Use custom course value if selected
      if (data.course === 'custom' && customCourse) {
        studentData.course = customCourse;
      }
      
      // Add the activity to the student data if both fields are provided
      if (activityDescription && activityDate) {
        studentData.activities = [
          {
            description: activityDescription,
            date: activityDate // Store as raw date string
          }
        ];
      }
      
      await api.addStudent(studentData);
      
      // Reset form
      reset();
      
      setSubmitSuccess(true);
      
      // Notify parent component
      if (onStudentAdded) {
        setTimeout(() => {
          onStudentAdded();
        }, 2000); // Show success message for 2 seconds before redirecting
      }
    } catch (error) {
      setSubmitError('Failed to add student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-secondary-800 shadow-sm rounded-lg border border-gray-200 dark:border-secondary-700 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        duration: 0.3 
      }}
    >
      <div className="px-6 py-5 border-b border-gray-200 dark:border-secondary-700 bg-gray-50 dark:bg-secondary-900/50">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-secondary-100">Student Information</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-secondary-400">
          Please fill out all required fields marked with an asterisk (*).
        </p>
      </div>
      
      {submitSuccess && (
        <div className="m-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400 dark:text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700 dark:text-green-400">
                Student added successfully! Redirecting to student list...
              </p>
            </div>
          </div>
        </div>
      )}
      
      {submitError && (
        <div className="m-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">
                {submitError}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`input-field ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`input-field ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="john@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1">
              Course <span className="text-red-500">*</span>
            </label>
            <select
              id="course"
              {...register('course')}
              className={`select-field ${errors.course ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            >
              <option value="">Select Course</option>
              {allCourses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
              <option value="custom">Other (Custom Course)</option>
            </select>
            {errors.course && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.course.message}</p>}
            
            {isCustomCourse && (
              <div className="mt-2">
                <input
                  id="customCourse"
                  type="text"
                  {...register('customCourse')}
                  className={`input-field ${errors.customCourse ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter custom course name"
                />
                {errors.customCourse && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customCourse.message}</p>}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1">
              Grade
            </label>
            <select
              id="grade"
              {...register('grade')}
              onChange={handleGradeChange}
              className="select-field"
            >
              <option value="">Select Grade</option>
              <option value="A+">A+ (93-100%)</option>
              <option value="A">A (90-92%)</option>
              <option value="A-">A- (87-89%)</option>
              <option value="B+">B+ (83-86%)</option>
              <option value="B">B (80-82%)</option>
              <option value="B-">B- (77-79%)</option>
              <option value="C+">C+ (73-76%)</option>
              <option value="C">C (70-72%)</option>
              <option value="C-">C- (67-69%)</option>
              <option value="D">D (60-66%)</option>
              <option value="F">F (0-59%)</option>
            </select>
            {errors.grade && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.grade.message}</p>}
          </div>

          <div>
            <label htmlFor="enrollmentDate" className="block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1">
              Enrollment Date
            </label>
            <input
              id="enrollmentDate"
              type="date"
              {...register('enrollmentDate')}
              className={`input-field ${errors.enrollmentDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.enrollmentDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.enrollmentDate.message}</p>}
          </div>

          <div>
            <label htmlFor="performance" className="block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1">
              Performance (%)
            </label>
            <input
              id="performance"
              type="number"
              min="0"
              max="100"
              {...register('performance', { valueAsNumber: true })}
              onChange={handlePerformanceChange}
              className="input-field"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-secondary-400">
              Corresponds to grade: {watch('grade')}
            </p>
            {errors.performance && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.performance.message}</p>}
          </div>

          <div>
            <label htmlFor="attendance" className="block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1">
              Attendance (%)
            </label>
            <input
              id="attendance"
              type="number"
              min="0"
              max="100"
              {...register('attendance', { valueAsNumber: true })}
              className="input-field"
            />
            {errors.attendance && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.attendance.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1">
              Initial Activity
            </label>
            <div className="space-y-3">
              <div>
                <label htmlFor="activityDescription" className="block text-xs text-gray-500 dark:text-secondary-400 mb-1">
                  Activity Description
                </label>
                <input
                  id="activityDescription"
                  type="text"
                  {...register('activityDescription')}
                  className="input-field"
                  placeholder="Joined course"
                />
              </div>
              <div>
                <label htmlFor="activityDate" className="block text-xs text-gray-500 dark:text-secondary-400 mb-1">
                  Activity Date
                </label>
                <input
                  id="activityDate"
                  type="date"
                  {...register('activityDate')}
                  className={`input-field ${errors.activityDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.activityDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.activityDate.message}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5 border-t border-gray-200 dark:border-secondary-700">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onStudentAdded}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Saving...' : 'Save Student'}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
} 