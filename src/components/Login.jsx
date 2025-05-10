import { useState } from 'react';
import { login, demoLogin } from '../services/firebase';
import { motion } from 'framer-motion';

export default function Login({ onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      // Auth state observer in App will handle redirect
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Set demo credentials
      setEmail('one@one.com');
      setPassword('12345678');
      
      // Submit the form with demo credentials
      await login('one@one.com', '12345678');
    } catch (error) {
      setError('Demo login failed. Please try again.');
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
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">Welcome to <br /> <span className="text-primary-500">Student Dashboard</span></h1>
          <p className="text-secondary-500 dark:text-secondary-400">Enter your credentials to access your account</p>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-50 text-sm text-red-500 border-l-4 border-red-500">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input-field"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="label">
                Password
              </label>
              <button 
                type="button" 
                className="text-xs font-medium text-primary-600 hover:text-primary-500"
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full mt-6"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="mt-4">
            <p className="text-center text-sm text-secondary-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200"></div>
            </div>
            <div className="relative flex justify-center text-xs ">
              <span className="px-2 bg-white text-secondary-500 dark:text-secondary-400 dark:bg-secondary-800">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="btn btn-secondary w-full"
            >
              <svg className="mr-2 -ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.9998 20C19.9998 17.7909 16.4184 16 11.9998 16C7.58115 16 3.99976 17.7909 3.99976 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Demo Account (No Registration)
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 