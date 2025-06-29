import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      console.log('Navbar: Logging out');
      await logout();
      setIsOpen(false);
    } catch (err) {
      console.error('Navbar: Logout error:', err.message);
    }
  };

  const navVariants = {
    open: { opacity: 1, height: 'auto' },
    closed: { opacity: 0, height: 0 },
  };

  const isAuthenticated = user && user.emailVerified;

  return (
    <nav className="bg-tech-dark border-b border-tech-neon/20">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-tech-neon">
          IgniteVault
        </Link>
        <button
          className="md:hidden text-tech-light focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
        <div className="hidden md:flex space-x-4">
          <Link to="/projects" className="text-tech-light hover:text-tech-neon">
            Projects
          </Link>
          <Link to="/hackathons" className="text-tech-light hover:text-tech-neon">
            Hackathons
          </Link>
          <Link to="/prototypes" className="text-tech-light hover:text-tech-neon">
            Prototypes
          </Link>
          <Link to="/courses" className="text-tech-light hover:text-tech-neon">
            Courses
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-tech-light hover:text-tech-neon">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-tech-light hover:text-red-500"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-tech-light hover:text-tech-neon">
              Login
            </Link>
          )}
        </div>
      </div>
      <motion.div
        className="md:hidden overflow-hidden"
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={navVariants}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col space-y-2 p-4">
          <Link to="/projects" className="text-tech-light hover:text-tech-neon" onClick={() => setIsOpen(false)}>
            Projects
          </Link>
          <Link to="/hackathons" className="text-tech-light hover:text-tech-neon" onClick={() => setIsOpen(false)}>
            Hackathons
          </Link>
          <Link to="/prototypes" className="text-tech-light hover:text-tech-neon" onClick={() => setIsOpen(false)}>
            Prototypes
          </Link>
          <Link to="/courses" className="text-tech-light hover:text-tech-neon" onClick={() => setIsOpen(false)}>
            Courses
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-tech-light hover:text-tech-neon" onClick={() => setIsOpen(false)}>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-tech-light hover:text-red-500 text-left"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-tech-light hover:text-tech-neon" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          )}
        </div>
      </motion.div>
    </nav>
  );
}

export default Navbar;