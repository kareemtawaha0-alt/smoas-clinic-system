import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../state/auth/useAuth.js";

export function ProtectedRoute({ children, roles }) {
  const { isAuthed, user } = useAuth();
  const loc = useLocation();

  if (!isAuthed) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  if (roles?.length && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
}
