import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../auth/authentication/authContext.js";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  return (
    <aside className="w-64 bg-white border-r">
      <nav className="p-4 space-y-2">
        <NavLink to="/dashboard">Dashboard</NavLink>

        {isAdmin && (
          <>
            <NavLink to="/dashboard/users">Users</NavLink>
            <NavLink to="/dashboard/analytics">Analytics</NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
