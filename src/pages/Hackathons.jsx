import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import HackathonCard from '../components/HackathonCard';
import { useAuth } from '../context/AuthContext';

function Hackathons() {
  const { user } = useAuth();
  const [hackathons, setHackathons] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const types = ['All', 'open', 'college'];

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        console.log('Hackathons: Fetching hackathons...');
        const snap = await getDocs(collection(db, 'hackathons'));
        const hackathonsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHackathons(hackathonsData);
        setLoading(false);
      } catch (err) {
        console.error('Hackathons: Fetch error:', err.message);
        setError('Failed to load hackathons.');
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  if (!user || !user.emailVerified) {
    console.log("Hackathons: Redirecting to login, no user or unverified");
    return <Navigate to="/login" />;
  }

  const filteredHackathons = typeFilter && typeFilter !== 'All'
    ? hackathons.filter(hackathon => hackathon.type === typeFilter)
    : hackathons;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <h2 className="text-3xl font-bold text-tech-neon mb-6 text-center">Hackathons</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="mb-4">
        <label htmlFor="type-filter" className="text-tech-light mr-2">Filter by Type:</label>
        <select
          id="type-filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-tech-dark border border-tech-light/20 rounded-lg p-2 text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
          aria-label="Filter hackathons by type"
        >
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="text-tech-light text-center">Loading hackathons...</p>
      ) : filteredHackathons.length === 0 ? (
        <p className="text-tech-light text-center">No hackathons found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHackathons.map(hackathon => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Hackathons;