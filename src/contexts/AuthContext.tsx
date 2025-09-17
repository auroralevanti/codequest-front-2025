'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginForm } from '@/types/forms';
import { getUserCookie, removeUserCookie, setUserCookie, UserData } from '@/lib/cookies';
import { apiUrls } from '@/config/api';

// Simple user interface
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

// Simple auth context interface
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginForm) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  canEditPost: (postAuthorId: string) => boolean;
  canDeletePost: (postAuthorId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from cookies
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const cookieData = getUserCookie();
        if (cookieData) {
          setUser({
            id: cookieData.id,
            name: cookieData.name || cookieData.username || '',
            email: cookieData.email,
            role: cookieData.role || cookieData.roles || 'user',
            avatar: cookieData.avatar
          });
          setToken(cookieData.token || null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('Error loading user data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginForm): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const url = apiUrls.auth.login();
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const resp = await response.json();

      if (resp && resp.user && resp.token) {
        const userData: User = {
          id: resp.user.id,
          name: resp.user.name,
          email: resp.user.email,
          role: resp.user.role,
          avatar: resp.user.avatar
        };

        // Save to cookies
        setUserCookie({
          id: resp.user.id,
          username: resp.user.username,
          name: resp.user.name || resp.user.username,
          email: resp.user.email,
          roles: resp.user.roles,
          role: resp.user.role || resp.user.roles,
          avatar: resp.user.avatar,
          token: resp.token
        });

        // Update state
        setUser(userData);
        setToken(resp.token);
        return true;
      } else {
        setError(resp.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeUserCookie();
    setUser(null);
    setToken(null);
    setError(null);
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';

  const canEditPost = (postAuthorId: string) => {
    if (!user) return false;
    return user.role === 'admin' || user.id === postAuthorId;
  };

  const canDeletePost = (postAuthorId: string) => {
    if (!user) return false;
    return user.role === 'admin' || user.id === postAuthorId;
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    isAdmin,
    canEditPost,
    canDeletePost,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
