import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import PrototypeCard from '../components/PrototypeCard';
import { useAuth } from '../context/AuthContext';

function Prototypes() {
  const { user } = useAuth();
  const [prototypes, setPrototypes] = useState([]);
  const [domainFilter, setDomainFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const domains = ['All', 'AI', 'IoT', 'FinTech', 'Web Development', 'Mobile Apps'];

  useEffect(() => {
    const fetchPrototypes = async () => {
      try {
        console.log('Prototypes: Fetching prototypes...');
        const snap = await getDocs(collection(db, 'prototypes'));
        const prototypesData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPrototypes(prototypesData);
        setLoading(false);
      } catch (err) {
        console.error('Prototypes: Fetch error:', err.message);
        setError('Failed to load prototypes.');
        setLoading(false);
      }
    };
    fetchPrototypes();
  }, []);

  if (!user || !user.emailVerified) {
    console.log("Prototypes: Redirecting to login, no user or unverified");
    return <Navigate to="/login" />;
  }

  const filteredPrototypes = domainFilter && domainFilter !== 'All'
    ? prototypes.filter(prototype => prototype.domain === domainFilter)
    : prototypes;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <h2 className="text-3xl font-bold text-tech-neon mb-6 text-center">Prototypes</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="mb-4">
        <label htmlFor="domain-filter" className="text-tech-light mr-2">Filter by Domain:</label>
        <select
          id="domain-filter"
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="bg-tech-dark border border-tech-light/20 rounded-lg p-2 text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
          aria-label="Filter prototypes by domain"
        >
          {domains.map(domain => (
            <option key={domain} value={domain}>{domain}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="text-tech-light text-center">Loading prototypes...</p>
      ) : filteredPrototypes.length === 0 ? (
        <p className="text-tech-light text-center">No prototypes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrototypes.map(prototype => (
            <PrototypeCard key={prototype.id} prototype={{ ...prototype, creatorName: prototype.creatorName || 'Unknown' }} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Prototypes;