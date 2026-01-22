import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../auth/authentication/authContext";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <Sidebar className="border-r border-slate-200" />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <Topbar />
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-4 rounded border border-slate-200 bg-white p-4 text-slate-700">
            {user?.role === "admin" ? (
              <strong>Admin Logged In: {user?.name}</strong>
            ) : (
              <strong>Member Logged In: {user?.name}</strong>
            )}
          </div>
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
