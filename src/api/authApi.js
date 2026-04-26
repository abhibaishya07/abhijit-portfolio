import api from './axiosClient';

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const adminLogin = (data) => api.post('/auth/admin-login', data);
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);
export const forgotPassword = (data) => api.post('/auth/forgotpassword', data);
export const resetPassword = (token, data) => api.put(`/auth/resetpassword/${token}`, data);
export const verifyEmail = (data) => api.post('/auth/verify-email', data);
export const resendOtp = (data) => api.post('/auth/resend-otp', data);
