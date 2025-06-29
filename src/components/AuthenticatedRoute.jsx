import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthenticatedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-4 text-tech-neon">Loading...</div>;
  }

  if (!user || !user.emailVerified) {
    console.log("AuthenticatedRoute: Redirecting to login, no user or unverified");
    return <Navigate to="/login" />;
  }

  return children;
}

export default AuthenticatedRoute;