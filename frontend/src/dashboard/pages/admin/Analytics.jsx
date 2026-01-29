import React, { useState, useEffect, useMemo } from "react";
import { 
  AreaChart, Area, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Cell, Tooltip, ResponsiveContainer 
} from "recharts";
import { 
  Loader2, Download, Filter, TrendingUp, 
  Activity, ArrowDownRight, Users, Calendar 
} from "lucide-react";

const Analytics = () => {
  const [loading, setLoading] = useState(true);

  const growthData = useMemo(() => [
    { day: 'Mon', signups: 45, active: 32 },
    { day: 'Tue', signups: 52, active: 40 },
    { day: 'Wed', signups: 48, active: 38 },
    { day: 'Thu', signups: 70, active: 55 },
    { day: 'Fri', signups: 65, active: 50 },
    { day: 'Sat', signups: 90, active: 75 },
    { day: 'Sun', signups: 85, active: 70 },
  ], []);

  const deviceData = useMemo(() => [
    { name: 'Desktop', value: 65 },
    { name: 'Mobile', value: 25 },
    { name: 'Tablet', value: 10 },
  ], []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER SECTION: Stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Platform Analytics</h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Monitoring growth trends and user behavior</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] md:text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={14} /> Export
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-[10px] md:text-xs font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      {/* KPI ROW: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile title="Growth" value="+24.5%" trend="+12%" icon={<TrendingUp size={18}/>} color="indigo" />
        <StatTile title="Sessions" value="1,402" trend="+5.2%" icon={<Activity size={18}/>} color="emerald" />
        <StatTile title="Bounce" value="12.4%" trend="-2.1%" icon={<ArrowDownRight size={18}/>} color="red" />
        <StatTile title="Members" value="3,201" trend="+8%" icon={<Users size={18}/>} color="amber" />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GROWTH AREA CHART */}
        <div className="lg:col-span-8 min-w-0 rounded-3xl md:rounded-[2.5rem] border border-slate-200 bg-white p-5 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-bold text-slate-900">User Growth</h3>
            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 md:px-3 py-1 rounded-full">
              <Calendar size={10} /> <span className="hidden xs:inline">Last</span> 7 Days
            </div>
          </div>
          <div className="h-62.5 md:h-87.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', fontSize: '12px'}} />
                <Area type="monotone" dataKey="signups" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorInd)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DEVICE DISTRIBUTION */}
        <div className="lg:col-span-4 rounded-3xl md:rounded-[2.5rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 mb-6 text-sm md:text-base">Device Distribution</h3>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="h-40 md:h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceData} innerRadius={window.innerWidth < 768 ? 45 : 60} outerRadius={window.innerWidth < 768 ? 65 : 80} paddingAngle={5} dataKey="value">
                    <Cell fill="#6366f1" stroke="none" />
                    <Cell fill="#10b981" stroke="none" />
                    <Cell fill="#f59e0b" stroke="none" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-3 mt-6">
              <DeviceLabel label="Desktop" value="65%" color="bg-indigo-500" />
              <DeviceLabel label="Mobile" value="25%" color="bg-emerald-500" />
              <DeviceLabel label="Tablet" value="10%" color="bg-amber-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- OPTIMIZED HELPER COMPONENTS ---

const StatTile = React.memo(({ title, value, trend, icon, color }) => {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600"
  };

  return (
    <div className="p-4 md:p-5 rounded-3xl md:rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col hover:shadow-md transition-all">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <div className={`p-2 rounded-xl ${colorMap[color]}`}>{icon}</div>
        <span className={`text-[10px] font-black ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
      <p className="text-xl md:text-2xl font-black text-slate-900 leading-none">{value}</p>
      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{title}</p>
    </div>
  );
});

const DeviceLabel = ({ label, value, color }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-[11px] md:text-xs font-bold text-slate-600">{label}</span>
    </div>
    <span className="text-[11px] md:text-xs font-black text-slate-900">{value}</span>
  </div>
);

export default Analytics;