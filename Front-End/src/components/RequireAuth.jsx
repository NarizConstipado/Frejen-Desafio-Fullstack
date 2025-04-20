// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  isAuthenticated as checkAuth,
  isTokenExpired,
} from "../utilities/auth"; // Import your auth utilities

const RequireAuth = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAuth = checkAuth(); // Check if a token exists

  if (!isAuth || (token && isTokenExpired(token))) {
    // If not authenticated or the token is expired, redirect to login
    localStorage.removeItem("token"); // Optionally remove the expired token
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated and the token is valid, render the child routes
  return <Outlet />;
};

export default RequireAuth;