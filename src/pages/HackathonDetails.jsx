import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

function HackathonDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [slot, setSlot] = useState('');
  const [winner, setWinner] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const slots = ['Slot 1', 'Slot 2', 'Slot 3'];

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        console.log('HackathonDetails: Fetching hackathon:', id);
        const hackathonDoc = await getDoc(doc(db, 'hackathons', id));
        if (!hackathonDoc.exists()) {
          setError('Hackathon not found.');
          setLoading(false);
          return;
        }
        setHackathon({ id: hackathonDoc.id, ...hackathonDoc.data() });
        setLoading(false);
      } catch (err) {
        console.error('HackathonDetails: Fetch error:', err.message);
        setError('Failed to load hackathon details.');
        setLoading(false);
      }
    };
    fetchHackathon();
  }, [id]);

  const handleBookSlot = async (e) => {
    e.preventDefault();
    try {
      console.log('HackathonDetails: Booking slot:', slot);
      await addDoc(collection(db, 'hackathons', id, 'bookings'), {
        userId: user.uid,
        slot,
        bookedAt: new Date().toISOString()
      });
      await updateDoc(doc(db, 'hackathons', id), {
        participants: [...(hackathon.participants || []), user.uid]
      });
      setHackathon(prev => ({ ...prev, participants: [...(prev.participants || []), user.uid] }));
      alert('Slot booked successfully!');
    } catch (err) {
      console.error('HackathonDetails: Book slot error:', err.message);
      setError('Failed to book slot.');
    }
  };

  const handleSubmitResults = async (e) => {
    e.preventDefault();
    try {
      console.log('HackathonDetails: Submitting results:', winner);
      await updateDoc(doc(db, 'hackathons', id), { results: winner });
      setHackathon(prev => ({ ...prev, results: winner }));
      alert('Results submitted successfully!');
    } catch (err) {
      console.error('HackathonDetails: Submit results error:', err.message);
      setError('Failed to submit results.');
    }
  };

  if (!user || !user.emailVerified) {
    console.log("HackathonDetails: Redirecting to login, no user or unverified");
    return <Navigate to="/login" />;
  }

  if (loading) return <p className="text-tech-light text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!hackathon) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <h2 className="text-3xl font-bold text-tech-neon mb-6 text-center">{hackathon.title}</h2>
      <div className="bg-tech-gray shadow-2xl rounded-lg p-8 max-w-2xl mx-auto border border-tech-neon/20">
        <p className="text-tech-light mb-2"><strong>Date:</strong> {hackathon.date}</p>
        <p className="text-tech-light mb-2"><strong>Type:</strong> {hackathon.type}</p>
        <p className="text-tech-light mb-4"><strong>Description:</strong> {hackathon.description}</p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.open('https://meet.google.com', '_blank')}
          className="bg-tech-blue text-white rounded-lg p-3 w-full font-semibold hover:bg-blue-700 transition mb-4"
          aria-label="Join Live Session"
        >
          Join Live Session (Mock)
        </motion.button>
        {!hackathon.participants.includes(user.uid) && (
          <form onSubmit={handleBookSlot} className="mb-4">
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon mb-2"
              required
              aria-label="Select Slot"
            >
              <option value="">Select Slot</option>
              {slots.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-tech-blue text-white rounded-lg p-3 w-full font-semibold hover:bg-blue-700 transition"
              aria-label="Book Slot"
            >
              Book Slot
            </motion.button>
          </form>
        )}
        {user.role === 'admin' && (
          <form onSubmit={handleSubmitResults}>
            <h3 className="text-xl font-semibold text-tech-neon mb-2">Jury Dashboard</h3>
            <input
              type="text"
              value={winner}
              onChange={(e) => setWinner(e.target.value)}
              placeholder="Enter winner name"
              className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon mb-2"
              required
              aria-label="Winner Name"
            />
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-tech-blue text-white rounded-lg p-3 w-full font-semibold hover:bg-blue-700 transition"
              aria-label="Submit Results"
            >
              Submit Results
            </motion.button>
            {hackathon.results && (
              <p className="text-tech-light mt-2">Winner: {hackathon.results}</p>
            )}
          </form>
        )}
      </div>
    </motion.div>
  );
}

export default HackathonDetails;