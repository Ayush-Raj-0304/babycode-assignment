import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios, { delayResponse: 1000 });

// Default student data to use if localStorage is empty
const defaultStudents = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    course: 'Computer Science',
    grade: 'A',
    enrollmentDate: '2023-09-01',
    performance: 90,
    attendance: 92,
    activities: [
      { description: 'Submitted final project', date: '2023-09-15' },
      { description: 'Attended group study session', date: '2023-09-10' },
      { description: 'Completed mid-term exam', date: '2023-08-20' }
    ]
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    course: 'Mathematics',
    grade: 'B+',
    enrollmentDate: '2023-09-01',
    performance: 84,
    attendance: 88,
    activities: [
      { description: 'Completed assignment #4', date: '2023-09-18' },
      { description: 'Participated in math competition', date: '2023-09-10' },
      { description: 'Attended tutoring session', date: '2023-09-05' }
    ]
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    course: 'Physics',
    grade: 'A-',
    enrollmentDate: '2023-09-01',
    performance: 87,
    attendance: 95,
    activities: [
      { description: 'Lab experiment completed', date: '2023-09-17' },
      { description: 'Research paper submitted', date: '2023-09-12' },
      { description: 'Participated in science fair', date: '2023-08-25' }
    ]
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    course: 'Biology',
    grade: 'B',
    enrollmentDate: '2023-09-01',
    performance: 80,
    attendance: 85,
    activities: [
      { description: 'Field study report submitted', date: '2023-09-18' },
      { description: 'Group project presentation', date: '2023-09-10' },
      { description: 'Lab practical completed', date: '2023-08-28' }
    ]
  },
  {
    id: 5,
    name: 'Alex Brown',
    email: 'alex@example.com',
    course: 'Computer Science',
    grade: 'A+',
    enrollmentDate: '2023-09-01',
    performance: 95,
    attendance: 98,
    activities: [
      { description: 'Completed coding challenge', date: '2023-09-19' },
      { description: 'Presented at tech meetup', date: '2023-09-12' },
      { description: 'Completed certification exam', date: '2023-09-05' }
    ]
  },
  {
    id: 6,
    name: 'Emily Wilson',
    email: 'emily@example.com',
    course: 'Literature',
    grade: 'A-',
    enrollmentDate: '2023-09-03',
    performance: 88,
    attendance: 90,
    activities: [
      { description: 'Essay submitted', date: '2023-09-19' },
      { description: 'Book review completed', date: '2023-09-14' },
      { description: 'Group discussion led', date: '2023-09-07' }
    ]
  },
  {
    id: 7,
    name: 'Daniel Lee',
    email: 'daniel@example.com',
    course: 'Chemistry',
    grade: 'B+',
    enrollmentDate: '2023-09-02',
    performance: 85,
    attendance: 92,
    activities: [
      { description: 'Lab report submitted', date: '2023-09-20' },
      { description: 'Chemical analysis completed', date: '2023-09-15' },
      { description: 'Team project presentation', date: '2023-09-10' }
    ]
  },
  {
    id: 8,
    name: 'Olivia Martin',
    email: 'olivia@example.com',
    course: 'Mathematics',
    grade: 'A+',
    enrollmentDate: '2023-09-01',
    performance: 96,
    attendance: 98,
    activities: [
      { description: 'Advanced calculus exam', date: '2023-09-18' },
      { description: 'Tutoring session given', date: '2023-09-13' },
      { description: 'Research paper submitted', date: '2023-09-08' }
    ]
  },
  {
    id: 9,
    name: 'Noah Thompson',
    email: 'noah@example.com',
    course: 'Physics',
    grade: 'B',
    enrollmentDate: '2023-09-02',
    performance: 82,
    attendance: 87,
    activities: [
      { description: 'Mechanics project completed', date: '2023-09-19' },
      { description: 'Lab experiment conducted', date: '2023-09-14' },
      { description: 'Study group organized', date: '2023-09-09' }
    ]
  },
  {
    id: 10,
    name: 'Sophia Rodriguez',
    email: 'sophia@example.com',
    course: 'Computer Science',
    grade: 'A',
    enrollmentDate: '2023-09-01',
    performance: 92,
    attendance: 95,
    activities: [
      { description: 'Algorithm challenge completed', date: '2023-09-20' },
      { description: 'Website project launched', date: '2023-09-15' },
      { description: 'Programming competition won', date: '2023-09-10' }
    ]
  },
  {
    id: 11,
    name: 'Liam Garcia',
    email: 'liam@example.com',
    course: 'History',
    grade: 'B-',
    enrollmentDate: '2023-09-03',
    performance: 78,
    attendance: 84,
    activities: [
      { description: 'Historical analysis submitted', date: '2023-09-18' },
      { description: 'Museum visit report', date: '2023-09-13' },
      { description: 'Documentary review completed', date: '2023-09-08' }
    ]
  },
  {
    id: 12,
    name: 'Ava Washington',
    email: 'ava@example.com',
    course: 'Biology',
    grade: 'A',
    enrollmentDate: '2023-09-02',
    performance: 90,
    attendance: 93,
    activities: [
      { description: 'Ecosystem study completed', date: '2023-09-19' },
      { description: 'Lab experiment documented', date: '2023-09-14' },
      { description: 'Research paper presented', date: '2023-09-09' }
    ]
  },
  {
    id: 13,
    name: 'Ethan Brown',
    email: 'ethan@example.com',
    course: 'Psychology',
    grade: 'B+',
    enrollmentDate: '2023-09-03',
    performance: 83,
    attendance: 89,
    activities: [
      { description: 'Case study analysis', date: '2023-09-20' },
      { description: 'Group therapy observation', date: '2023-09-15' },
      { description: 'Research methodology presentation', date: '2023-09-10' }
    ]
  },
  {
    id: 14,
    name: 'Isabella Clark',
    email: 'isabella@example.com',
    course: 'Art History',
    grade: 'A-',
    enrollmentDate: '2023-09-01',
    performance: 87,
    attendance: 91,
    activities: [
      { description: 'Gallery exhibition review', date: '2023-09-18' },
      { description: 'Period analysis completed', date: '2023-09-13' },
      { description: 'Artist biography submitted', date: '2023-09-08' }
    ]
  },
  {
    id: 15,
    name: 'Mason Turner',
    email: 'mason@example.com',
    course: 'Engineering',
    grade: 'B+',
    enrollmentDate: '2023-09-02',
    performance: 85,
    attendance: 88,
    activities: [
      { description: 'Design project completed', date: '2023-09-19' },
      { description: 'CAD model submission', date: '2023-09-14' },
      { description: 'Team project collaboration', date: '2023-09-09' }
    ]
  }
];

// Load students from localStorage or use defaults
let students;
try {
  const savedStudents = localStorage.getItem('students');
  students = savedStudents ? JSON.parse(savedStudents) : [...defaultStudents];
  
  // If localStorage was empty, initialize it with default data
  if (!savedStudents) {
    localStorage.setItem('students', JSON.stringify(students));
  }
} catch (error) {
  console.error('Error loading from localStorage:', error);
  students = [...defaultStudents];
}

// Helper function to save students to localStorage
const saveStudents = () => {
  try {
    localStorage.setItem('students', JSON.stringify(students));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Helper function to convert performance to grade based on ranges
function performanceToGrade(performance) {
  if (performance >= 93) return 'A+';
  if (performance >= 90) return 'A';
  if (performance >= 87) return 'A-';
  if (performance >= 83) return 'B+';
  if (performance >= 80) return 'B';
  if (performance >= 77) return 'B-';
  if (performance >= 73) return 'C+';
  if (performance >= 70) return 'C';
  if (performance >= 67) return 'C-';
  if (performance >= 60) return 'D';
  return 'F';
}

// Helper function to convert grade to performance
function gradeToPerformance(grade) {
  // Return the middle value of the grade range
  switch (grade) {
    case 'A+': return 95; // 93-100
    case 'A': return 91;  // 90-92
    case 'A-': return 88; // 87-89
    case 'B+': return 85; // 83-86
    case 'B': return 81;  // 80-82
    case 'B-': return 78; // 77-79
    case 'C+': return 75; // 73-76
    case 'C': return 71;  // 70-72
    case 'C-': return 68; // 67-69
    case 'D': return 65;  // 60-66
    case 'F': return 50;  // 0-59
    default: return 75;
  }
}

// Mock endpoints
mock.onGet('/api/students').reply(200, students);

mock.onPost('/api/students').reply((config) => {
  const newStudent = JSON.parse(config.data);
  
  // If performance provided but no grade, calculate grade
  if (newStudent.performance && !newStudent.grade) {
    newStudent.grade = performanceToGrade(newStudent.performance);
  }
  // If grade provided but no performance, calculate performance
  else if (newStudent.grade && !newStudent.performance) {
    newStudent.performance = gradeToPerformance(newStudent.grade);
  }
  // Default values if neither is provided
  else if (!newStudent.grade && !newStudent.performance) {
    newStudent.performance = 75;
    newStudent.grade = 'C+';
  }
  
  if (!newStudent.attendance) {
    newStudent.attendance = Math.floor(Math.random() * 20) + 80; // 80-99%
  }
  
  if (!newStudent.activities) {
    newStudent.activities = [
      { description: 'Joined course', date: new Date().toISOString().split('T')[0] },
      { description: 'Completed enrollment', date: new Date().toISOString().split('T')[0] },
      { description: 'Initial assessment taken', date: new Date().toISOString().split('T')[0] }
    ];
  }
  
  // Get the highest existing ID and add 1
  const maxId = students.length > 0 ? Math.max(...students.map(s => s.id)) : 0;
  newStudent.id = maxId + 1;
  
  students.push(newStudent);
  
  // Save to localStorage
  saveStudents();
  
  return [201, newStudent];
});

mock.onPut(/\/api\/students\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  const updatedData = JSON.parse(config.data);
  
  const studentIndex = students.findIndex(student => student.id === id);
  
  if (studentIndex === -1) {
    return [404, { error: 'Student not found' }];
  }
  
  // If performance is provided, update the grade
  if (updatedData.performance !== undefined) {
    updatedData.grade = performanceToGrade(updatedData.performance);
  }
  // If grade is provided but not performance, update performance
  else if (updatedData.grade && !updatedData.performance) {
    updatedData.performance = gradeToPerformance(updatedData.grade);
  }
  
  // Update the student data while preserving the id
  students[studentIndex] = { ...students[studentIndex], ...updatedData, id };
  
  // Save to localStorage
  saveStudents();
  
  return [200, students[studentIndex]];
});

mock.onDelete(/\/api\/students\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  
  const studentIndex = students.findIndex(student => student.id === id);
  
  if (studentIndex === -1) {
    return [404, { error: 'Student not found' }];
  }
  
  // Remove the student from the array
  const deletedStudent = students.splice(studentIndex, 1)[0];
  
  // Save to localStorage
  saveStudents();
  
  return [200, { message: 'Student deleted successfully', student: deletedStudent }];
});

// Add a reset function to clear localStorage and restore defaults
const resetToDefaults = () => {
  students = [...defaultStudents];
  saveStudents();
  return { message: 'Data reset to defaults successfully', students: students };
};

export const api = {
  getStudents: () => axios.get('/api/students'),
  addStudent: (student) => axios.post('/api/students', student),
  updateStudent: (id, student) => axios.put(`/api/students/${id}`, student),
  deleteStudent: (id) => axios.delete(`/api/students/${id}`),
  resetData: () => Promise.resolve(resetToDefaults())
}; 