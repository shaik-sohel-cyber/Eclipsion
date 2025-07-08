import { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

function EditProject() {
  const { id } = useParams();
  const { user, loading } = useAuth(); // Assume useAuth provides a loading state
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [duration, setDuration] = useState('');
  const [skills, setSkills] = useState('');
  const [stage, setStage] = useState('idea');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (!data) throw new Error('Invalid project data');
          setTitle(data.title || '');
          setDescription(data.description || '');
          setDomain(data.domain || '');
          setDuration(data.duration?.toString() || '');
          setSkills((data.skills || []).join(', '));
          setStage(data.stage || 'idea');
          setImageUrl(data.imageUrl || '');
        } else {
          setError('Project not found.');
        }
      } catch (err) {
        setError(`Error fetching project: ${err.message}`);
      }
    };

    fetchProject();
  }, [id]);

  const validateForm = () => {
    if (!title.trim()) return 'Project title is required.';
    if (!description.trim()) return 'Description is required.';
    if (!domain.trim()) return 'Domain is required.';
    if (!duration || isNaN(parseInt(duration)) || parseInt(duration) <= 0)
      return 'Valid duration (positive number) is required.';
    if (!skills.trim()) return 'At least one skill is required.';
    if (imageUrl && !isValidUrl(imageUrl)) return 'Invalid image URL.';
    return null;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedData = {
        title: title.trim(),
        description: description.trim(),
        domain: domain.trim(),
        duration: parseInt(duration),
        skills: skills
          .split(',')
          .map((skill) => skill.trim())
          .filter((skill) => skill),
        stage,
        imageUrl: imageUrl.trim() || null,
      };

      await updateDoc(doc(db, 'projects', id), updatedData);
      navigate(`/projects/${id}`);
    } catch (err) {
      console.error('EditProject: Error updating project:', err.message);
      setError('Failed to update project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user || !user.emailVerified) return <Navigate to="/login" />;

  const inputClass =
    'bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 max-w-lg"
    >
      <h2 className="text-3xl font-bold text-tech-neon mb-6 text-center">Edit Project</h2>
      {error && (
        <div
          role="alert"
          className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-center"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleUpdate}
        className="bg-tech-gray shadow-2xl rounded-lg p-6 border border-tech-neon/20 space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-tech-light mb-1">
            Project Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            required
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-tech-light mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} resize-y min-h-[100px]`}
            required
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="domain" className="block text-tech-light mb-1">
            Domain
          </label>
          <input
            id="domain"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className={inputClass}
            required
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-tech-light mb-1">
            Duration (days)
          </label>
          <input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className={inputClass}
            required
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="skills" className="block text-tech-light mb-1">
            Skills (comma-separated)
          </label>
          <input
            id="skills"
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className={inputClass}
            required
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="stage" className="block text-tech-light mb-1">
            Project Stage
          </label>
          <select
            id="stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className={inputClass}
            aria-required="true"
          >
            <option value="idea">Idea</option>
            <option value="mvp">MVP</option>
            <option value="implementation">Implementation</option>
          </select>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-tech-light mb-1">
            Image URL (optional)
          </label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={inputClass}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSubmitting}
          className={`bg-tech-blue text-white rounded-lg p-3 w-full font-semibold transition ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default EditProject;