import { Navigate } from 'react-router-dom';
// If you are using an AuthContext, you can import useAuth() here instead of checking localStorage directly!

export default function PublicRoute({ children }) {
  const token = localStorage.getItem('token');

  if (token) {
    // If they are already logged in, redirect them to their feed automatically
    return <Navigate to="/home" replace />;
  }

  // If they DO NOT have a token, let them see the Landing Page
  return children;
}