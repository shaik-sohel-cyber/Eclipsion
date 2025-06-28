import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';

function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [domainFilter, setDomainFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const domains = ['All', 'AI', 'IoT', 'FinTech', 'Web Development', 'Mobile Apps'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Projects: Fetching projects...');
        const snap = await getDocs(collection(db, 'projects'));
        const projectsData = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          skills: doc.data().skills || [], // Ensure skills is an array
          title: doc.data().title || 'Untitled Project',
          description: doc.data().description || 'No description available',
          domain: doc.data().domain || 'Unknown',
          creatorName: doc.data().creatorName || 'Unknown'
        }));
        setProjects(projectsData);
        setLoading(false);
      } catch (err) {
        console.error('Projects: Fetch error:', err.message);
        setError('Failed to load projects.');
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (!user || !user.emailVerified) {
    console.log("Projects: Redirecting to login, no user or unverified");
    return <Navigate to="/login" />;
  }

  const filteredProjects = domainFilter && domainFilter !== 'All'
    ? projects.filter(project => project.domain === domainFilter)
    : projects;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <h2 className="text-3xl font-bold text-tech-neon mb-6 text-center">Projects</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="flex justify-between items-center mb-4">
        <div>
          <label htmlFor="domain-filter" className="text-tech-light mr-2">Filter by Domain:</label>
          <select
            id="domain-filter"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="bg-tech-dark border border-tech-light/20 rounded-lg p-2 text-tech-light focus:outline-none focus:ring-2 focus:ring-tech-neon"
            aria-label="Filter projects by domain"
          >
            {domains.map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
        </div>
        <Link
          to="/projects/create"
          className="bg-tech-blue text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition"
          aria-label="Create New Project"
        >
          Create Project
        </Link>
      </div>
      {loading ? (
        <p className="text-tech-light text-center">Loading projects...</p>
      ) : filteredProjects.length === 0 ? (
        <p className="text-tech-light text-center">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
export default Projects;