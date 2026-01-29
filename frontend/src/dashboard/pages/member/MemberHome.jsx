import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  Clock,
  Plus,
  Calendar,
  Trash2,
  Loader2,
  ListTodo,
  Search,
  Flame,
  Edit3,
  Filter,
  ChevronDown
} from "lucide-react";
import ConfirmationModal from "../../ui/ConfirmationModal.jsx";
import TaskModal from "../../components/TaskModal.jsx";

const MemberHome = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    priority: "Medium",
    due: new Date().toISOString().split("T")[0],
  });
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const token = localStorage.getItem("authToken");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:7005/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (err) {
      console.error("err", err)
      showToast("Sync failed");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:7005/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchTasks();
        setIsModalOpen(false);
        setFormData({
          title: "",
          priority: "Medium",
          due: new Date().toISOString().split("T")[0],
        });
        showToast("Task created successfully");
      }
    } catch (err) {
      console.error("err", err)
      showToast("Create failed");
    }
    setIsSubmitting(false);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `http://localhost:7005/api/tasks/${editingTask._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingTask),
        },
      );
      if (res.ok) {
        setTasks(
          tasks.map((t) => (t._id === editingTask._id ? editingTask : t)),
        );
        setIsEditModalOpen(false);
        showToast("Task updated successfully");
      }
    } catch (err) {
      console.error("err", err)
      showToast("Update failed");
    }
    setIsSubmitting(false);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `http://localhost:7005/api/tasks/${taskToDelete._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        setTasks(tasks.filter((t) => t._id !== taskToDelete._id));
        showToast("Task removed");
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error("err", err)
      showToast("Delete failed");
    }
    setIsSubmitting(false);
    setTaskToDelete(null);
  };

  const toggleTask = async (task) => {
    try {
      const res = await fetch(`http://localhost:7005/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error("err", err)
      console.error("err")
      showToast("Failed to toggle");
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPriority =
      priorityFilter === "All" || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="w-full mx-auto space-y-4 md:space-y-6 pt-2 pb-10 px-1">
      {/* Toast */}
      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-100 animate-in slide-in-from-top-10 px-4 w-full max-w-xs">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center justify-center gap-3 border border-white/10">
            <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-center">
              {toast}
            </span>
          </div>
        </div>
      )}

      {/* Stats Section: Grid adjustment */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          {
            label: "Progress",
            val: `${tasks.length ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0}%`,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Streak",
            val: "5 Days",
            icon: Flame,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
          {
            label: "Active",
            val: tasks.filter((t) => !t.completed).length,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Finished",
            val: tasks.filter((t) => t.completed).length,
            icon: ListTodo,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-4 md:p-5 rounded-3xl md:rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 md:gap-4"
          >
            <div
              className={`h-9 w-9 md:h-10 md:w-10 shrink-0 ${item.bg} ${item.color} rounded-xl md:rounded-2xl flex items-center justify-center`}
            >
              <item.icon size={18} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 tracking-widest truncate">
                {item.label}
              </p>
              <p className="text-sm md:text-base font-black text-slate-900 truncate">{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Center Container */}
      <div className="bg-white border border-slate-200 rounded-3xl md:rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="p-5 md:p-8 border-b border-slate-50 flex flex-col gap-4 bg-slate-50/20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-black text-slate-900">
              Action Center
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="sm:hidden h-10 w-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl shadow-lg active:scale-95"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>

            {/* Priority Filter */}
            <div className="relative group flex-1 sm:flex-none sm:w-40">
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none appearance-none cursor-pointer"
              >
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg active:scale-95 transition-all"
            >
              <Plus size={16} /> New Task
            </button>
          </div>
        </div>

        {/* Task List: Added Scroll Protection */}
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-indigo-600 opacity-20" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className={`group flex items-center justify-between p-4 md:p-5 rounded-2xl md:rounded-3xl border transition-all ${task.completed ? "bg-slate-50/50 border-transparent opacity-70" : "bg-white border-slate-100 shadow-sm"}`}
                  >
                    <div className="flex items-center gap-3 md:gap-5 min-w-0">
                      <button
                        onClick={() => toggleTask(task)}
                        className={`shrink-0 transition-all active:scale-90 ${task.completed ? "text-emerald-500" : "text-slate-200 hover:text-indigo-500"}`}
                      >
                        <CheckCircle2
                          size={24}
                          strokeWidth={task.completed ? 2.5 : 2}
                        />
                      </button>
                      <div className="min-w-0">
                        <h4
                          className={`text-xs md:text-sm font-bold truncate ${task.completed ? "text-slate-300 line-through" : "text-slate-800"}`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 md:gap-3 mt-1">
                          <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Calendar size={10} className="shrink-0" />{" "}
                            {new Date(task.due).toLocaleDateString()}
                          </span>
                          <span
                            className={`text-[7px] md:text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase whitespace-nowrap ${task.priority === "High" ? "bg-red-50 text-red-600" : task.priority === "Medium" ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-400"}`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions: Simplified for mobile touch */}
                    <div className="flex items-center gap-0.5 md:gap-1 ml-2">
                      <button
                        onClick={() => {
                          setEditingTask({ ...task });
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-indigo-600 sm:opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setTaskToDelete(task);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 sm:opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No matching tasks</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Objective"
        onSubmit={handleAddTask}
        data={formData}
        setData={setFormData}
        isSubmitting={isSubmitting}
        buttonText="Create Task"
      />
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Objective"
        onSubmit={handleUpdateTask}
        data={editingTask}
        setData={setEditingTask}
        isSubmitting={isSubmitting}
        buttonText="Save Changes"
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Remove "${taskToDelete?.title}"?`}
        confirmText="Delete Task"
        type="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default MemberHome;