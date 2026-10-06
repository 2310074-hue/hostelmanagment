import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Guards a route so that:
//  - Unauthenticated users are redirected to the correct login page.
//  - Students cannot access admin pages, and admins cannot access student pages.
//
// Usage: <ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) return null; // wait until we've checked localStorage

  if (!user || !role) {
    return <Navigate to={allowedRole === "admin" ? "/admin/login" : "/login"} replace />;
  }

  if (role !== allowedRole) {
    // Logged in, but wrong role -> send them to their own dashboard instead of blocking blankly.
    return <Navigate to={role === "admin" ? "/admin/dashboard" : "/student/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
