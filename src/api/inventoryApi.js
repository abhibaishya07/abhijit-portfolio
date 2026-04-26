import api from './axiosClient';

export const getInventory = () => api.get('/inventory');
export const updateStock = (id, data) => api.patch(`/inventory/${id}/stock`, data);
