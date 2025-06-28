import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Sidebar: Logging out...");
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Sidebar: Logout error:", err.message);
    }
  };

  return (
    <motion.div
      initial={{ width: isOpen ? 256 : 64 }}
      animate={{ width: isOpen ? 256 : 64 }}
      transition={{ duration: 0.3 }}
      className="bg-tech-gray text-tech-light h-screen shadow-lg border-r border-tech-neon/20"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 w-full text-left hover:bg-tech-blue/50 transition"
        aria-label="Toggle sidebar"
      >
        {isOpen ? 'Close' : '☰'}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 space-y-4"
        >
          <Link to="/" className="block hover:text-tech-neon transition">Home</Link>
          <Link to="/projects" className="block hover:text-tech-neon transition">Projects</Link>
          <Link to="/hackathons" className="block hover:text-tech-neon transition">Hackathons</Link>
          <Link to="/prototypes" className="block hover:text-tech-neon transition">Prototypes</Link>
          <Link to="/courses" className="block hover:text-tech-neon transition">Courses</Link>
          {user ? (
            <>
              <Link to="/profile" className="block hover:text-tech-neon transition">Profile</Link>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-tech-blue text-white rounded-lg p-2 w-full font-semibold hover:bg-blue-700 transition"
                aria-label="Logout"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login" className="block hover:text-tech-neon transition">Login</Link>
              <Link to="/signup" className="block hover:text-tech-neon transition">Sign Up</Link>
              <Link to="/reset-password" className="block hover:text-tech-neon transition">Reset Password</Link>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default Sidebar;