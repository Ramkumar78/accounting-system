import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Ideally verify with backend, for now simple check or just render and let axios interceptor handle 401
    // A more robust way is to have a /whoami endpoint
    setIsAuthenticated(true);
  }, []);

  if (isAuthenticated === null) {
      return <div>Loading...</div>; // Or a spinner
  }

  // If we wanted to check client side state:
  // if (!isAuthenticated) return <Navigate to="/login" />;

  // We will rely on Axios 401 interceptor to redirect
  return children;
};

export default ProtectedRoute;
