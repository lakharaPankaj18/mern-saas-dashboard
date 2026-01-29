import { Bell, Search, User, Menu, ChevronLeft, X } from "lucide-react";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../auth/authentication/authContext";

const Topbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isUsersPage = location.pathname === "/dashboard/users";
  const isHomePage = location.pathname === "/dashboard" || location.pathname === "/dashboard/home";

  return (
    <div className="flex h-16 md:h-20 items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100">
      <div className="flex items-center gap-3 md:gap-4 flex-1">
        {/* SIDEBAR TOGGLE */}
        <button 
          onClick={onToggleSidebar}
          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all active:scale-95 bg-white shadow-sm"
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="relative flex-1 max-w-xs md:max-w-none">
          {isUsersPage ? (
            <div className="relative w-full md:w-80 animate-in fade-in slide-in-from-left-2 duration-300">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs md:text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all"
              />
            </div>
          ) : isHomePage ? (
            <div className="animate-in fade-in slide-in-from-left-2 duration-500">
              <h1 className="text-sm md:text-lg font-black text-slate-900 leading-none truncate max-w-37.5 md:max-w-none">
                Hi, {user?.name?.split(" ")[0]}! 👋
              </h1>
              <p className="hidden xs:block text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Platform Overview</p>
            </div>
          ) : (
            /* Fallback for other pages */
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight md:hidden">
              {location.pathname.split("/").pop()}
            </h1>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <button className="relative rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 transition-colors bg-white shadow-sm">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        
        <div className="hidden xs:block h-8 w-px bg-slate-100 mx-1 md:mx-2"></div>

        {/* User Profile */}
        <div className="flex items-center gap-2 md:gap-3 pl-1">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">{user?.role}</p>
          </div>
          <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 shadow-sm shrink-0">
            <User size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;