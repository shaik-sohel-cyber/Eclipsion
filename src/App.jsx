import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import ProjectCreate from './pages/ProjectCreate';
// import ProjectEdit from './components/ProjectEdit';
import Hackathons from './pages/Hackathons';
import Prototypes from './pages/Prototypes';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import ResetPassword from './pages/ResetPassword';

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
        {user && user.emailVerified }
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthForm type="login" />} />
            <Route path="/signup" element={<AuthForm type="signup" />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <AuthenticatedRoute>
                  <Dashboard />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <AuthenticatedRoute>
                  <Projects />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <AuthenticatedRoute>
                  <ProjectDetails />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/projects/create"
              element={
                <AuthenticatedRoute>
                  <ProjectCreate />
                </AuthenticatedRoute>
              }
            />
         
            <Route
              path="/hackathons"
              element={
                <AuthenticatedRoute>
                  <Hackathons />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/prototypes"
              element={
                <AuthenticatedRoute>
                  <Prototypes />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <AuthenticatedRoute>
                  <Courses />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthenticatedRoute>
                  <Profile />
                </AuthenticatedRoute>
              }
            />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;