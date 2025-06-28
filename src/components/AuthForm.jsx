import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const domains = ['AI', 'IoT', 'FinTech', 'Web Development', 'Mobile Apps'];

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          role: 'user'
        });
        await sendEmailVerification(user);
        setError('Please verify your email before logging in.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        console.log(`AuthForm: Login for: ${email}`);
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(`AuthForm: ${type} error:`, err.message);
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('AuthForm: Google Sign-In');
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error('AuthForm: Google Sign-In error:', err.message);
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
      <div className="bg-tech-gray shadow-2xl rounded-lg p-8 max-w-md mx-auto border border-tech-neon/20">
        <h2 className="text-3xl font-bold text-tech-neon mb-6 text-center">
          {type === 'login' ? 'Welcome Back' : 'Join College Startup Platform'}
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
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
                {domains.map(d => <option key={d} value={d}>{d}</option>)}
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
          <p className="mt-4 text-center text-tech-light">
            Forgot password?{' '}
            <a href="/reset-password" className="text-tech-neon hover:underline">Reset Password</a>
          </p>
        )}
        {type === 'signup' && (
          <p className="mt-4 text-center text-tech-light">
            Already have an account?{' '}
            <a href="/login" className="text-tech-neon hover:underline">Login</a>
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default AuthForm;