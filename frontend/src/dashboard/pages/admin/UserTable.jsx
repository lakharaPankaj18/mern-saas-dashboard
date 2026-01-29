import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import {
  Search,
  ExternalLink,
  Shield,
  User,
  ChevronLeft,
  ChevronRight,
  FilterX,
  MoreHorizontal,
  Mail,
  Trash2,
  Power,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Lock
} from "lucide-react";

import { AuthContext } from "../../../auth/authentication/authContext";
import AddUserBtn from "../../components/AddUserBtn";
import ConfirmationModal from "../../ui/ConfirmationModal";

const UserTable = () => {
  const { token } = useContext(AuthContext); 
  const navigate = useNavigate();

  // Data States
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  // UI States
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "danger",
    title: "",
    message: "",
    confirmText: "",
    onConfirm: () => {},
  });

  // Toast Auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = () => setOpenDropdownId(null);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  // Search Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:7005/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUsers(data.users || data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- API ACTIONS ---
  const handleToggleStatus = async (user) => {
    setIsActionLoading(true);
    try {
      const res = await fetch(`http://localhost:7005/api/users/${user._id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isActive: !u.isActive } : u))
        );
        setToast({ type: "success", msg: `User ${!user.isActive ? "Activated" : "Suspended"}` });
        setModal((prev) => ({ ...prev, isOpen: false }));
      }
    } catch (err) {
      console.error("err", err)
      setToast({ type: "error", msg: "Update failed" });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    setIsActionLoading(true);
    try {
      const res = await fetch(`http://localhost:7005/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        setToast({ type: "success", msg: "User permanently deleted" });
        setModal((prev) => ({ ...prev, isOpen: false }));
      }
    } catch (err) {
      console.error("err", err)
      setToast({ type: "error", msg: "Delete failed" });
    } finally {
      setIsActionLoading(false);
    }
  };

  const triggerSuspendModal = (user) => {
    setModal({
      isOpen: true,
      type: user.isActive ? "danger" : "warning",
      title: user.isActive ? "Suspend User?" : "Activate User?",
      message: `Are you sure you want to ${user.isActive ? "suspend" : "activate"} ${user.name}?`,
      confirmText: user.isActive ? "Suspend" : "Activate",
      onConfirm: () => handleToggleStatus(user),
    });
  };

  const triggerDeleteModal = (user) => {
    setModal({
      isOpen: true,
      type: "danger",
      title: "Delete User?",
      message: `Permanently delete ${user.name}? This action cannot be undone.`,
      confirmText: "Delete",
      onConfirm: () => handleDeleteUser(user._id),
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [users, debouncedSearch]);

  const currentUsers = useMemo(() => {
    const start = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(start, start + usersPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading)
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pb-10">
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-100 flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl animate-in slide-in-from-top-full">
          {toast.type === "success" ? (
            <CheckCircle className="text-emerald-400" size={18} />
          ) : (
            <AlertCircle className="text-red-400" size={18} />
          )}
          <span className="text-xs font-black uppercase tracking-tight">{toast.msg}</span>
        </div>
      )}

      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        type={modal.type}
        isLoading={isActionLoading}
      />

      {/* --- HEADER CONTROLS: Responsive Flex --- */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 md:p-6 rounded-3xl md:rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">User Management</h2>
          <p className="hidden sm:block text-[10px] text-slate-400 font-medium uppercase tracking-widest">Team access control</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          <button
            onClick={fetchUsers}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            title="Refresh Table"
          >
            <RefreshCw size={18} className={isActionLoading ? "animate-spin" : ""} />
          </button>
          
          <div className="relative flex-1 min-w-35 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-xs md:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-auto">
            <AddUserBtn /> 
          </div>
        </div>
      </div>

      {/* --- TABLE: Horizontal Scroll Protection --- */}
      <div className="bg-white border border-slate-200 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="px-6 md:px-8 py-5 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Member Details
                </th>
                <th className="px-6 md:px-8 py-5 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Role & Status
                </th>
                <th className="px-6 md:px-8 py-5 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 md:px-8 py-4">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="h-9 w-9 md:h-11 md:w-11 shrink-0 rounded-xl md:rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black shadow-sm border border-slate-200">
                          {user.name?.[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs md:text-sm font-black text-slate-900 truncate max-w-30 md:max-w-none">{user.name}</span>
                          <span className="text-[10px] md:text-[11px] text-slate-400 font-medium flex items-center gap-1 truncate max-w-37.5 md:max-w-none">
                            <Mail size={10} className="shrink-0" /> {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase border whitespace-nowrap ${
                            user.role === "admin"
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : "bg-indigo-50 text-indigo-600 border-indigo-100"
                          }`}
                        >
                          {user.role === "admin" ? <Shield size={10} /> : <User size={10} />}
                          {user.role}
                        </span>
                        <span
                          className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                            user.isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                          }`}
                        />
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 md:gap-2 relative">
                        <button
                          onClick={() => navigate(`/dashboard/users/${user._id}`)}
                          className="p-2 bg-slate-50 text-slate-400 rounded-lg md:rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                          <ExternalLink size={16} />
                        </button>

                        <div className="relative">
                          <button
                            disabled={user.role === "admin"}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === user._id ? null : user._id);
                            }}
                            className={`p-2 rounded-lg md:rounded-xl transition-all ${
                              user.role === "admin"
                                ? "opacity-30 cursor-not-allowed text-slate-400"
                                : openDropdownId === user._id
                                ? "bg-slate-900 text-white"
                                : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {user.role === "admin" ? <Lock size={16} /> : <MoreHorizontal size={16} />}
                          </button>

                          {openDropdownId === user._id && user.role !== "admin" && (
                            <div className="absolute right-0 mt-2 w-44 md:w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                              <button
                                onClick={() => triggerSuspendModal(user)}
                                className={`w-full px-4 py-2.5 text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${
                                  user.isActive ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                                }`}
                              >
                                <Power size={14} /> {user.isActive ? "Suspend User" : "Activate User"}
                              </button>
                              <div className="h-px bg-slate-50 my-1" />
                              <button
                                onClick={() => triggerDeleteModal(user)}
                                className="w-full px-4 py-2.5 text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                              >
                                <Trash2 size={14} /> Delete Member
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <FilterX className="text-slate-200 mb-4" size={32} />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- FOOTER: Responsive Pagination --- */}
        <div className="px-6 md:px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest order-2 sm:order-1">
            {filteredUsers.length} total members
          </span>

          <div className="flex items-center gap-1 order-1 sm:order-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-20 transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-6 w-6 rounded-lg text-[9px] md:text-[10px] font-black transition-all ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-20 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;