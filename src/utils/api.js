import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5010/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — but NOT for the login endpoint itself
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginCall = err.config?.url?.includes('/auth/login');
    if (err.response?.status === 401 && !isLoginCall) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;
