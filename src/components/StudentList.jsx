import { useState, useEffect, Fragment, useRef } from 'react';
import { api } from '../services/mockApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// Define Zod schema for student validation
const studentSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  course: z.string().min(1, { message: 'Course is required' }),
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
  activities: z.array(
    z.object({
      description: z.string(),
      date: z.string()
    })
  ).optional(),
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
});

// Animation variants
const listVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.08,
      delayChildren: 0.1
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300,
      damping: 24
    }
  }
};

const expandVariants = {
  hidden: { opacity: 0, height: 0, overflow: 'hidden' },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: { 
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const alertVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 500, damping: 30 }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  }
};

// Add a new custom hook to detect when an element is in viewport
function StudentRow({ student, index, expandedStudent, editingStudent, handleRowClick, handleEditClick, handleDeleteClick, isDeleting, deletingStudentId, formatDate, getGradeColor }) {
  return (
    <motion.tr
      className={`hover-row cursor-pointer ${expandedStudent?.id === student.id ? 'bg-gray-50 dark:bg-secondary-700/50' : ''}`}
      onClick={() => handleRowClick(student)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          delay: index * 0.05,
          type: "spring", 
          stiffness: 300, 
          damping: 24
        } 
      }}
      viewport={{ once: true, amount: 0.2 }}
      whileTap={{ scale: 0.99 }}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <motion.div 
            className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-300 font-medium"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {student.name.charAt(0).toUpperCase()}
          </motion.div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-secondary-100">{student.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-secondary-400">{student.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300">
          {student.course}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(student.grade)}`}>
          {student.grade || 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-secondary-400">
        {formatDate(student.enrollmentDate)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <button
            onClick={(e) => handleEditClick(e, student)}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Edit
          </button>
          <button
            onClick={(e) => handleDeleteClick(e, student.id)}
            disabled={isDeleting && deletingStudentId === student.id}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
          >
            {isDeleting && deletingStudentId === student.id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  // Form handling for student editing
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: zodResolver(studentSchema)
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await api.getStudents();
      setStudents(response.data);
      
      // Extract unique courses for the filter dropdown
      const uniqueCourses = [...new Set(response.data.map(student => student.course))];
      setCourses(uniqueCourses);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load students');
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredStudents = sortedStudents.filter(student => {
    const matchesCourse = filter === '' || student.course.toLowerCase() === filter.toLowerCase();
    const matchesSearch = !searchTerm || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCourse && matchesSearch;
  });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const handleRowClick = (student) => {
    if (expandedStudent && expandedStudent.id === student.id) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(student);
      setEditingStudent(null);
    }
  };

  const handleEditClick = (e, student) => {
    e.stopPropagation();
    setEditingStudent(student);
    setExpandedStudent(null);

    // Populate form with student data
    Object.keys(student).forEach(key => {
      if (key !== 'id') {
        setValue(key, student[key]);
      }
    });
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    reset();
  };

  const onSubmitEdit = async (data) => {
    setIsUpdating(true);
    setError(null); // Clear any previous errors
    try {
      // Process activity data
      const activityDescription = data.activityDescription;
      const activityDate = data.activityDate;
      
      // Remove the activity fields from data
      const { activityDescription: _, activityDate: __, ...studentData } = data;
      
      // Update the activities array if both description and date are provided
      if (activityDescription && activityDate) {
        const updatedActivities = [...(editingStudent.activities || [])];
        
        // Update the first activity or add a new one
        if (updatedActivities.length > 0) {
          updatedActivities[0] = {
            description: activityDescription,
            date: activityDate // Store as raw date string
          };
        } else {
          updatedActivities.push({
            description: activityDescription,
            date: activityDate
          });
        }
        
        studentData.activities = updatedActivities;
      }
      
      // Log the data being sent to API
      console.log(`Updating student ${editingStudent.id} with data:`, studentData);
      
      // Update student in the database
      const response = await api.updateStudent(editingStudent.id, studentData);
      console.log('Update response:', response);
      
      // Update local state with the response data
      setStudents(students.map(s => s.id === editingStudent.id ? { ...s, ...studentData } : s));
      
      // Reset editing state
      setEditingStudent(null);
      reset();
      
      // Show success message
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error updating student:', err);
      setError(`Failed to update student: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = async (e, studentId) => {
    e.stopPropagation(); // Prevent row click
    
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    setDeletingStudentId(studentId);
    setError(null);
    
    try {
      // Call the API to delete the student
      const response = await api.deleteStudent(studentId);
      console.log('Delete response:', response);
      
      // Update local state
      setStudents(students.filter(s => s.id !== studentId));
      
      // If the deleted student was expanded or being edited, reset those states
      if (expandedStudent?.id === studentId) {
        setExpandedStudent(null);
      }
      
      if (editingStudent?.id === studentId) {
        setEditingStudent(null);
      }
      
      // Show success message
      setDeleteSuccess(true);
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error deleting student:', err);
      setError(`Failed to delete student: ${err.message || 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
      setDeletingStudentId(null);
    }
  };

  // Add a new function to handle performance change
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

  // Add this function to handle grade change
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

  const handleResetData = async () => {
    // Confirm before resetting
    if (!window.confirm('Are you sure you want to reset all data to defaults? This cannot be undone.')) {
      return;
    }
    
    setIsResetting(true);
    setError(null);
    
    try {
      // Call the API to reset data
      const response = await api.resetData();
      console.log('Reset response:', response);
      
      // Directly update the students state with the reset data instead of just reloading
      setStudents(response.students);
      
      // Update courses for filter dropdown based on reset data
      const uniqueCourses = [...new Set(response.students.map(student => student.course))];
      setCourses(uniqueCourses);
      
      // Clear any filters or search terms
      setFilter('');
      setSearchTerm('');
      
      // Reset any expanded or editing state
      setExpandedStudent(null);
      setEditingStudent(null);
      
      // Show success message
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error resetting data:', err);
      setError(`Failed to reset data: ${err.message || 'Unknown error'}`);
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 dark:border-primary-400"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-400 p-4 rounded" role="alert">
      <p className="font-bold">Error</p>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Success messages */}
      <AnimatePresence>
        {updateSuccess && (
          <motion.div 
            className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 text-green-700 dark:text-green-400 p-4 rounded"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={alertVariants}
            role="alert"
          >
            <p>Student information updated successfully!</p>
          </motion.div>
        )}
        
        {deleteSuccess && (
          <motion.div 
            className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 text-green-700 dark:text-green-400 p-4 rounded"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={alertVariants}
            role="alert"
          >
            <p>Student deleted successfully!</p>
          </motion.div>
        )}
        
        {resetSuccess && (
          <motion.div 
            className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 text-green-700 dark:text-green-400 p-4 rounded"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={alertVariants}
            role="alert"
          >
            <p>Data reset to defaults successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter controls */}
      <motion.div 
        className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-secondary-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-1/3">
            <label htmlFor="course-filter" className="block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1">
              Filter by Course
            </label>
            <select
              id="course-filter"
              className="select-field"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-2/3">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1">
              Search Students
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-secondary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                className="input-field pl-10"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleResetData}
              disabled={isResetting}
              className="btn text-xs bg-primary-500 hover:bg-primary-600 text-white px-2 py-1 rounded flex items-center space-x-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{isResetting ? 'Resetting...' : 'Reset Data'}</span>
            </button>
          </div>
        </div>
      </motion.div>
      
      {filteredStudents.length === 0 ? (
        <motion.div 
          className="text-center py-12 bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-secondary-100">No students found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-secondary-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
              <thead className="bg-gray-50 dark:bg-secondary-900/50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      <span>{getSortIcon('name')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      <span>{getSortIcon('email')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('course')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Course</span>
                      <span>{getSortIcon('course')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('grade')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Grade</span>
                      <span>{getSortIcon('grade')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('enrollmentDate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Enrolled</span>
                      <span>{getSortIcon('enrollmentDate')}</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-secondary-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <motion.tbody 
                className="bg-white dark:bg-secondary-800 divide-y divide-gray-200 dark:divide-secondary-700"
                variants={listVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredStudents.map((student, index) => (
                  <Fragment key={student.id}>
                    <StudentRow 
                      student={student}
                      index={index}
                      expandedStudent={expandedStudent}
                      editingStudent={editingStudent}
                      handleRowClick={handleRowClick}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                      isDeleting={isDeleting}
                      deletingStudentId={deletingStudentId}
                      formatDate={formatDate}
                      getGradeColor={getGradeColor}
                    />
                    
                    <AnimatePresence>
                      {expandedStudent?.id === student.id && (
                        <motion.tr 
                          className="bg-gray-50 dark:bg-secondary-700/30"
                          variants={expandVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          key="expanded"
                        >
                          <td colSpan={6} className="px-6 py-4">
                            <div className="py-4">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-secondary-100">Student Details</h3>
                                <button
                                  onClick={(e) => handleEditClick(e, student)}
                                  className="btn btn-primary text-sm"
                                >
                                  Edit Details
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 dark:text-secondary-400">Performance</h4>
                                      <div className="mt-2">
                                        <div className="flex items-center mt-2">
                                          <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-2.5">
                                            <div 
                                              className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full" 
                                              style={{ width: `${student.performance}%` }}
                                            ></div>
                                          </div>
                                          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-secondary-300">
                                            {student.performance}%
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 dark:text-secondary-400">Attendance</h4>
                                      <p className="mt-1 text-sm text-gray-900 dark:text-secondary-200">{student.attendance}%</p>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 dark:text-secondary-400">Recent Activity</h4>
                                  <div className="mt-2 space-y-3">
                                    {student.activities.map((activity, index) => (
                                      <div key={index} className="flex">
                                        <div className="flex-shrink-0">
                                          <div className="h-4 w-4 rounded-full bg-primary-200 dark:bg-primary-900 mt-1"></div>
                                        </div>
                                        <div className="ml-3">
                                          <p className="text-sm text-gray-900 dark:text-secondary-200">{activity.description}</p>
                                          <p className="text-xs text-gray-500 dark:text-secondary-400">
                                            {formatActivityDate(activity.date)}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                      
                      {editingStudent?.id === student.id && (
                        <motion.tr 
                          className="bg-gray-50 dark:bg-secondary-700/30"
                          variants={expandVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          key="editing"
                        >
                          <td colSpan={6} className="px-6 py-4">
                            <form onSubmit={handleSubmit(onSubmitEdit)} className="py-4">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-secondary-100">Edit Student Information</h3>
                                <div className="text-sm text-gray-500 dark:text-secondary-400">
                                  ID: {editingStudent.id}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    id="name"
                                    type="text"
                                    {...register('name')}
                                    className={`input-field ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
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
                                  />
                                  {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
                                </div>
                                <div>
                                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1">
                                    Course <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    id="course"
                                    type="text"
                                    {...register('course')}
                                    className={`input-field ${errors.course ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                  />
                                  {errors.course && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.course.message}</p>}
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
                                </div>
                                <div className="sm:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1">
                                    Recent Activity
                                  </label>
                                  <div className="space-y-3">
                                    <div>
                                      <label htmlFor="activity1Description" className="block text-xs text-gray-500 dark:text-secondary-400 mb-1">
                                        Activity Description
                                      </label>
                                      <input
                                        id="activity1Description"
                                        type="text"
                                        {...register('activityDescription')}
                                        defaultValue={editingStudent.activities && editingStudent.activities.length > 0 ? editingStudent.activities[0].description : ''}
                                        className="input-field"
                                      />
                                    </div>
                                    <div>
                                      <label htmlFor="activity1Date" className="block text-xs text-gray-500 dark:text-secondary-400 mb-1">
                                        Activity Date
                                      </label>
                                      <input
                                        id="activity1Date"
                                        type="date"
                                        {...register('activityDate')}
                                        defaultValue={editingStudent.activities && editingStudent.activities.length > 0 && 
                                          /^\d{4}-\d{2}-\d{2}$/.test(editingStudent.activities[0].date) ? 
                                          editingStudent.activities[0].date : 
                                          new Date().toISOString().split('T')[0]}
                                        className="input-field"
                                        max={new Date().toISOString().split('T')[0]}
                                      />
                                      {errors && errors.activityDate && 
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                          {errors.activityDate.message}
                                        </p>
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-6 flex space-x-3 justify-end">
                                <button
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="btn btn-secondary"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={isUpdating}
                                  className="btn btn-primary"
                                >
                                  {isUpdating ? 'Saving...' : 'Save Changes'}
                                </button>
                              </div>
                              <p className="mt-2 text-xs text-gray-500 dark:text-secondary-400">
                                Changes will be saved to the database immediately.
                              </p>
                            </form>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </Fragment>
                ))}
              </motion.tbody>
            </table>
          </div>
          
          <motion.div 
            className="px-6 py-4 border-t border-gray-200 dark:border-secondary-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-gray-700 dark:text-secondary-300">
              Showing <span className="font-medium">{filteredStudents.length}</span> of{' '}
              <span className="font-medium">{students.length}</span> students
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function getGradeColor(grade) {
  if (!grade) return 'bg-gray-100 text-gray-800 dark:bg-secondary-700 dark:text-secondary-300';
  
  switch(grade.charAt(0)) {
    case 'A':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'B':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'C':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'D':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    case 'F':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-secondary-700 dark:text-secondary-300';
  }
}

function formatActivityDate(dateString) {
  try {
    const activityDate = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(activityDate.getTime())) {
      return dateString; // Return original string if not a valid date
    }
    
    // Format the date as Month Day, Year
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return activityDate.toLocaleDateString(undefined, options);
  } catch (e) {
    console.error('Error formatting activity date:', e);
    return dateString;
  }
} 