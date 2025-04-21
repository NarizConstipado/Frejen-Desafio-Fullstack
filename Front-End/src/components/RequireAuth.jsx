import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isTokenExpired } from "../utilities/auth";
import { useAuth } from "../contexts/AuthContext"; // adjust if path differs

const RequireAuth = () => {
  const location = useLocation();
  const { token, logoutUser } = useAuth();

  const activeToken = token || localStorage.getItem("token");

  const isLoggedIn = !!activeToken && !isTokenExpired(activeToken);

  if (!isLoggedIn) {
    logoutUser(); // this clears context + localStorage
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
