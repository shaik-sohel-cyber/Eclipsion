import { useEffect, useState } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectDoc = await getDoc(doc(db, 'projects', id));
        if (projectDoc.exists()) {
          setProject({
            id: projectDoc.id,
            ...projectDoc.data(),
            skills: projectDoc.data().skills || [],
            title: projectDoc.data().title || 'Untitled Project',
            description: projectDoc.data().description || 'No description available',
            domain: projectDoc.data().domain || 'Unknown',
            creatorName: projectDoc.data().creatorName || 'Unknown',
            team: projectDoc.data().team || [],
            status: projectDoc.data().status || 'active'
          });
        } else {
          setError('Project not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('ProjectDetails: Fetch error:', err.message);
        setError('Failed to load project details');
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleJoinProject = async () => {
    if (!user || !user.emailVerified || !user.uid) {
      return <Navigate to="/login" />;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        setError('User profile not found');
        return;
      }
      if (userDoc.data().currentProject) {
        alert('You are already part of a project. Leave that project to join another.');
        return;
      }

      await updateDoc(doc(db, 'projects', id), {
        team: [...(project.team || []), user.uid]
      });
      await updateDoc(doc(db, 'users', user.uid), {
        currentProject: id
      });
      setProject(prev => ({ ...prev, team: [...(prev.team || []), user.uid] }));
      alert('Successfully joined the project!');
    } catch (err) {
      console.error('ProjectDetails: Join error:', err.message);
      setError('Failed to join project: ' + err.message);
    }
  };

  const handleLeaveProject = async () => {
    if (!user || !user.emailVerified || !user.uid) {
      return <Navigate to="/login" />;
    }

    try {
      await updateDoc(doc(db, 'projects', id), {
        team: project.team.filter(member => member !== user.uid)
      });
      await updateDoc(doc(db, 'users', user.uid), {
        currentProject: null
      });
      setProject(prev => ({ ...prev, team: prev.team.filter(member => member !== user.uid) }));
      alert('Successfully left the project!');
    } catch (err) {
      console.error('ProjectDetails: Leave error:', err.message);
      setError('Failed to leave project: ' + err.message);
    }
  };

  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project? This action cannot be undone.');

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'projects', project.id));
      await updateDoc(doc(db, 'users', user.uid), {
        [`createdProjects.${project.id}`]: false
      });
      alert('Project deleted successfully.');
      navigate('/projects');
    } catch (err) {
      console.error('ProjectDetails: Delete error:', err.message);
      setError('Failed to delete project: ' + err.message);
    }
  };

  if (!user || !user.emailVerified) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-tech-light">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-tech-light">Project not found.</p>
      </div>
    );
  }

  const isTeamMember = project.team.includes(user.uid);
  const isCreator = project.creator === user.uid;
  const skills = Array.isArray(project.skills) ? project.skills.join(', ') : 'No skills specified';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <h2 className="text-3xl font-bold text-tech-neon mb-6 text-center">{project.title}</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="bg-tech-gray shadow-2xl rounded-lg p-8 border border-tech-neon/20">
        <p className="text-tech-light mb-2"><strong>Description:</strong> {project.description}</p>
        <p className="text-tech-light mb-2"><strong>Domain:</strong> {project.domain}</p>
        <p className="text-tech-light mb-2"><strong>Duration:</strong> {project.duration || 'Not specified'} days</p>
        <p className="text-tech-light mb-2"><strong>Skills:</strong> {skills}</p>
        <p className="text-tech-light mb-2"><strong>Creator:</strong> {project.creatorName}</p>
        <p className="text-tech-light mb-2"><strong>Team:</strong> {project.team.length > 0 ? project.team.length + ' members' : 'No team members'}</p>
        <p className="text-tech-light mb-4"><strong>Status:</strong> {project.status}</p>

        <div className="flex flex-wrap gap-4">
          {!isCreator && !isTeamMember && project.status === 'active' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleJoinProject}
              className="bg-tech-blue text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition"
            >
              Join Project
            </motion.button>
          )}

          {isTeamMember && !isCreator && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLeaveProject}
              className="bg-red-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-red-700 transition"
            >
              Leave Project
            </motion.button>
          )}

          {isCreator && (
            <>
              <Link
                to={`/projects/edit/${project.id}`}
                className="bg-yellow-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-yellow-700 transition"
              >
                Edit Project
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteProject}
                className="bg-red-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-red-700 transition"
              >
                Delete Project
              </motion.button>
            </>
          )}

          <Link
            to={`/prototypes/upload/${project.id}`}
            className="bg-tech-blue text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition"
          >
            Upload Prototype
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default ProjectDetails;
