// Role-based frontend route guard

import { useContext } from "react";
import { AuthContext } from "../auth/authentication/authContext";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
const {user, isAuthenticated} = useContext(AuthContext)

// Not logged-in - login
if(!isAuthenticated){
    return <Navigate to="/login" replace/>
}

// Logged-in but not Admin - dashboard
if(user?.role !== "admin"){
    return <Navigate to="/dashboard" replace/>
}

// Admin - Allowed access
return <Outlet />
}

export default AdminRoute;