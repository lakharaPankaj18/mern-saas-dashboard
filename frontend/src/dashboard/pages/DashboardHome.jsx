import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// 1. Import 'api' for secure requests
import { AuthContext} from "../../auth/authentication/authContext.js"; 
import { Loader2 } from "lucide-react";

import AdminHome from "./admin/AdminHome";
import MemberHome from "./member/MemberHome";
import { api } from "../../auth/authentication/AuthProvider.jsx";

const DashboardHome = () => {
  const { setIsAddUserModalOpen, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        
        if (isMounted) {
          setDashboardData(res.data.data || res.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err.response?.data?.message || err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();

    return () => { isMounted = false; };
  }, []); // Removed 'token' dependency as 'api' handles global auth state

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">
          Syncing Dashboard...
        </p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-400 p-4 md:p-8 space-y-6">
      {user?.role === "admin" ? (
        <AdminHome 
          dashboardData={dashboardData} 
          setIsAddUserModalOpen={setIsAddUserModalOpen}
          navigate={navigate}
        />
      ) : (
        <MemberHome user={user} />
      )}
    </div>
  );
};

export default DashboardHome;