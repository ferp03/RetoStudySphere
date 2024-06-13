import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(() => localStorage.getItem('userType') || '');
  const [nombreUsuario, setNombreUsuario] = useState(() => localStorage.getItem('nombreUsuario') || '');
  const [id, setId] = useState(() => localStorage.getItem('id') || '');
  const [quizArr, setQuizArr] = useState(() => {
    const savedQuizArr = localStorage.getItem('quizArr');
    return savedQuizArr ? JSON.parse(savedQuizArr) : [];
  });

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
    if (userType && nombreUsuario && id) {
      localStorage.setItem('userType', userType);
      localStorage.setItem('nombreUsuario', nombreUsuario);
      localStorage.setItem('id', id);
    } else {
      localStorage.removeItem('userType');
      localStorage.removeItem('nombreUsuario');
      localStorage.removeItem('id');
    }

    if (Array.isArray(quizArr) && quizArr.length > 0) {
      localStorage.setItem('quizArr', JSON.stringify(quizArr));
    } else {
      localStorage.removeItem('quizArr');
    }
  }, [userType, quizArr, nombreUsuario, id]);

  const logout = async () => {
    try {
      await axiosInstance.post('/logout');
      setIsAuthenticated(false);
      setUserType('');
      setQuizArr([]);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userType, setUserType, nombreUsuario, setNombreUsuario, id, setId, quizArr, setQuizArr, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
