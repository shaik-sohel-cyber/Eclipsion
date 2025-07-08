import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useState, useRef } from 'react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleLogout = async () => {
    try {
      console.log("Navbar: Logging out...");
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Navbar: Logout error:", err.message);
    }
  };

  const handleMouseEnter = () => {
    // Clear any existing timeout to prevent premature closing
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsProfileOpen(true);
  };

  const handleMouseLeave = () => {
    // Set a timeout to close the dropdown after 300ms
    timeoutRef.current = setTimeout(() => {
      setIsProfileOpen(false);
    }, 300);
  };

  const handleDropdownMouseEnter = () => {
    // Keep dropdown open when mouse is over the dropdown
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-tech-gray text-tech-light p-4 flex justify-between items-center shadow-lg border-b border-tech-neon/20"
    >
      <Link to="/" className="text-2xl font-bold tracking-tight text-tech-neon">College Startup Platform</Link>
      <div className="flex space-x-6 items-center">
        <Link to="/" className="hover:text-tech-neon transition">Home</Link>
        <Link to="/projects" className="hover:text-tech-neon transition">Projects</Link>
        <Link to="/hackathons" className="hover:text-tech-neon transition">Hackathons</Link>
        <Link to="/prototypes" className="hover:text-tech-neon transition">Prototypes</Link>
        <Link to="/courses" className="hover:text-tech-neon transition">Courses</Link>
        {user ? (
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="hover:text-tech-neon transition cursor-pointer">Profile</span>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-tech-gray border border-tech-neon/20 rounded-lg shadow-lg z-10"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-tech-light hover:bg-tech-blue hover:text-white transition"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-tech-light hover:bg-red-600 hover:text-white transition"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="hover:text-tech-neon transition">Login</Link>
            <Link to="/signup" className="hover:text-tech-neon transition">Sign Up</Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;