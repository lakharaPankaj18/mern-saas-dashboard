import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./auth/pages/Login";
import Register from "./auth/pages/Register";
import ForgotPassword from "./auth/pages/ForgotPassword";
import ResetPassword from "./auth/pages/ResetPassword";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./dashboard/layouts/DashboardLayout";
import AdminRoute from "./routes/AdminRoute";

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Common dashboard */}
        <Route index element={<div>Dashboard Home</div>} />

        {/* Admin routes only */}
        <Route element={<AdminRoute />}>
          <Route path="users" element={<div>Users Page</div>} />
          <Route path="analytics" element={<div>Analytics Page</div>} />
        </Route>
      </Route>

      {/* Default routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
