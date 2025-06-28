import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Dashboard() {
  const { user } = useAuth();

  if (!user || !user.emailVerified) {
    console.log("Dashboard: Redirecting to login, no user or unverified");
    return <Navigate to="/login" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 text-center"
    >
      <h2 className="text-3xl font-bold text-tech-neon mb-6">Dashboard</h2>
      <p className="text-tech-light text-lg">
        Welcome, {user.name}! Explore your personalized startup hub.
      </p>
    </motion.div>
  );
}

export default Dashboard;