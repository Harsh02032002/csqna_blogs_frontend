import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: t, user: u } = res.data;
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
      setToken(t);
      setUser(u);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (data) => {
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, isAdmin: user?.role === 'admin', isEditor: ['admin', 'editor'].includes(user?.role) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
