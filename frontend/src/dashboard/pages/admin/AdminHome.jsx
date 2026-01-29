import React, { useMemo } from "react";
import { 
  Users, 
  ShieldCheck, 
  UserCircle, 
  Activity, 
  TrendingUp 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  ResponsiveContainer 
} from "recharts";
import AddUserBtn from "../../components/AddUserBtn";

const AdminHome = ({ dashboardData, navigate }) => {
  // Memoize chart data to prevent unnecessary re-renders
  const distributionData = useMemo(() => [
    { name: "Admins", value: dashboardData?.totalAdmins || 0 },
    { name: "Members", value: dashboardData?.totalMembers || 0 },
  ], [dashboardData]);

  // Statistics configuration for the top row
  const statsConfig = [
    { label: "Total Users", val: dashboardData?.totalUsers, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Active Now", val: dashboardData?.totalActive, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Admin Staff", val: dashboardData?.totalAdmins, icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Growth", val: dashboardData?.growth || "+0%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((item, i) => (
          <div key={i} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center gap-4 hover:border-indigo-100 transition-colors">
            <div className={`h-12 w-12 shrink-0 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center`}>
              <item.icon size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{item.label}</p>
              <p className="text-lg font-black text-slate-900 leading-none">
                {item.val !== undefined ? item.val : "---"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* User Distribution Bar Chart */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">User Distribution</h3>
            <p className="text-xs text-slate-400">Admin vs Member Ratio</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Management Grid */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
            <Activity size={18} className="text-indigo-600" /> Management
          </h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="p-4 md:p-5 rounded-4xl bg-indigo-50/50 flex flex-col items-center justify-center border border-indigo-100/20 text-center">
              <Users size={24} className="text-indigo-600 mb-1" />
              <span className="text-xl md:text-2xl font-black text-slate-900">{dashboardData?.totalUsers || 0}</span>
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">Total</span>
            </div>
            
            <AddUserBtn isFullCard={true} />

            <div className="p-4 md:p-5 rounded-4xl bg-emerald-50/50 flex flex-col items-center justify-center border border-emerald-100/20 text-center">
              <UserCircle size={24} className="text-emerald-600 mb-1" />
              <span className="text-xl md:text-2xl font-black text-slate-900">{dashboardData?.totalMembers || 0}</span>
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">Members</span>
            </div>
            <div className="p-4 md:p-5 rounded-4xl bg-amber-50/50 flex flex-col items-center justify-center border border-amber-100/20 text-center">
              <ShieldCheck size={24} className="text-amber-600 mb-1" />
              <span className="text-xl md:text-2xl font-black text-slate-900">{dashboardData?.totalAdmins || 0}</span>
              <span className="text-[9px] font-black text-amber-400 uppercase tracking-tighter">Admins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Joined List */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="px-6 md:px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Recently Joined</h3>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Latest community members</p>
          </div>
          <button 
            onClick={() => navigate("/dashboard/users")} 
            className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all active:scale-95"
          >
            View Full Table
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {dashboardData?.recentUsers && dashboardData.recentUsers.length > 0 ? (
            dashboardData.recentUsers.slice(0, 4).map((u) => (
              <div key={u._id} className="px-6 md:px-8 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                  <div className="h-10 w-10 shrink-0 rounded-2xl bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center font-black text-slate-400 text-sm uppercase border border-slate-200">
                    {u.name ? u.name[0] : "?"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 truncate">{u.name}</span>
                    <span className="text-[11px] text-slate-400 font-medium truncate">{u.email}</span>
                  </div>
                </div>
                <span className={`shrink-0 ml-2 text-[8px] md:text-[9px] font-black uppercase px-2 md:px-3 py-1 rounded-lg border ${
                  u.role === 'admin' 
                    ? 'bg-amber-50 text-amber-600 border-amber-100' 
                    : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                }`}>
                  {u.role}
                </span>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
              No recent activity found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;