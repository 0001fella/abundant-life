import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enhanced getProfile with retry logic
  const getProfile = async (signal, retryCount = 0) => {
    try {
      const res = await api.get("/auth/profile", {
        signal,
        validateStatus: (status) => [200, 401].includes(status),
      });

      if (res.status === 200) {
        setUser(res.data);
        setError(null);
        return true;
      } else {
        console.warn("Profile request failed:", res.status, res.data);
        handleInvalidSession();
        return false;
      }
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error("getProfile error:", err);
        
        // Retry logic for network errors
        if (err.code === 'ECONNABORTED' || err.message.includes('Network Error')) {
          if (retryCount < 2) {
            return new Promise(resolve => {
              setTimeout(() => resolve(getProfile(signal, retryCount + 1)), 1000 * (retryCount + 1));
            });
          }
        }
        
        setError(err.message || "Unable to verify session.");
      }
      handleInvalidSession();
      return false;
    }
  };

  const handleInvalidSession = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  // Initialize auth state with token verification
  useEffect(() => {
    const controller = new AbortController();

    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await getProfile(controller.signal);
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => controller.abort();
  }, []);

  // Enhanced login with session validation
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.post("/auth/login", { email, password }, {
        timeout: 10000 // 10 second timeout
      });

      const { token, user } = res.data;
      if (!token) throw new Error("No authentication token received");

      localStorage.setItem("token", token);
      
      // Verify the session is actually valid
      const profileValid = await getProfile();
      if (!profileValid) {
        throw new Error("Session validation failed after login");
      }

      toast.success(`Welcome back, ${user.name || user.email}!`);
      return { token, user };
    } catch (err) {
      const msg = err.response?.data?.message || 
                 err.message || 
                 "Login failed. Please try again.";
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Enhanced logout with cleanup
  const logout = async (options = {}) => {
    const { silent = false, redirect = true } = options;
    
    try {
      await api.post("/auth/logout", null, {
        timeout: 5000
      });
    } catch (err) {
      if (!silent) {
        console.warn("Logout API error:", err);
      }
    } finally {
      handleInvalidSession();
      if (!silent) {
        toast.success("You have been logged out.");
      }
      if (redirect && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  };

  // Auto-logout on 401 errors globally
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout({ silent: true });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isVerified: user?.verified,
    getProfile,
    login,
    logout,
    refreshUser: () => getProfile(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}