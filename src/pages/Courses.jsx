import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';

function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('Courses: Fetching courses...');
        const snap = await getDocs(collection(db, 'courses'));
        const coursesData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesData);
        setLoading(false);
      } catch (err) {
        console.error('Courses: Fetch error:', err.message);
        setError('Failed to load courses.');
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (!user || !user.emailVerified) {
    console.log("Courses: Redirecting to login, no user or unverified");
    return <Navigate to="/login" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <h2 className="text-3xl font-bold text-tech-neon mb-6 text-center">Courses</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {loading ? (
        <p className="text-tech-light text-center">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-tech-light text-center">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-tech-neon mb-2">Project Templates</h3>
        <p className="text-tech-light">Download templates to kickstart your projects:</p>
        <div className="flex flex-wrap gap-4 mt-2">
          <a href="https://github.com/example/react-template" target="_blank" rel="noopener noreferrer" className="bg-tech-blue text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition" aria-label="Download React Template">React Template</a>
          <a href="https://github.com/example/html-css-template" target="_blank" rel="noopener noreferrer" className="bg-tech-blue text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition" aria-label="Download HTML/CSS Template">HTML/CSS Template</a>
        </div>
        <p className="text-tech-light mt-2">Guidelines: Structure your project with clear documentation, modular code, and regular updates.</p>
      </div>
    </motion.div>
  );
}

export default Courses;