import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/api';

interface AuthContextType {
  token: string | null;
  user: any | null; // You might want to define a more specific User interface
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any | null>(JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const login = async (username: string, password: string) => {
    const response = await loginUser({ username, password });
    setToken(response.data.token);
    setUser(response.data.user); // Assuming API returns user data on login
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await registerUser({ username, email, password });
    // Optionally log in the user immediately after registration
    setToken(response.data.token);
    setUser(response.data.user); // Assuming API returns user data on registration
  };

  const logout = () => {
    logoutUser(); // Invalidate token on the backend
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, isAuthenticated }}>
      {children}
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
