import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { onAuthStateChanged, signOut, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("AuthContext: Checking auth state...");
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        setUser({ ...currentUser, ...userDoc.data() });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => {
      console.log("AuthContext: Unsubscribing...");
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      console.log("AuthContext: Logging out...");
      await signOut(auth);
    } catch (err) {
      console.error("AuthContext: Logout error:", err.message);
      setError(err.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log("AuthContext: Google Sign-In...");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || 'User',
        email: user.email,
        college: '',
        domain: '',
        currentProject: null,
        enrolledCourses: [],
        completedProjects: [],
        role: 'user'
      }, { merge: true });
      await sendEmailVerification(user);
    } catch (err) {
      console.error("AuthContext: Google Sign-In error:", err.message);
      setError(err.message);
    }
  };

  const value = { user, logout, signInWithGoogle };

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="text-center p-4 text-tech-neon">Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}