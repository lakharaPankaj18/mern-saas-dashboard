import React, { useContext } from "react";
import { UserPlus } from "lucide-react";
import { AuthContext } from "../../auth/authentication/authContext";

const AddUserBtn = ({ className = "", isFullCard = false }) => {
  const { setIsAddUserModalOpen } = useContext(AuthContext);

  return (
    <button
      onClick={() => setIsAddUserModalOpen(true)}
      className={`
        flex items-center justify-center gap-2 bg-indigo-600 text-white 
        font-bold transition-all shadow-lg shadow-indigo-100 hover:bg-indigo-700 
        active:scale-95 whitespace-nowrap
        ${isFullCard 
          ? "flex-col p-5 rounded-[2rem] h-full w-full" 
          : "px-4 py-2 rounded-xl text-sm"
        } 
        ${className}
      `}
    >
      <UserPlus size={isFullCard ? 24 : 16} className={isFullCard ? "mb-1" : ""} />
      <span className={isFullCard ? "text-[10px] uppercase tracking-tighter font-black" : ""}>
        Add User
      </span>
    </button>
  );
};

export default AddUserBtn;