import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

function CourseContent() {
  const { user } = useAuth();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log('CourseContent: Fetching course:', id);
        const courseDoc = await getDoc(doc(db, 'courses', id));
        if (!courseDoc.exists()) {
          setError('Course not found.');
          setLoading(false);
          return;
        }
        setCourse({ id: courseDoc.id, ...courseDoc.data() });
        setLoading(false);
      } catch (err) {
        console.error('CourseContent: Fetch error:', err.message);
        setError('Failed to load course content.');
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (!user || !user.emailVerified) {
    console.log("CourseContent: Redirecting to login, no user or unverified");
    return <Navigate to="/login" />;
  }

  if (!user.enrolledCourses.includes(id)) {
    console.log("CourseContent: Redirecting to courses, not enrolled");
    return <Navigate to="/courses" />;
  }

  if (loading) return <p className="text-tech-light text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!course) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <h2 className="text-3xl font-bold text-tech-neon mb-6 text-center">{course.title}</h2>
      <div className="bg-tech-gray shadow-2xl rounded-lg p-8 max-w-2xl mx-auto border border-tech-neon/20">
        <p className="text-tech-light mb-4"><strong>Description:</strong> {course.description}</p>
        <div className="text-tech-light">
          <h3 className="text-xl font-semibold text-tech-neon mb-2">Course Content</h3>
          <p>{course.content || 'This is mock course content. In a real implementation, this would include lessons, videos, or external links.'}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default CourseContent;