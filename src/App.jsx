import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import ProjectCreate from './pages/ProjectCreate';
import Hackathons from './pages/Hackathons';
import Prototypes from './pages/Prototypes';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import ErrorBoundary from './components/ErrorBoundary';
import EditProject from './pages/EditProject';
import HackathonDetails from './pages/HackathonDetails';
import PrototypeDetails from './pages/PrototypeDetails';
import PrototypeUpload from './pages/PrototypeUpload';
import CourseContent from './pages/CourseContent';
// Import the following components if they exist in your project
// import HackathonDetails from './pages/HackathonDetails';
// import PrototypeDetails from './pages/PrototypeDetails';
// import PrototypeUpload from './pages/PrototypeUpload';
// import CourseContent from './pages/CourseContent';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-tech-light">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-tech-dark">
      <Navbar />
      <div className="flex flex-1">
        {/* Removed Sidebar as it's commented out in your code */}
        <main className="flex-1">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<AuthForm type="login" />} />
              <Route path="/signup" element={<AuthForm type="signup" />} />
              <Route path="/dashboard" element={<Navigate to="/projects" />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/create" element={<ProjectCreate />} />
              <Route path="/projects/edit/:id" element={<EditProject />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/hackathons" element={<Hackathons />} />
              {/* Comment out routes for unimplemented components to avoid errors */}
              {/* <Route path="/hackathons/:id" element={<HackathonDetails />} /> */}
              <Route path="/prototypes" element={<Prototypes />} />
              {/* <Route path="/prototypes/:id" element={<PrototypeDetails />} /> */}
              {/* <Route path="/prototypes/upload/:projectId" element={<PrototypeUpload />} /> */}
              <Route path="/courses" element={<Courses />} />
              {/* <Route path="/courses/:id" element={<CourseContent />} /> */}
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;