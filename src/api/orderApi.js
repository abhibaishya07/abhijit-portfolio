import api from './axiosClient';

export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrderStatus = (id, data) => api.patch(`/orders/${id}/status`, data);
export const getMyOrders = () => api.get('/orders/my-orders');
