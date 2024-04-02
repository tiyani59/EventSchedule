// ProtectedRoute.js

import React from "react";
import { Navigate } from "react-router-dom";
import isAuthenticated from "../utils/Authenticate";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the child component if authenticated
  return children;
};

export default ProtectedRoute;
