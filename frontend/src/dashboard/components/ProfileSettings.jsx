import React, { useState, useContext, useEffect } from "react";
import { User, Lock, Save, ShieldCheck, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { AuthContext } from "../../auth/authentication/authContext.js";

const ProfileSettings = () => {
  const { user, updateUser } = useContext(AuthContext);
  const token = localStorage.getItem("authToken");

  const [name, setName] = useState(user?.name || "");
  const [toast, setToast] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState({ profile: false, security: false });

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, profile: true });
    try {
      const res = await fetch("http://localhost:7005/api/users/update-name", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (res.ok) {
        updateUser({ name: data.name });
        showToast("Profile name updated!");
      }
    } catch (err) {
      console.error("err", err)
      showToast("Error updating name", "error");
    } finally {
      setLoading({ ...loading, profile: false });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    setLoading({ ...loading, security: true });
    try {
      const res = await fetch("http://localhost:7005/api/users/update-password", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Security updated successfully");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showToast(data.message || "Failed to update password", "error");
      }
    } catch (err) {
      console.error("err", err)
      showToast("Security update failed", "error");
    } finally {
      setLoading({ ...loading, security: false });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 md:space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Responsive Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-100 w-[90%] max-w-xs animate-in slide-in-from-top-10">
          <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            {toast.type === "success" ? (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-red-400 shrink-0" />
            )}
            <span className="text-[10px] md:text-xs font-black uppercase tracking-wider">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Header - Centered on mobile */}
      <div className="px-2 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Account Settings</h2>
        <p className="text-xs md:text-sm text-slate-500 font-medium">Manage your profile identity and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
        
        {/* SECTION 1: PROFILE IDENTITY */}
        <div className="bg-white border border-slate-200 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="h-9 w-9 md:h-10 md:w-10 bg-indigo-50 text-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center">
              <User size={18} />
            </div>
            <h3 className="font-black text-slate-900 text-sm md:text-base uppercase tracking-tight">Identity</h3>
          </div>

          <form onSubmit={handleUpdateName} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-xs md:text-sm transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading.profile}
              className="w-full py-3.5 md:py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {loading.profile ? <Loader2 className="animate-spin" size={16} /> : <><Save size={14} /> Save Changes</>}
            </button>
          </form>
        </div>

        {/* SECTION 2: SECURITY */}
        <div className="bg-white border border-slate-200 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="h-9 w-9 md:h-10 md:w-10 bg-emerald-50 text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <h3 className="font-black text-slate-900 text-sm md:text-base uppercase tracking-tight">Security</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 md:space-y-5">
            <div className="space-y-1">
              <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 ml-1">Current Password</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 font-bold text-xs md:text-sm"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 ml-1">New Password</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 font-bold text-xs md:text-sm"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 ml-1">Confirm Password</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 font-bold text-xs md:text-sm"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              disabled={loading.security}
              className="w-full py-3.5 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading.security ? <Loader2 className="animate-spin" size={16} /> : <><Lock size={14} /> Update Password</>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ProfileSettings;