import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/authentication/authContext";
import { Loader2 } from "lucide-react";

import AdminHome from "./admin/AdminHome";
import MemberHome from "./member/MemberHome";

const DashboardHome = () => {
  const { token, setIsAddUserModalOpen, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:7005/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const result = await res.json();
        if (isMounted) setDashboardData(result.data);
      } catch (err) {
        console.error(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (token) fetchDashboard();
    return () => { isMounted = false; };
  }, [token]);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="mx-auto max-w-400 p-8 space-y-6">
      {/* Redundant welcome message removed from here as it is in top bar */}
      
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