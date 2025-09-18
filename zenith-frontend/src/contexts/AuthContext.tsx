import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import * as authService from '../services/authService';
import api from '../services/api';
import { notification } from 'antd';
import { LoginCredentials, RegisterData, User } from '../types';
import { socketService } from '../services/socketService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode<User>(token);
        setUser(decodedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Connect to WebSocket and set up listener
        socketService.connect(token);
        socketService.on('notification', (data: { message: string }) => {
          notification.info({
            message: 'New Notification',
            description: data.message,
          });
        });

      } catch (error) {
        console.error("Invalid token", error);
        setUser(null);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuth = async (authPromise: Promise<{ access_token: string }>) => {
    try {
      const { access_token } = await authPromise;
      localStorage.setItem('token', access_token);
      const decodedUser = jwtDecode<User>(access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(decodedUser);

      // Connect to WebSocket on login
      socketService.connect(access_token);

      navigate('/');
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error; // Re-throw to be caught in the component
    }
  };

  const login = async (credentials: LoginCredentials) => {
    await handleAuth(authService.login(credentials));
  };

  const register = async (data: RegisterData) => {
    await handleAuth(authService.register(data));
  };

  const logout = () => {
    socketService.disconnect();
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, register, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
