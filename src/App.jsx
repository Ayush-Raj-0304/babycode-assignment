import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { observeAuthState } from './services/firebase';
import StudentList from './components/StudentList';
import AddStudentForm from './components/AddStudentForm';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';
import NotFound from './components/NotFound';
import { motion, AnimatePresence } from 'framer-motion';

function Dashboard({ user }) {
  const [view, setView] = useState('students'); // 'students' or 'add-student'

  const handleAddNewClick = () => {
    setView(view === 'students' ? 'add-student' : 'students');
  };

  const handleStudentAdded = () => {
    // Switch back to student list view after adding a student
    setView('students');
  };

  const renderMainContent = () => {
    switch(view) {
      case 'add-student':
        return <AddStudentForm user={user} onStudentAdded={handleStudentAdded} />;
      case 'students':
      default:
        return <StudentList />;
    }
  };

  return (
    <>
      <Navbar user={user} onAddNewClick={handleAddNewClick} currentView={view} />
      
      <main className="flex-grow flex items-start pt-24 pb-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              key={view} // This forces re-animation when view changes
            >
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
                {view === 'students' ? 'Student List' : 'Add New Student'}
              </h1>
              {view === 'students' && (
                <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                  Browse and filter the list of students. Use the course filter to narrow down results.
                </p>
              )}
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, x: view === 'students' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: view === 'students' ? 20 : -20 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30 
                }}
              >
                {renderMainContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </>
  );
}

function AuthWrapper() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'

  useEffect(() => {
    const unsubscribe = observeAuthState((user) => {
      setUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const switchToSignup = () => {
    setAuthView('signup');
  };

  const switchToLogin = () => {
    setAuthView('login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-secondary-50 dark:bg-secondary-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center py-10">
        <div className="w-full max-w-md mb-4 flex justify-end">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          {authView === 'signup' 
            ? <Signup onSignupSuccess={() => setAuthView('login')} onBackToLogin={switchToLogin} /> 
            : <Login onSwitchToSignup={switchToSignup} />}
        </div>
      </div>
    );
  }

  return <Dashboard user={user} />;
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-secondary-50 transition-colors duration-200">
        <Routes>
          <Route path="/" element={<AuthWrapper />} />
          <Route path="/privacy-policy" element={<NotFound />} />
          <Route path="/terms-of-service" element={<NotFound />} />
          <Route path="/contact" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <motion.footer 
          className="bg-white dark:bg-secondary-800 py-6 border-t border-secondary-200 dark:border-secondary-700 mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 30,
            delay: 0.3
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:justify-between items-center">
              <motion.p 
                className="text-sm text-secondary-500 dark:text-secondary-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Student Dashboard © {new Date().getFullYear()}
              </motion.p>
              <motion.div 
                className="mt-4 md:mt-0 flex space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/privacy-policy" className="text-sm text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300">Privacy Policy</Link>
                <Link to="/terms-of-service" className="text-sm text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300">Terms of Service</Link>
                <Link to="/contact" className="text-sm text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300">Contact</Link>
              </motion.div>
            </div>
          </div>
        </motion.footer>
      </div>
    </Router>
  );
}

export default App;
