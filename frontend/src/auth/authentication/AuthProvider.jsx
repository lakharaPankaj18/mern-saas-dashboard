import { useState } from "react";
import { AuthContext } from "./authContext";

const getInitialAuthState = () => {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("authUser");

  return {
    token: token || null,
    user: user ? JSON.parse(user) : null,
  };
};

const AuthProvider = ({ children }) => {
  const initialAuth = getInitialAuthState();

  const [token, setToken] = useState(initialAuth.token);
  const [user, setUser] = useState(initialAuth.user);
  
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const login = (token, user) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setToken(null);
    setUser(null);
  };

  // --- NEW: Update User Logic ---
  const updateUser = (newData) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...newData };
      // Save the updated user back to localStorage so it persists on refresh
      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const addUserApi = async (userData) => {
    const res = await fetch("http://localhost:7005/api/users", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(userData),
    });
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
        updateUser, // Added to exported values
        addUserApi,
        isAddUserModalOpen,
        setIsAddUserModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;