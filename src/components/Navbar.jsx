import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Navbar: Logging out...");
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Navbar: Logout error:", err.message);
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
      <div className="space-x-6">
        <Link to="/" className="hover:text-tech-neon transition">Home</Link>
        <Link to="/projects" className="hover:text-tech-neon transition">Projects</Link>
        <Link to="/hackathons" className="hover:text-tech-neon transition">Hackathons</Link>
        <Link to="/prototypes" className="hover:text-tech-neon transition">Prototypes</Link>
        <Link to="/courses" className="hover:text-tech-neon transition">Courses</Link>
        {user ? (
          <>
            <Link to="/profile" className="hover:text-tech-neon transition">Profile</Link>
            <motion.button
              whileHover={{ scale: 1.1, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="bg-tech-blue text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition"
              aria-label="Logout"
            >
              Logout
            </motion.button>
          </>
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