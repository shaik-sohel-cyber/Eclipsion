import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

function ProjectCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [duration, setDuration] = useState('');
  const [skills, setSkills] = useState('');
  const [stage, setStage] = useState('idea');
  const [imageUrl, setImageUrl] = useState(''); // New field for image URL
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.uid) {
      setError('User not authenticated');
      return;
    }

    try {
      const projectId = `proj_${Date.now()}`;
      const projectData = {
        title,
        description,
        domain,
        duration: parseInt(duration) || 0,
        skills: skills.split(',').map(skill => skill.trim()),
        stage, // Set during creation
        imageUrl, // Set during creation
        creator: user.uid,
        creatorName: user.displayName || user.email.split('@')[0],
        team: [user.uid],
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'projects', projectId), projectData);
      await updateDoc(doc(db, 'users', user.uid), {
        createdProjects: { [projectId]: true }
      });

      setError('Project created successfully!');
      setTimeout(() => {
        setError('');
        navigate('/projects');
      }, 2000);
    } catch (err) {
      console.error('ProjectCreate: Error:', err.message);
      setError('Failed to create project: ' + err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 max-w-lg"
    >
      <h2 className="text-3xl font-bold text-tech-neon mb-6 text-center">Create Project</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-tech-gray shadow-2xl rounded-lg p-6 border border-tech-neon/20 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project Title"
          className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
          required
          aria-label="Project Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
          required
          aria-label="Description"
        />
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Domain (e.g., AI, Web Dev)"
          className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
          required
          aria-label="Domain"
        />
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (days)"
          className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
          required
          aria-label="Duration"
        />
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Skills (comma-separated)"
          className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
          required
          aria-label="Skills"
        />
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
          aria-label="Project Stage"
        >
          <option value="idea">Idea</option>
          <option value="mvp">MVP</option>
          <option value="implementation">Implementation</option>
        </select>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL (e.g., https://example.com/image.jpg)"
          className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
          aria-label="Image URL"
        />
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-tech-blue text-white rounded-lg p-3 w-full font-semibold hover:bg-blue-700 transition"
          aria-label="Create Project"
        >
          Create Project
        </motion.button>
      </form>
    </motion.div>
  );
}

export default ProjectCreate;