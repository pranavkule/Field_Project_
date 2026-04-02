import apiClient from './apiClient';

const inventoryAPI = {
  // Get all inventory items
  getAll: () => apiClient.get('/inventory'),

  // Add new item
  create: (data) => apiClient.post('/inventory', data),

  // Update item
  update: (id, data) => apiClient.put(`/inventory/${id}`, data),

  // Delete item
  delete: (id) => apiClient.delete(`/inventory/${id}`),
};

export default inventoryAPI;
