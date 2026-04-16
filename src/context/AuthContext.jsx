// Auth Context — provides authentication state throughout the app
// Listens to Firebase Auth state changes and fetches Firestore user data

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getUserData } from '../services/authService';

const AuthContext = createContext();

/**
 * Custom hook to access auth context values
 * @returns {{ currentUser, userData, loading }}
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Auth Provider — wraps app and provides auth state
 * Automatically fetches Firestore user data when auth state changes
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Fetch extended user data from Firestore
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
