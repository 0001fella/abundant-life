import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import LoadingSpinner from "./LoadingSpinner";

const PrivateRoute = ({ adminOnly = false }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, error: "You must be logged in to access this page." }}
        replace
      />
    );
  }

  if (adminOnly && user?.role !== "admin") {
    return (
      <Navigate
        to="/"
        state={{ error: "Access denied: Admins only." }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
