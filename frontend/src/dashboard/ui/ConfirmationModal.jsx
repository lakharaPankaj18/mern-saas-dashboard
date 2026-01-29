import React from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText, 
  type = "danger", // "danger" (red) or "warning" (indigo)
  isLoading = false 
}) => {
  if (!isOpen) return null;

  const themes = {
    danger: "bg-red-600 hover:bg-red-700 shadow-red-100 text-white",
    warning: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 text-white"
  };

  const iconThemes = {
    danger: "bg-red-50 text-red-600",
    warning: "bg-indigo-50 text-indigo-600"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={isLoading ? null : onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`p-4 rounded-2xl mb-6 ${iconThemes[type]}`}>
            <AlertTriangle size={32} />
          </div>

          <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-95 disabled:opacity-50 ${themes[type]}`}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ConfirmationModal);