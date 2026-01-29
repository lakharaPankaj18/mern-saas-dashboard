import { useState, useEffect, useMemo } from "react";
import { AuthContext } from "./authContext";
import axios from "axios";

const API_URL = "http://localhost:7005/api";

// Create an axios instance for all API calls
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for sending/receiving cookies
});

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

  // 1. Update Axios headers whenever token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // 2. The "Silent Refresh" Interceptor
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        // If error is 401 (Expired) and we haven't retried yet
        if (error?.response?.status === 401 && !prevRequest?._retry) {
          prevRequest._retry = true;
          try {
            // Call the refresh endpoint (cookies are sent automatically)
            const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
            
            setToken(data.accessToken);
            localStorage.setItem("authToken", data.accessToken);
            
            // Update the failed request with new token and retry
            prevRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
            return api(prevRequest);
          } catch (refreshError) {
            logout(); // If refresh fails, session is truly dead
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [token]);

  const login = (accessToken, userData) => {
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (newData) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...newData };
      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const addUserApi = async (userData) => {
    // Now using the 'api' instance which has the token automatically
    return await api.post("/users", userData);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
        updateUser,
        addUserApi,
        isAddUserModalOpen,
        setIsAddUserModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;