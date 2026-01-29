import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Public components (Keep Login fast by not lazy-loading if it's the landing page)
import Login from "./auth/pages/Login";
import ProfileSettings from "./dashboard/components/ProfileSettings";

// Lazy Loaded Components
const Register = lazy(() => import("./auth/pages/Register"));
const ForgotPassword = lazy(() => import("./auth/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./auth/pages/ResetPassword"));
const ProtectedRoute = lazy(() => import("./routes/ProtectedRoute"));
const DashboardLayout = lazy(() => import("./dashboard/layouts/DashboardLayout"));
const AdminRoute = lazy(() => import("./routes/AdminRoute"));
const DashboardHome = lazy(() => import("./dashboard/pages/DashboardHome"));
const UserTable = lazy(() => import("./dashboard/pages/admin/UserTable"));
const UserProfile = lazy(() => import("./dashboard/pages/admin/UserProfile"));
const Analytics = lazy(() => import("./dashboard/pages/admin/Analytics"));

// A reusable loading fallback
const PageLoader = () => (
  <div className="flex h-[60vh] w-full items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
  </div>
);

const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

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
          <Route index element={<DashboardHome />} />
<Route path="settings" element={<ProfileSettings />}/>
          {/* Admin routes only */}
          <Route element={<AdminRoute />}>
            <Route path="users" element={<UserTable />} />
            <Route path="users/:id" element={<UserProfile />}/>
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>

        {/* Default routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;