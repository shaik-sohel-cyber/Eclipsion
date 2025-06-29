import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Map Firebase error codes to user-friendly messages
  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
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
    setShowModal(false);
    try {
      console.log(`ResetPassword: Sending password reset email for: ${email}`);
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Check your inbox or spam folder.');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('ResetPassword: Error:', err.message);
      setError(getFriendlyErrorMessage(err.code));
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (error.includes('sign up')) {
      navigate('/signup');
    } else if (message) {
      navigate('/login');
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
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
            required
            aria-label="Email"
          />
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-tech-blue text-white rounded-lg p-3 w-full font-semibold hover:bg-blue-700 transition"
            aria-label="Send Reset Email"
          >
            Send Reset Email
          </motion.button>
        </form>
        <p className="mt-4 text-center text-tech-light">
          Back to{' '}
          <a href="/login" className="text-tech-neon hover:underline">
            Login
          </a>
        </p>
      </div>

      {/* Modal for Errors and Success Messages */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-labelledby="modal-title"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-tech-gray rounded-lg p-6 max-w-sm w-full border border-tech-neon/20"
            >
              <h3
                id="modal-title"
                className="text-xl font-bold text-center mb-4"
                style={{ color: error ? '#ef4444' : '#00e5ff' }}
              >
                {error ? 'Error' : 'Success'}
              </h3>
              <p className="text-tech-light mb-4 text-center">{error || message}</p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleModalClose}
                className="bg-tech-blue text-white rounded-lg p-3 w-full font-semibold hover:bg-blue-700 transition"
                aria-label={error && error.includes('sign up') ? 'Go to Sign Up' : 'Close Modal'}
              >
                {error && error.includes('sign up') ? 'Go to Sign Up' : 'Close'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ResetPassword;