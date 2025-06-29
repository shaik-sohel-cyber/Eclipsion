import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

function Sidebar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      console.log('Sidebar: Logging out');
      await logout();
      setIsOpen(false);
    } catch (err) {
      console.error('Sidebar: Logout error:', err.message);
    }
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  const isAuthenticated = user && user.emailVerified;

  return (
    <motion.aside
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      transition={{ duration: 0.3 }}
      className="bg-tech-dark w-64 h-screen border-r border-tech-neon/20 fixed md:static z-10"
    >
      <div className="p-4">
        <button
          className="md:hidden text-tech-light mb-4 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle sidebar"
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
        <div className="space-y-4">
          <Link to="/dashboard" className="block text-tech-light hover:text-tech-neon">
            Dashboard
          </Link>
          <Link to="/projects" className="block text-tech-light hover:text-tech-neon">
            Projects
          </Link>
          <Link to="/hackathons" className="block text-tech-light hover:text-tech-neon">
            Hackathons
          </Link>
          <Link to="/prototypes" className="block text-tech-light hover:text-tech-neon">
            Prototypes
          </Link>
          <Link to="/courses" className="block text-tech-light hover:text-tech-neon">
            Courses
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="block text-tech-light hover:text-tech-neon">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block text-tech-light hover:text-red-500"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="block text-tech-light hover:text-tech-neon">
              Login
            </Link>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;