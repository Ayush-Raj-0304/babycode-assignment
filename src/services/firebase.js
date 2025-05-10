import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// Replace with your Firebase project configuration
// Use environment variables with fallbacks for development
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123def456"
};

// Initialize Firebase only if API key is provided, otherwise we'll use the demo mode
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  // We'll fall back to demo mode
}

// For demo purposes, we'll provide a mock login function
export const demoLogin = () => {
  // This simulates a successful login without actual Firebase credentials
  const fakeUser = {
    uid: 'demo-user-123',
    email: 'one@one.com',
    displayName: 'Demo User'
  };
  
  // Set the fake user on local storage for "persistence"
  localStorage.setItem('demo-user', JSON.stringify(fakeUser));
  
  // Fire any auth state listeners
  if (authStateListeners.length > 0) {
    authStateListeners.forEach(listener => listener(fakeUser));
  }
  
  return Promise.resolve(fakeUser);
};

// For demo purposes, we'll provide a mock logout function
export const demoLogout = () => {
  localStorage.removeItem('demo-user');
  
  // Fire any auth state listeners
  if (authStateListeners.length > 0) {
    authStateListeners.forEach(listener => listener(null));
  }
  
  return Promise.resolve();
};

// Track authentication state listeners
const authStateListeners = [];

// Real Firebase functions (with fallbacks to demo functions if Firebase isn't initialized)
export const login = async (email, password) => {
  if (!auth) {
    return demoLogin();
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signup = async (email, password) => {
  if (!auth) {
    return demoLogin();
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  if (!auth) {
    return demoLogout();
  }
  
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Custom auth state observer that works with both Firebase and demo mode
export const observeAuthState = (callback) => {
  // Check if we have a demo user
  const demoUser = localStorage.getItem('demo-user');
  
  if (demoUser) {
    callback(JSON.parse(demoUser));
    authStateListeners.push(callback);
    return () => {
      const index = authStateListeners.indexOf(callback);
      if (index !== -1) {
        authStateListeners.splice(index, 1);
      }
    };
  } else if (auth) {
    // Use real Firebase auth state
    return onAuthStateChanged(auth, callback);
  } else {
    // No auth, just return a placeholder unsubscribe
    return () => {};
  }
};

export { auth }; 