// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem('isAuthenticated')); // Initialize from localStorage

  // Function to log in the user
  const login = () => {
    setUser(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  // Function to log out the user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('isAuthenticated');
  };

  useEffect(() => {
    // This effect can be used for more complex session management
    // For example, checking for a valid token on initial load.
    // For this simple example, we're just using localStorage.
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};