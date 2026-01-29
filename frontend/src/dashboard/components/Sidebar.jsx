import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../auth/authentication/authContext.js";
import { LayoutDashboard, Users, BarChart3, LogOut, Settings } from "lucide-react";

const Sidebar = ({ isSidebarOpen }) => {
  const { user, logout } = useContext(AuthContext); 
  const isAdmin = user?.role === "admin";

  const navLinkClass = ({ isActive }) => `
    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
    ${isActive 
      ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100" 
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
    ${!isSidebarOpen ? "lg:justify-center lg:px-2" : ""}
  `;

  return (
    <aside className={`
      /* Layout Logic */
      fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out
      lg:relative lg:translate-x-0
      
      /* Width & Visibility Logic */
      ${isSidebarOpen 
        ? "translate-x-0 w-72 shadow-2xl lg:shadow-none" 
        : "-translate-x-full lg:translate-x-0 lg:w-20"}
    `}>
      {/* Brand Header */}
      <div className="p-6">
        <div className={`flex items-center gap-3 ${!isSidebarOpen ? "lg:justify-center" : "px-2"}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <LayoutDashboard size={24} />
          </div>
          {/* Show text if expanded on desktop OR if we are on mobile (where it's always expanded) */}
          {(isSidebarOpen || window.innerWidth < 1024) && (
            <span className="text-xl font-bold tracking-tight text-slate-900 animate-in fade-in duration-300">DashUI</span>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-4 overflow-y-auto">
        <NavLink to="/dashboard" end className={navLinkClass}>
          <LayoutDashboard size={20} className="shrink-0" />
          {(isSidebarOpen || window.innerWidth < 1024) && <span className="animate-in fade-in">Overview</span>}
        </NavLink>

        {isAdmin && (
          <>
            <NavLink to="/dashboard/users" className={navLinkClass}>
              <Users size={20} className="shrink-0" />
              {(isSidebarOpen || window.innerWidth < 1024) && <span className="animate-in fade-in">User Management</span>}
            </NavLink>
            <NavLink to="/dashboard/analytics" className={navLinkClass}>
              <BarChart3 size={20} className="shrink-0" />
              {(isSidebarOpen || window.innerWidth < 1024) && <span className="animate-in fade-in">Analytics</span>}
            </NavLink>
          </>
        )}
        
        <div className="my-4 border-t border-slate-100 pt-4">
           {(isSidebarOpen || window.innerWidth < 1024) && (
             <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Settings</p>
           )}
           <NavLink to="/dashboard/settings" className={navLinkClass}>
              <Settings size={20} className="shrink-0" />
              {(isSidebarOpen || window.innerWidth < 1024) && <span className="animate-in fade-in">Account Settings</span>}
            </NavLink>
        </div>
      </nav>

      {/* Logout Footer */}
      <div className="border-t border-slate-100 p-4">
        <button 
          onClick={logout}
          className={`flex w-full items-center gap-3 rounded-xl py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 ${isSidebarOpen ? "px-4" : "lg:justify-center"}`}
        >
          <LogOut size={20} className="shrink-0" />
          {(isSidebarOpen || window.innerWidth < 1024) && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;