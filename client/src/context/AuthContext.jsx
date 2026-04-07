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
      // Fallback for UI building if backend is totally absent
      if (import.meta.env.DEV) {
        console.warn('Backend missing or failed, using mock user for UI testing');
        setCurrentUser({
          id: 'mock-123',
          username: 'mockdeveloper',
          displayName: 'Mock Developer',
          email: 'mock@example.com',
          avatarUrl: '',
          bio: 'Building awesome web apps. React and Node.js enthusiast. Never stop learning.',
          followersCount: 42,
          followingCount: 15,
          skills: ['React', 'Node.js', 'TailwindCSS'],
        });
      } else {
        setCurrentUser(null);
        localStorage.removeItem('token');
      }
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
