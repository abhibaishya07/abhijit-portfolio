import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lb_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem('lb_token', data.token);
      localStorage.setItem('lb_user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } finally { setLoading(false); }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      // Registration now only sends OTP, it doesn't log them in.
      const { data } = await authApi.register({ name, email, password, phone });
      return data;
    } finally { setLoading(false); }
  };

  const verifyRegistration = async (email, otp) => {
    setLoading(true);
    try {
      const { data } = await authApi.verifyEmail({ email, otp });
      localStorage.setItem('lb_token', data.token);
      localStorage.setItem('lb_user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('lb_token');
    localStorage.removeItem('lb_user');
    setUser(null);
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('auth_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth_unauthorized', handleUnauthorized);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyRegistration, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
