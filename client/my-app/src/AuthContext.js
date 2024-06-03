import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(() => localStorage.getItem('userType') || '');

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

  useEffect(() => {
    if (userType) {
      localStorage.setItem('userType', userType);
    } else {
      localStorage.removeItem('userType');
    }
  }, [userType]);
  
  const logout = async () => {
    try {
      await axiosInstance.post('/logout');
      setIsAuthenticated(false);
      setUserType('');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userType, setUserType, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
