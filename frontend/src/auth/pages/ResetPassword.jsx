import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";
import { api } from "../authentication/AuthProvider.jsx"; // Axios Instance

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");
    
    setLoading(true);
    setError("");

    try {
      // Switched to Axios (Patch request with token in URL)
      await api.patch(`/auth/reset-password/${token}`, { password });
      
      navigate("/login", { state: { message: "Password updated! Please login." } });
    } catch (err) {
      setError(err.response?.data?.message || "Token invalid or expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Set New Password</h2>
          <p className="text-sm text-slate-400">Must be at least 8 characters long.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">New Password</label>
            <input type="password" required minLength={8} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Confirm Password</label>
            <input type="password" required className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all text-sm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;