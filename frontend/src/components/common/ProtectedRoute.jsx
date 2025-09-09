import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    // Redirect them to the /login page, but save the current location they were trying to go to.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, render the nested routes (Dashboard, Event List, etc.)
  return <Outlet />;
};

export default ProtectedRoute;