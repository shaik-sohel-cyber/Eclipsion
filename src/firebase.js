// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, sendEmailVerification } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEIK_uxC7npVN3ozq3hoqnvLerJMPVKWs",
  authDomain: "sol1-80a77.firebaseapp.com",
  projectId: "sol1-80a77",
  storageBucket: "sol1-80a77.firebasestorage.app",
  messagingSenderId: "135849792875",
  appId: "1:135849792875:web:5ef246940742cfe956282e",
  measurementId: "G-T7HZ0E3XRC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase initialized:', app.name);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export Firebase services and methods
export {
  auth,
  googleProvider,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification
};