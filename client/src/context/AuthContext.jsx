import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../lib/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCurrentUser(null);
      setIsLoading(false);
      return;
    }

    try {
      // In development/mock mode, we can fake a successful user if the API is down
      // But we should try to call the API
      const response = await axiosInstance.get('/auth/me');
      setCurrentUser(response.data.user || response.data);
    } catch (error) {
      console.error('Failed to fetch user', error);
      // STRICT LOGOUT ON ERROR:
      setCurrentUser(null);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    window.location.href = '/';
  };

  const value = {
    currentUser,
    setCurrentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    logout,
    refreshUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
