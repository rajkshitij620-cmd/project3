import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('snip_token');
      if (!token) { setLoading(false); return; }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) setUser(res.data.data);
      } catch {
        localStorage.removeItem('snip_token');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('snip_token', res.data.token);
      setUser(res.data.data);
      return res.data;
    }
    throw new Error(res.data.message);
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    if (res.data.success) {
      localStorage.setItem('snip_token', res.data.token);
      setUser(res.data.data);
      return res.data;
    }
    throw new Error(res.data.message);
  };

  const logout = () => {
    localStorage.removeItem('snip_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
