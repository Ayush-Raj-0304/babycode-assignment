import { useState } from 'react';
import { logout, demoLogout } from '../services/firebase';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ user, onAddNewClick, currentView }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Try regular Firebase logout first, but fallback to demo logout if needed
      if (localStorage.getItem('demo-user')) {
        await demoLogout();
      } else {
        await logout();
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoClick = () => {
    if (currentView !== 'students') {
      onAddNewClick();
    }
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-secondary-900 shadow-sm border-b border-gray-200 dark:border-secondary-800"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300,
        damping: 30 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={handleLogoClick}
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">Student Dashboard</span>
              </button>
            </div>
          </div>
          
          {user && (
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <ThemeToggle />
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onAddNewClick}
                className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === 'add-student' 
                  ? 'text-primary-700 bg-primary-50 dark:text-primary-300 dark:bg-primary-900/30' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-secondary-800'}`}
              >
                {currentView === 'add-student' ? 'Back to Student List' : 'Add New Student'}
              </motion.button>
              
              <div className="relative ml-3">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-end text-right">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                      {user.email || 'Demo User'}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="inline-flex items-center text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Sign out
                    </motion.button>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="bg-primary-100 dark:bg-primary-900/50 rounded-full h-9 w-9 flex items-center justify-center text-sm font-medium text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
                  >
                    {user.email ? user.email.charAt(0).toUpperCase() : 'D'}
                  </motion.div>
                </div>
              </div>
            </div>
          )}
          
          <div className="-mr-2 flex items-center sm:hidden">
            <div className="mr-2 sm:hidden">
              <ThemeToggle />
            </div>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-400 dark:hover:bg-secondary-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="sm:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {user && (
              <div className="pt-2 pb-3 space-y-1">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onAddNewClick();
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-base font-medium ${
                    currentView === 'add-student'
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-secondary-800'
                  }`}
                >
                  {currentView === 'add-student' ? 'Back to Student List' : 'Add New Student'}
                </motion.button>
                
                <div className="px-4 py-3 border-t border-gray-200 dark:border-secondary-800">
                  <div className="flex items-center">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="bg-primary-100 dark:bg-primary-900/50 rounded-full h-9 w-9 flex items-center justify-center text-sm font-medium text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
                    >
                      {user.email ? user.email.charAt(0).toUpperCase() : 'D'}
                    </motion.div>
                    <div className="ml-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {user.email || 'Demo User'}
                    </div>
                  </div>
                  <div className="mt-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 dark:text-red-300 dark:bg-red-900/20 dark:hover:bg-red-900/30"
                    >
                      Sign out
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 