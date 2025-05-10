import { useState } from 'react';
import { signup } from '../services/firebase';
import { motion } from 'framer-motion';

export default function Signup({ onSignupSuccess, onBackToLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup(formData.email, formData.password);
      if (onSignupSuccess) onSignupSuccess();
    } catch (error) {
      // Handle different Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use. Please use a different email or log in.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="card w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        duration: 0.3 
      }}
    >
      <div className="p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Create an Account</h1>
          <p className="text-secondary-500 dark:text-white">Sign up to access the student management dashboard</p>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-50 text-sm text-red-500 border-l-4 border-red-500">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input-field"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            <p className="text-xs text-secondary-500 mt-1">Must be at least 6 characters</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="input-field"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full mt-6"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="mt-4">
            <p className="text-center text-sm text-secondary-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onBackToLogin}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Log in
              </button>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
} 