import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../auth/authentication/authContext.js";
import { LayoutDashboard, Users, BarChart3, LogOut, Settings } from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext); 
  const isAdmin = user?.role === "admin";

  const navLinkClass = ({ isActive }) => `
    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
    ${isActive 
      ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100" 
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
  `;

  return (
    <aside className="flex h-screen w-72 flex-col bg-white border-r border-slate-200">
      <div className="p-6">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <LayoutDashboard size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">DashUI</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        <NavLink to="/dashboard" end className={navLinkClass}>
          <LayoutDashboard size={20} />
          Overview
        </NavLink>

        {isAdmin && (
          <>
            <NavLink to="/dashboard/users" className={navLinkClass}>
              <Users size={20} />
              User Management
            </NavLink>
            <NavLink to="/dashboard/analytics" className={navLinkClass}>
              <BarChart3 size={20} />
              Analytics
            </NavLink>
          </>
        )}
        
        <div className="my-4 border-t border-slate-100 pt-4">
           <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Settings</p>
           <NavLink to="/dashboard/settings" className={navLinkClass}>
              <Settings size={20} />
              Account Settings
            </NavLink>
        </div>
      </nav>

      <div className="border-t border-slate-100 p-4">
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;