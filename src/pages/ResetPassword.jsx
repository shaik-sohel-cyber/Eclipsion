import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("ResetPassword: Sending reset email to:", email);
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
      setEmail('');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error("ResetPassword: Error:", err.message);
      setError(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <form className="bg-tech-gray shadow-2xl rounded-lg p-8 max-w-md mx-auto border border-tech-neon/20">
        <h2 className="text-3xl font-bold text-tech-neon mb-6 text-center">Reset Password</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-tech-neon mb-4 text-center">{message}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon mb-4"
          required
          aria-label="Email"
        />
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="bg-tech-blue text-white rounded-lg p-3 w-full font-semibold hover:bg-blue-700 transition"
          aria-label="Send Reset Email"
        >
          Send Reset Email
        </motion.button>
      </form>
    </motion.div>
  );
}

export default ResetPassword;