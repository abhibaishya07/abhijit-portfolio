import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lb_token');
      localStorage.removeItem('lb_user');
      localStorage.removeItem('lb_admin');
      window.dispatchEvent(new Event('auth_unauthorized'));
    }
    return Promise.reject(err);
  }
);

export default api;
