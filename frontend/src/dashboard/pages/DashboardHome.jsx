import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/authentication/authContext";
import {
  Users,
  ShieldCheck,
  UserCircle,
  Calendar,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";

const StatCard = ({ title, value, icon: iconProp, colorClass }) => {
  const IconComponent = iconProp;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${colorClass}`}>
          <IconComponent size={24} />
        </div>
      </div>
    </div>
  );
};

const DashboardHome = () => {
  const { token } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:7005/api/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await res.json();
        setDashboardData(result.data);
        setRole(result.role);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  /* --- LOADING STATE --- */
  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
        <p className="font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  /* --- ERROR STATE --- */
  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-600 animate-in fade-in zoom-in duration-300">
        <AlertCircle size={20} />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  /* --- MAIN UI --- */
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {dashboardData?.name?.split(" ")[0] || "User"}! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Here is a summary of your account and activity.
        </p>
      </header>

      {role === "admin" ? (
        /* ADMIN VIEW */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCard
            title="Total Users"
            value={dashboardData.totalUsers}
            icon={Users}
            colorClass="bg-indigo-50 text-indigo-600"
          />
          <StatCard
            title="Members"
            value={dashboardData.totalMembers}
            icon={UserCircle}
            colorClass="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            title="Admins"
            value={dashboardData.totalAdmins}
            icon={ShieldCheck}
            colorClass="bg-amber-50 text-amber-600"
          />
        </div>
      ) : (
        /* MEMBER VIEW */
        <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold">
              {dashboardData?.name?.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {dashboardData?.name}
              </h3>
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mt-1">
                Standard Member
              </span>
            </div>
          </div>

          <div className="grid gap-4 border-t border-slate-100 pt-6 text-sm">
            <div className="flex items-center text-slate-600 gap-3">
              <Mail size={18} className="text-slate-400" />
              <span className="font-medium text-slate-700">Email:</span>
              <span>{dashboardData?.email}</span>
            </div>
            <div className="flex items-center text-slate-600 gap-3">
              <Calendar size={18} className="text-slate-400" />
              <span className="font-medium text-slate-700">Joined:</span>
              <span>
                {new Date(dashboardData?.joinedAt).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
