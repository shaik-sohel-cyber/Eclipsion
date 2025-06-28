import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function HackathonCard({ hackathon }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-tech-gray rounded-lg p-4 shadow-lg border border-tech-neon/20"
    >
      <h3 className="text-xl font-semibold text-tech-neon">{hackathon.title}</h3>
      <p className="text-tech-light">Date: {hackathon.date}</p>
      <p className="text-tech-light">Type: {hackathon.type}</p>
      <p className="text-tech-light">{hackathon.description}</p>
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(`/hackathons/${hackathon.id}`)}
        className="mt-2 bg-tech-blue text-white rounded-lg p-2 w-full font-semibold hover:bg-blue-700 transition"
        aria-label={`Join ${hackathon.title}`}
      >
        Join Hackathon
      </motion.button>
    </motion.div>
  );
}

export default HackathonCard;