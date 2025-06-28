import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import auth instance

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [id, setId] = useState('');
  const [blabla, setBlabla] = useState('');

  const fetchData = async () => {
    if (!user || !user.uid) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfile(data);
        setName(data.name || '');
        setCollege(data.college || '');
        setId(data.id || '');
        setBlabla(data.blabla || '');
      } else {
        setIsEditing(true); // Trigger edit mode if no data exists
        setError('Please fill in your profile details.');
      }
    } catch (err) {
      console.error('Profile: Fetch data error:', err.message);
      setError('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user || !user.uid) {
      setError('User not authenticated');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: name || null,
        college: college || null,
        id: id || null,
        blabla: blabla || null
      });
      setProfile({ name, college, id, blabla });
      setIsEditing(false);
      setError('Profile updated successfully');
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      console.error('Profile: Update error:', err.message);
      setError('Failed to update profile: ' + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Profile: Logout error:', err.message);
      setError('Failed to logout: ' + err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-6 text-center"
      >
        <p className="text-tech-light">Loading profile...</p>
      </motion.div>
    );
  }

  if (error && !isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-6 text-center"
      >
        <p className="text-red-500">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 max-w-md"
    >
      <h2 className="text-3xl font-bold text-tech-neon mb-6 text-center">Profile</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {isEditing ? (
        <form onSubmit={handleUpdate} className="bg-tech-gray shadow-2xl rounded-lg p-8 border border-tech-neon/20 space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
            required
            aria-label="Name"
          />
          <input
            type="text"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            placeholder="College"
            className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
            required
            aria-label="College"
          />
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="ID"
            className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
            required
            aria-label="ID"
          />
          <input
            type="text"
            value={blabla}
            onChange={(e) => setBlabla(e.target.value)}
            placeholder="Additional Info (e.g., Blabla)"
            className="bg-tech-dark border border-tech-light/20 rounded-lg p-3 w-full text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
            aria-label="Additional Info"
          />
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-tech-blue text-white rounded-lg p-3 w-full font-semibold hover:bg-blue-700 transition"
            aria-label="Save Profile"
          >
            Save Profile
          </motion.button>
        </form>
      ) : (
        <div className="bg-tech-gray shadow-2xl rounded-lg p-8 border border-tech-neon/20">
          <p className="text-tech-light mb-2"><strong>Email:</strong> {user.email}</p>
          <p className="text-tech-light mb-2"><strong>Name:</strong> {profile.name}</p>
          <p className="text-tech-light mb-2"><strong>College:</strong> {profile.college}</p>
          <p className="text-tech-light mb-2"><strong>ID:</strong> {profile.id}</p>
          <p className="text-tech-light mb-2"><strong>Additional Info:</strong> {profile.blabla || 'Not provided'}</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="bg-tech-blue text-white rounded-lg p-3 w-full sm:w-auto font-semibold hover:bg-blue-700 transition"
              aria-label="Edit Profile"
            >
              Edit Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-600 text-white rounded-lg p-3 w-full sm:w-auto font-semibold hover:bg-red-700 transition"
              aria-label="Logout"
            >
              Logout
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Profile;