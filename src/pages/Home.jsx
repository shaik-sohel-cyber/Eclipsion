import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const projectsSnap = await getDocs(collection(db, 'projects'));
        const hackathonsSnap = await getDocs(collection(db, 'hackathons'));
        const featuredItems = [
          ...projectsSnap.docs.map(doc => ({ id: doc.id, type: 'project', ...doc.data() })),
          ...hackathonsSnap.docs.map(doc => ({ id: doc.id, type: 'hackathon', ...doc.data() }))
        ].slice(0, 4);
        setFeatured(featuredItems);
      } catch (err) {
        console.error('Home: Fetch featured error:', err.message);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 text-center"
    >
      <h2 className="text-4xl font-bold text-tech-neon mb-6">Welcome to College Startup Platform</h2>
      <p className="text-tech-light text-lg max-w-2xl mx-auto mb-8">
        Collaborate, Innovate, Succeed. Join college students to build startups, participate in hackathons, and connect with investors.
      </p>
      <div className="flex justify-center space-x-4 mb-8">
        <Link to="/projects" className="bg-tech-blue text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition" aria-label="Explore Projects">Explore Projects</Link>
        <Link to="/hackathons" className="bg-tech-blue text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition" aria-label="Join a Hackathon">Join a Hackathon</Link>
        <Link to="/prototypes" className="bg-tech-blue text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition" aria-label="View Prototypes">View Prototypes</Link>
        <Link to="/courses" className="bg-tech-blue text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition" aria-label="Enroll in Courses">Enroll in Courses</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featured.map(item => (
          <div key={item.id} className="bg-tech-gray rounded-lg p-4 shadow-lg border border-tech-neon/20">
            <h3 className="text-xl font-semibold text-tech-neon">{item.title}</h3>
            <p className="text-tech-light">{item.description || `Explore this ${item.type}.`}</p>
            <Link to={`/${item.type}s/${item.id}`} className="text-tech-neon hover:underline" aria-label={`View ${item.title}`}>View {item.type}</Link>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Home;