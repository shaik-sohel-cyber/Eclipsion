import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Projects from './pages/Projects';
import ProjectCreate from './pages/ProjectCreate';
import ProjectDetails from './pages/ProjectDetails';
import Hackathons from './pages/Hackathons';
import HackathonDetails from './pages/HackathonDetails';
import Prototypes from './pages/Prototypes';
import PrototypeDetails from './pages/PrototypeDetails';
import PrototypeUpload from './pages/PrototypeUpload';
import Courses from './pages/Courses';
import CourseContent from './pages/CourseContent';
import Profile from './pages/Profile';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  console.log('App component rendered');
  return (
    <AuthProvider>
      <div className="bg-tech-dark min-h-screen text-tech-light">
        <ErrorBoundary>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Navigate to="/projects" />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/create" element={<ProjectCreate />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/hackathons/:id" element={<HackathonDetails />} />
            <Route path="/prototypes" element={<Prototypes />} />
            <Route path="/prototypes/:id" element={<PrototypeDetails />} />
            <Route path="/prototypes/upload/:projectId" element={<PrototypeUpload />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseContent />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </AuthProvider>
  );
}

export default App;