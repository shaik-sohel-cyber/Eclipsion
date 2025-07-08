import { motion } from 'framer-motion';
import { FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-tech-dark text-tech-light py-6 border-t border-tech-neon/20"
    >
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Copyright */}
        <div className="mb-4 md:mb-0">
          <p className="text-sm">
            &copy; {currentYear} IgniVault. All rights reserved.
          </p>
        </div>

        {/* Feedback and Social Links */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <a
            href="https://forms.gle/your-feedback-form-link"
            target="_blank"
            rel="noopener noreferrer"
            className="text-tech-neon hover:underline"
            aria-label="Submit Feedback"
          >
            Feedback
          </a>
          <div className="flex space-x-4">
            <a
              href="mailto:support@collegestartupplatform.com"
              className="text-tech-neon hover:text-blue-400 transition"
              aria-label="Email Support"
            >
              <FaEnvelope size={20} />
            </a>
            <a
              href="https://www.facebook.com/collegestartupplatform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tech-neon hover:text-blue-400 transition"
              aria-label="Facebook"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/collegestartupplatform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tech-neon hover:text-blue-400 transition"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://x.com/collegestartupplatform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tech-neon hover:text-blue-400 transition"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://www.linkedin.com/company/collegestartupplatform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tech-neon hover:text-blue-400 transition"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;