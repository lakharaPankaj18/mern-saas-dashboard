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

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
