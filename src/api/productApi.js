import api from './axiosClient';

export const getProducts = (params) => api.get('/products', { params });
export const getFeaturedProducts = () => api.get('/products?featured=true');
export const getProductBySlug = (slug) => api.get(`/products/${slug}`);
export const getAllProductsAdmin = () => api.get('/products/admin/all');
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Reviews
export const getProductReviews = (productId) => api.get(`/products/${productId}/reviews`);
export const submitReview = (productId, data) => api.post(`/products/${productId}/reviews`, data);
