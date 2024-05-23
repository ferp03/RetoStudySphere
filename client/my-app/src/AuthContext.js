import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/checkSession');
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        console.error("Failed to check authentication status", error);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await axiosInstance.post('/logout');
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
