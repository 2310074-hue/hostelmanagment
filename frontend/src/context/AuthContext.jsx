import React, { createContext, useState, useContext, useEffect } from "react";
import { STORAGE_KEYS } from "../utils/constants";

// AuthContext holds the currently logged-in user, their role (student/admin)
// and exposes login()/logout() helpers to the rest of the app via useContext.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, restore session from localStorage (keeps user logged in on refresh).
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER) || sessionStorage.getItem(STORAGE_KEYS.USER);
    const storedRole = localStorage.getItem(STORAGE_KEYS.ROLE) || sessionStorage.getItem(STORAGE_KEYS.ROLE);
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  // Called after a successful login API response { token, role, user }
  // `rememberSession` controls whether auth is saved to localStorage or sessionStorage.
  const login = ({ token, role: userRole, user: userData }, rememberSession = true) => {
    const storage = rememberSession ? localStorage : sessionStorage;
    const otherStorage = rememberSession ? sessionStorage : localStorage;

    storage.setItem(STORAGE_KEYS.TOKEN, token);
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    storage.setItem(STORAGE_KEYS.ROLE, userRole);

    otherStorage.removeItem(STORAGE_KEYS.TOKEN);
    otherStorage.removeItem(STORAGE_KEYS.USER);
    otherStorage.removeItem(STORAGE_KEYS.ROLE);

    setUser(userData);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.ROLE);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook so components can simply do: const { user, role, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
