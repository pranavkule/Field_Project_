import apiClient from './apiClient';

const childAPI = {
  // Get all children
  getAll: () => apiClient.get('/children'),

  // Get single child by ID
  getById: (id) => apiClient.get(`/children/${id}`),

  // Create new child
  create: (data) => apiClient.post('/children', data),

  // Update child
  update: (id, data) => apiClient.put(`/children/${id}`, data),

  // Delete child (superadmin only)
  delete: (id) => apiClient.delete(`/children/${id}`),
};

export default childAPI;
