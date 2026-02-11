import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage.jsx";

import AdminDashboard from "./pages/dashboards/AdminDashboard.jsx";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard.jsx";

import DoctorsPage from "./pages/doctors/DoctorsPage.jsx";
import PatientsPage from "./pages/patients/PatientsPage.jsx";
import AppointmentsPage from "./pages/appointments/AppointmentsPage.jsx";
import BillingPage from "./pages/billing/BillingPage.jsx";
import AuditPage from "./pages/admin/AuditPage.jsx";

import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";
import { AppShell } from "./ui/layout/AppShell.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected app shell */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        {/* Default */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard by role */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <RoleDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin-only */}
        <Route
          path="doctors"
          element={
            <ProtectedRoute roles={["admin"]}>
              <DoctorsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="patients"
          element={
            <ProtectedRoute roles={["admin"]}>
              <PatientsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="billing"
          element={
            <ProtectedRoute roles={["admin"]}>
              <BillingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="audit"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AuditPage />
            </ProtectedRoute>
          }
        />

        {/* Admin + Doctor */}
        <Route
          path="appointments"
          element={
            <ProtectedRoute roles={["admin", "doctor"]}>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function RoleDashboard() {
  const role = JSON.parse(localStorage.getItem("smoas_user") || "{}")?.role;
  if (role === "admin") return <AdminDashboard />;
  // doctor (or anything else) -> doctor dashboard
  return <DoctorDashboard />;
}
