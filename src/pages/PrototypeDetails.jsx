import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

function PrototypeDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [prototype, setPrototype] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrototype = async () => {
      try {
        console.log('PrototypeDetails: Fetching prototype:', id);
        const prototypeDoc = await getDoc(doc(db, 'prototypes', id));
        if (!prototypeDoc.exists()) {
          setError('Prototype not found.');
          setLoading(false);
          return;
        }
        setPrototype({ id: prototypeDoc.id, ...prototypeDoc.data() });
        setLoading(false);
      } catch (err) {
        console.error('PrototypeDetails: Fetch error:', err.message);
        setError('Failed to load prototype details.');
        setLoading(false);
      }
    };
    fetchPrototype();
  }, [id]);

  const handleContact = async (e) => {
    e.preventDefault();
    try {
      console.log('PrototypeDetails: Sending message');
      await addDoc(collection(db, 'messages'), {
        senderId: user.uid,
        receiverId: prototype.creator,
        message,
        prototypeId: id,
        createdAt: new Date().toISOString()
      });
      setMessage('');
      alert('Message sent successfully!');
    } catch (err) {
      console.error('PrototypeDetails: Contact error:', err.message);
      setError('Failed to send message.');
    }
  };

  if (!user || !user.emailVerified) {
    console.log("PrototypeDetails: Redirecting to login, no user or unverified");
    return <Navigate to="/login" />;
  }

  if (loading) return <p className="text-tech-light text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!prototype) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <h2 className="text-3xl font-bold text-tech-neon mb-6 text-center">{prototype.title}</h2>
      <div className="bg-tech-gray shadow-2xl rounded-lg p-8 max-w-2xl mx-auto border border-tech-neon/20">
        <p className="text-tech-light mb-2"><strong>Description:</strong> {prototype.description}</p>
        <p className="text-tech-light mb-2"><strong>Creator:</strong> {prototype.creatorName}</p>
        <p className="text-tech-light mb-4"><strong>Demo Link:</strong> <a href={prototype.demoLink} target="_blank" rel="noopener noreferrer" className="text-tech-neon hover:underline">{prototype.demoLink}</a></p>
        {user.role === 'investor' && (
          <form onSubmit={handleContact}>
            <h3 className="text-xl font-semibold text-tech-neon mb-2">Contact Creator</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message to the creator"
              className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon mb-2"
              required
              aria-label="Message to Creator"
            />
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-tech-blue text-white rounded-lg p-3 w-full font-semibold hover:bg-blue-700 transition"
              aria-label="Send Message"
            >
              Send Message
            </motion.button>
          </form>
        )}
      </div>
    </motion.div>
  );
}

export default PrototypeDetails;