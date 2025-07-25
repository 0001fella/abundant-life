import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, role } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return <div>Loading...</div>; // Or a spinner if you have one
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but lacks required role
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Authenticated and authorized
  return children;
};

export default ProtectedRoute;
