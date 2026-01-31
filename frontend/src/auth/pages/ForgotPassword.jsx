import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { api } from "../authentication/AuthProvider.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Switched to Axios
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {!submitted ? (
          <>
            <div className="text-center space-y-2">
              <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Mail size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Forgot Password?</h2>
              <p className="text-sm text-slate-400">No worries, we'll send you reset instructions.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Reset Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Check your email</h2>
            <p className="text-sm text-slate-400">We sent a link to <span className="font-bold text-slate-900">{email}</span></p>
          </div>
        )}
        <Link to="/login" className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;