// ProtectedRoute Component — guards routes based on authentication and role
// Redirects unauthenticated users to /login
// Optionally restricts access to admin users only

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {boolean} [props.adminOnly=false] - If true, only users with role "admin" can access
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, userData, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-gta-dark)'
      }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to dashboard if not admin trying to access admin route
  if (adminOnly && userData?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
