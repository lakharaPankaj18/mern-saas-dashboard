import { Bell, Search, User } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../auth/authentication/authContext";

const Topbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex h-16 items-center justify-between px-8">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search something..." 
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-50"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 transition-colors">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">{user?.name}</p>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-tighter">{user?.role}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 group-hover:border-indigo-200 transition-all">
            <User size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;