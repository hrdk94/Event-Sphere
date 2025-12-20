import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RedirectingDashboard() {
  const { user, loading } = useAuth();

  // wait for auth to resolve
  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role === "student") {
    return <Navigate to="/student/dashboard" />;
  }

  if (user.role === "club") {
    return <Navigate to="/club/dashboard" />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  }

  // fallback (should never happen)
  return <Navigate to="/login" />;
}

export default RedirectingDashboard;
