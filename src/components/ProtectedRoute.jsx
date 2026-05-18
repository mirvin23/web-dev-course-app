import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roleRequired }) {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (roleRequired && userRole !== roleRequired) {
    // If student tries to access teacher dashboard, send to home
    return <Navigate to="/" />;
  }

  return children;
}
