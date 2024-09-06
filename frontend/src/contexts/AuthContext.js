import React, { createContext, useState, useContext, useEffect } from "react";

// Create context
const AuthContext = createContext();

// Provider component
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to set user in local storage and state
  const setAuthUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Function to clear user from local storage and state (logout)
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Check user authentication on initial render
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      localStorage.removeItem("user"); // Clear corrupted data
    }
  }, []);

  // Provide authentication state and functions to children
  return (
    <AuthContext.Provider value={{ user, setAuthUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
