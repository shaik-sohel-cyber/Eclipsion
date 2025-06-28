import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

function PrototypeUpload() {
  const { user } = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [demoLink, setDemoLink] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('PrototypeUpload: Uploading prototype for project:', projectId);
      const prototypeId = `proto_${Date.now()}`;
      await setDoc(doc(db, 'prototypes', prototypeId), {
        title,
        description,
        demoLink,
        creator: user.uid,
        creatorName: user.name,
        projectId,
        domain: user.domain
      });
      navigate(`/prototypes/${prototypeId}`);
    } catch (err) {
      console.error('PrototypeUpload: Error:', err.message);
      setError('Failed to upload prototype.');
    }
  };

  if (!user || !user.emailVerified) {
    console.log("PrototypeUpload: Redirecting to login, no user or unverified");
    return <Navigate to="/login" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <h2 className="text-3xl font-bold text-tech-neon mb-6 text-center">Upload Prototype</h2>
      <form className="bg-tech-gray shadow-2xl rounded-lg p-8 max-w-md mx-auto border border-tech-neon/20" onSubmit={handleSubmit}>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Prototype Title"
            className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
            required
            aria-label="Prototype Title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Prototype Description"
            className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
            required
            aria-label="Prototype Description"
          />
          <input
            type="url"
            value={demoLink}
            onChange={(e) => setDemoLink(e.target.value)}
            placeholder="Demo Link (e.g., http://example.com)"
            className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
            required
            aria-label="Demo Link"
          />
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-tech-blue text-white rounded-lg p-3 w-full font-semibold hover:bg-blue-700 transition"
            aria-label="Upload Prototype"
          >
            Upload Prototype
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default PrototypeUpload;