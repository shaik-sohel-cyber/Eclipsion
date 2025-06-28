import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

function CourseCard({ course }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        enrolledCourses: arrayUnion(course.id)
      });
      navigate(`/courses/${course.id}`);
    } catch (err) {
      console.error('CourseCard: Enroll error:', err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-tech-gray rounded-lg p-4 shadow-lg border border-tech-neon/20"
    >
      <h3 className="text-xl font-semibold text-tech-neon">{course.title}</h3>
      <p className="text-tech-light">{course.description}</p>
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleEnroll}
        className="mt-2 bg-tech-blue text-white rounded-lg p-2 w-full font-semibold hover:bg-blue-700 transition"
        aria-label={`Enroll in ${course.title}`}
      >
        Enroll
      </motion.button>
    </motion.div>
  );
}

export default CourseCard;