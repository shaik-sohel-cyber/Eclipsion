import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function ProjectCard({ project }) {
  const skills = Array.isArray(project.skills) ? project.skills.join(', ') : 'No skills specified';

  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
      className="bg-tech-gray p-4 rounded-lg shadow-lg border border-tech-neon/20"
    >
      <h3 className="text-xl font-semibold text-tech-neon">{project.title || 'Untitled Project'}</h3>
      <p className="text-tech-light">{project.description || 'No description available'}</p>
      <p className="text-tech-light"><strong>Domain:</strong> {project.domain || 'Unknown'}</p>
      <p className="text-tech-light"><strong>Creator:</strong> {project.creatorName || 'Unknown'}</p>
      <p className="text-tech-light"><strong>Skills:</strong> {skills}</p>
      <Link
        to={`/projects/${project.id}`}
        className="text-tech-neon hover:underline mt-2 block"
        aria-label={`View details for ${project.title || 'project'}`}
      >
        View Details
      </Link>
    </motion.div>
  );
}

export default ProjectCard;