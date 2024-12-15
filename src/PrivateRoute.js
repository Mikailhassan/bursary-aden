import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If admin-only route
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/ApplicantDashboard" replace />;
  }

  return children;
};

export default PrivateRoute;