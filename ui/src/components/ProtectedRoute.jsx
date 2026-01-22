import React from 'react';
import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Ideally verify with backend, for now simple check or just render and let axios interceptor handle 401
  // A more robust way is to have a /whoami endpoint

  // We will rely on Axios 401 interceptor to redirect
  return <Outlet />;
};

export default ProtectedRoute;
