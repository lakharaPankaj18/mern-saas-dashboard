import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../auth/authentication/authContext";

import {
  ArrowLeft,
  Shield,
  Calendar,
  Loader2,
  AlertTriangle,
  Power,
  CheckCircle,
  Mail,
  Fingerprint,
  Trash2,
  Send,
  UserCircle
} from "lucide-react";
import ConfirmationModal from "../../ui/ConfirmationModal";

const UserProfile = () => {
  const { id } = useParams();
  const auth = useContext(AuthContext);
  const currentUser = auth?.user;
  const token = auth?.token;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({ 
    isOpen: false, 
    type: "danger", 
    title: "", 
    message: "", 
    confirmText: "", 
    onConfirm: () => {} 
  });

  const isSelf = useMemo(() => currentUser?._id === id, [currentUser, id]);
  const isAdminTargetingAdmin = useMemo(() => currentUser?.role === 'admin' && user?.role === 'admin', [currentUser, user]);
  const canModifyStatus = !isSelf && !isAdminTargetingAdmin;

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:7005/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (err) {
        console.error("err", err)
        setToast({ type: 'error', msg: "Profile connection failed" });
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUser();
  }, [id, token]);

  const handleToggleStatus = useCallback(async () => {
    setIsActionLoading(true);
    try {
      const res = await fetch(`http://localhost:7005/api/users/${id}/status`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(prev => ({ ...prev, isActive: data.isActive }));
        setToast({ type: 'success', msg: `Account ${data.isActive ? 'Restored' : 'Suspended'}` });
        setModal(prev => ({ ...prev, isOpen: false }));
      }
    } catch (err) {
      console.error("err", err)
      setToast({ type: 'error', msg: "Update failed" });
    } finally {
      setIsActionLoading(false);
    }
  }, [id, token]);

  const handleDeleteUser = useCallback(async () => {
    setIsActionLoading(true);
    try {
      const res = await fetch(`http://localhost:7005/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setToast({ type: 'success', msg: "User deleted successfully" });
        setModal(prev => ({ ...prev, isOpen: false }));
        setTimeout(() => navigate("/dashboard/users"), 1200);
      } else {
        const data = await res.json();
        setToast({ type: 'error', msg: data.message || "Delete failed" });
      }
    } catch (err) {
      console.error("err", err)
      setToast({ type: 'error', msg: "Server error during deletion" });
    } finally {
      setIsActionLoading(false);
    }
  }, [id, token, navigate]);

  const triggerSuspendModal = () => {
    setModal({
      isOpen: true,
      type: user.isActive ? "danger" : "warning",
      title: user.isActive ? "Confirm Suspension" : "Restore Access",
      message: `Suspend or restore ${user.name}? This affects login ability.`,
      confirmText: user.isActive ? "Suspend User" : "Restore User",
      onConfirm: handleToggleStatus
    });
  };

  const triggerDeleteModal = () => {
    setModal({
      isOpen: true,
      type: "danger",
      title: "Permanent Deletion",
      message: `All data for ${user.name} will be permanently purged.`,
      confirmText: "Delete Permanently",
      onConfirm: handleDeleteUser
    });
  };

  if (loading) return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600 opacity-20" />
    </div>
  );

  if (!user) return <div className="p-10 md:p-20 text-center font-bold text-slate-300">User profile not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-110 flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl">
          {toast.type === 'success' ? <CheckCircle className="text-emerald-400" size={18} /> : <AlertTriangle className="text-red-400" size={18} />}
          <span className="text-[10px] font-black uppercase tracking-tight">{toast.msg}</span>
        </div>
      )}

      <ConfirmationModal 
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        type={modal.type}
        isLoading={isActionLoading}
      />

      <div className="flex items-center px-2">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-slate-400 hover:text-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest">
          <div className="p-2 rounded-xl bg-white border border-slate-100">
            <ArrowLeft size={14} />
          </div>
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
        
        {/* SIDEBAR CARD */}
        <div className="lg:col-span-4 space-y-4 md:space-y-6">
          <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-200 shadow-sm p-6 md:p-8 text-center relative">
            <div className="absolute top-4 right-4 md:top-6 md:right-6">
               <span className={`h-2.5 w-2.5 rounded-full block ${user.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
            </div>
            
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-3xl bg-linear-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-600 font-black text-2xl md:text-3xl mx-auto mb-4 md:mb-6 border-4 border-white shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <h2 className="text-lg md:text-xl font-black text-slate-900 leading-tight truncate px-2">{user.name}</h2>
            <p className="text-[11px] text-slate-400 font-bold tracking-tight mb-6 md:mb-8 truncate px-4">{user.email}</p>
            
            <div className={`py-2.5 md:py-3 rounded-2xl flex items-center justify-center gap-2 border ${user.role === 'admin' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
              {user.role === 'admin' ? <Shield size={14} /> : <UserCircle size={14} />}
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{user.role}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-200 p-6 md:p-8 shadow-sm">
            <h3 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 md:mb-6">Details</h3>
            <div className="space-y-4">
              <ProfileMeta icon={<Calendar />} label="Joined" value={new Date(user.createdAt).toLocaleDateString('en-GB')} />
              <ProfileMeta icon={<Fingerprint />} label="ID" value={`#${user._id.slice(-6)}`} />
              <ProfileMeta icon={<Mail />} label="Status" value={user.isActive ? "Authorized" : "Suspended"} color={user.isActive ? "text-emerald-500" : "text-red-500"} />
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-8 space-y-4 md:space-y-6">
          <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-200 p-6 md:p-10 shadow-sm">
            <h3 className="text-base md:text-lg font-black text-slate-900 mb-1">Account Administration</h3>
            <p className="text-xs md:text-sm text-slate-400 font-medium mb-6 md:mb-10">Manage permissions and access levels.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={triggerSuspendModal}
                disabled={!canModifyStatus || isActionLoading}
                className={`group text-left p-5 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all ${
                  user.isActive 
                    ? 'border-red-50 bg-red-50/10 hover:bg-red-50' 
                    : 'border-emerald-50 bg-emerald-50/10 hover:bg-emerald-50'
                } disabled:opacity-20`}
              >
                <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 ${user.isActive ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  <Power size={20} />
                </div>
                <p className={`text-xs md:text-sm font-black uppercase tracking-tight ${user.isActive ? 'text-red-600' : 'text-emerald-600'}`}>
                  {user.isActive ? "Suspend User" : "Activate User"}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Instant access control</p>
              </button>

              <button className="group text-left p-5 md:p-6 rounded-2xl md:rounded-3xl border-2 border-slate-50 hover:bg-slate-50 transition-all">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-3 md:mb-4">
                  <Send size={20} />
                </div>
                <p className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight">Reset Password</p>
                <p className="text-[10px] text-slate-500 mt-1">Send email link</p>
              </button>
            </div>

            {/* Danger Zone Banner */}
            {!isSelf && !isAdminTargetingAdmin && (
              <div className="mt-8 md:mt-12 pt-8 md:pt-10 border-t border-slate-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 p-6 md:p-8 bg-slate-900 rounded-3xl md:rounded-4xl text-white text-center md:text-left">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Danger Zone</p>
                    <h4 className="text-base md:text-lg font-bold">Remove User Permanently</h4>
                    <p className="text-[10px] text-slate-400">This action is irreversible.</p>
                  </div>
                  <button 
                    onClick={triggerDeleteModal}
                    disabled={isActionLoading}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black rounded-xl transition-all shadow-lg shadow-red-900/40"
                  >
                    {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileMeta = ({ icon, label, value, color = "text-slate-900" }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-2 md:gap-3 text-slate-300">
      {React.cloneElement(icon, { size: 12 })}
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <span className={`text-[10px] md:text-[11px] font-black truncate ${color}`}>{value}</span>
  </div>
);

export default UserProfile;