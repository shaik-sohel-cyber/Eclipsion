import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { auth, db, sendEmailVerification } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function AuthForm({ type }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'redirectToSignup' or null
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const domains = ['AI', 'IoT', 'FinTech', 'Web Development', 'Mobile Apps'];

  // Map Firebase error codes to user-friendly messages
  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found. Please sign up.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please log in or use a different email.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long.';
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setShowErrorModal(false);
    setModalAction(null);
    try {
      if (type === 'signup') {
        console.log(`AuthForm: Signup for: ${email}`);
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        await setDoc(doc(db, 'users', user.uid), {
          name,
          email,
          college,
          domain,
          currentProject: null,
          enrolledCourses: [],
          completedProjects: [],
          role: 'user',
        });
        await sendEmailVerification(user);
        setMessage('Please verify your email to fully access your account.');
        setTimeout(() => navigate('/'), 3000);
      } else {
        console.log(`AuthForm: Login for: ${email}`);
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        if (!user.emailVerified) {
          setError('Please verify your email to log in.');
          setModalAction('redirectToSignup');
          setShowErrorModal(true);
          await auth.signOut(); // Sign out unverified user
          return;
        }
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(`AuthForm: ${type} error:`, err.message);
      const friendlyError = getFriendlyErrorMessage(err.code);
      if (type === 'login') {
        setError(friendlyError);
        setModalAction(err.code === 'auth/user-not-found' ? 'redirectToSignup' : null);
        setShowErrorModal(true);
      } else {
        setError(friendlyError);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setMessage('');
    setShowErrorModal(false);
    setModalAction(null);
    try {
      console.log('AuthForm: Google Sign-In');
      const result = await signInWithGoogle();
      const user = result.user;
      if (type === 'login' && !user.emailVerified) {
        setError('Please verify your email to log in.');
        setModalAction('redirectToSignup');
        setShowErrorModal(true);
        await auth.signOut(); // Sign out unverified user
        return;
      }
      navigate('/');
    } catch (err) {
      console.error('AuthForm: Google Sign-In error:', err.message);
      const friendlyError = getFriendlyErrorMessage(err.code);
      if (type === 'login') {
        setError(friendlyError);
        setModalAction(err.code === 'auth/user-not-found' ? 'redirectToSignup' : null);
        setShowErrorModal(true);
      } else {
        setError(friendlyError);
      }
    }
  };

  const handleModalClose = () => {
    setShowErrorModal(false);
    if (modalAction === 'redirectToSignup') {
      navigate('/signup');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <div className="bg-tech-gray shadow-2xl rounded-lg p-8 max-w-md mx-auto border border-tech-neon/20">
        <h2 className="text-3xl font-bold text-tech-neon mb-6 text-center">
          {type === 'login' ? 'Welcome Back' : 'Join College Startup Platform'}
        </h2>
        {type === 'signup' && error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-tech-neon mb-4 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'signup' && (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
                required
                aria-label="Full Name"
              />
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="College Name"
                className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
                required
                aria-label="College Name"
              />
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
                required
                aria-label="Preferred Domain"
              >
                <option value="">Select Domain</option>
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
            required
            aria-label="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
            required
            aria-label="Password"
          />
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-tech-blue text-white rounded-lg p-3 w-full font-semibold hover:bg-blue-700 transition"
            aria-label={type === 'login' ? 'Login' : 'Sign Up'}
          >
            {type === 'login' ? 'Login' : 'Sign Up'}
          </motion.button>
        </form>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleSignIn}
          className="mt-4 bg-tech-neon text-tech-dark rounded-lg p-3 w-full font-semibold hover:bg-blue-400 transition"
          aria-label="Sign in with Google"
        >
          Sign in with Google
        </motion.button>
        {type === 'login' && (
          <div className="mt-4 text-center text-tech-light space-y-2">
            <p>
              Forgot password?{' '}
              <a href="/reset-password" className="text-tech-neon hover:underline">
                Reset Password
              </a>
            </p>
            <p>
              Don't have an account?{' '}
              <a href="/signup" className="text-tech-neon hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        )}
        {type === 'signup' && (
          <p className="mt-4 text-center text-tech-light">
            Already have an account?{' '}
            <a href="/login" className="text-tech-neon hover:underline">
              Login
            </a>
          </p>
        )}
      </div>

      {/* Error Modal for Login Failures */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-labelledby="error-modal-title"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-tech-gray rounded-lg p-6 max-w-sm w-full border border-tech-neon/20"
            >
              <h3
                id="error-modal-title"
                className="text-xl font-bold text-red-500 mb-4 text-center"
              >
                {modalAction === 'redirectToSignup' ? 'Account Issue' : 'Login Failed'}
              </h3>
              <p className="text-tech-light mb-4 text-center">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleModalClose}
                className="bg-tech-blue text-white rounded-lg p-3 w-full font-semibold hover:bg-blue-700 transition"
                aria-label={modalAction === 'redirectToSignup' ? 'Go to Sign Up' : 'Close Error Modal'}
              >
                {modalAction === 'redirectToSignup' ? 'Go to Sign Up' : 'Close'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AuthForm;