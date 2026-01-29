import React, { useState, useContext, useEffect } from "react";
import { X, Loader2, UserPlus, Shield, Mail, User, CheckCircle, AlertCircle } from "lucide-react";
import { AuthContext } from "../../auth/authentication/authContext";

const AddMemberDrawer = ({ onUserAdded }) => {
  const { isAddUserModalOpen, setIsAddUserModalOpen, addUserApi } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({ name: "", email: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Scroll lock when drawer is open
  useEffect(() => {
    if (isAddUserModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isAddUserModalOpen]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await addUserApi(formData);
      const data = await res.json();

      if (res.ok) {
        if (onUserAdded) onUserAdded(data.user || data); 
        setToast({ type: "success", msg: "Success!" });
        setFormData({ name: "", email: "", role: "user" });
        setTimeout(() => setIsAddUserModalOpen(false), 800);
      } else {
        setToast({ type: "error", msg: data.message || "Failed" });
      }
    } catch (err) {
      console.error("err", err)
      setToast({ type: "error", msg: "Error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isAddUserModalOpen) return null;

  return (
    <>
      {/* Toast - Responsive positioning */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-110 flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl animate-in slide-in-from-top-4">
          {toast.type === 'success' ? <CheckCircle className="text-emerald-400" size={16} /> : <AlertCircle className="text-red-400" size={16} />}
          <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{toast.msg}</span>
        </div>
      )}

      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-80 transition-opacity animate-in fade-in duration-300" 
        onClick={() => setIsAddUserModalOpen(false)} 
      />
      
      {/* Drawer: Bottom sheet on mobile, Side drawer on desktop */}
      <div className="fixed inset-x-0 bottom-0 top-12 md:top-0 md:left-auto md:right-0 h-auto md:h-full w-full md:max-w-md bg-white shadow-2xl z-90 rounded-t-[2.5rem] md:rounded-t-none animate-in slide-in-from-bottom md:slide-in-from-right duration-500 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col">
        
        {/* Mobile Handle */}
        <div className="md:hidden flex justify-center py-4">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-2 md:pt-10">
          <div className="flex justify-between items-start mb-8 md:mb-10">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Add New User</h2>
              <p className="text-[11px] md:text-xs text-slate-400 font-medium">Create a new account for your team</p>
            </div>
            <button 
              onClick={() => setIsAddUserModalOpen(false)} 
              className="p-2 md:p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl md:rounded-2xl transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 pb-10">
            {/* Inputs */}
            {[
              { label: "Full Name", icon: User, type: "text", field: "name", placeholder: "John Doe" },
              { label: "Email Address", icon: Mail, type: "email", field: "email", placeholder: "john@company.com" }
            ].map((input) => (
              <div key={input.field} className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{input.label}</label>
                <div className="relative group">
                  <input.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    required
                    type={input.type}
                    className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none text-xs md:text-sm transition-all font-medium"
                    placeholder={input.placeholder}
                    value={formData[input.field]}
                    onChange={(e) => setFormData({...formData, [input.field]: e.target.value})}
                  />
                </div>
              </div>
            ))}

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Permission Level</label>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {['member', 'admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({...formData, role: r})}
                    className={`flex items-center justify-center gap-2 py-3.5 md:py-4 rounded-xl md:rounded-[1.25rem] border-2 font-black text-[9px] md:text-[10px] uppercase tracking-wider transition-all ${
                      formData.role === r 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                        : 'bg-white border-slate-100 text-slate-400'
                    }`}
                  >
                    {r === 'admin' ? <Shield size={14} /> : <User size={14} />}
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 md:pt-6">
              <button 
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 md:py-5 rounded-xl md:rounded-3xl font-black text-[11px] md:text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <><UserPlus size={18} /> Create Account</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddMemberDrawer;