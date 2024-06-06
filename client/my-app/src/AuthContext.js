import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(() => localStorage.getItem('userType') || '');
  const [quizArr, setQuizArr] = useState(() => {
    const savedQuizArr = localStorage.getItem('quizArr');
    console.log('Retrieved quizArr from localStorage:', savedQuizArr);
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
    if (userType) {
      localStorage.setItem('userType', userType);
    } else {
      localStorage.removeItem('userType');
    }

    if (Array.isArray(quizArr) && quizArr.length > 0) {
      localStorage.setItem('quizArr', JSON.stringify(quizArr));
      console.log('Stored quizArr in localStorage:', JSON.stringify(quizArr));
    } else {
      localStorage.removeItem('quizArr');
    }
  }, [userType, quizArr]);

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
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userType, setUserType, quizArr, setQuizArr, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
