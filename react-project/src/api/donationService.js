import apiClient from './apiClient';

const donationAPI = {
  getAll: () => apiClient.get('/donations'),
  create: (data) => apiClient.post('/donations', data),
  update: (id, data) => apiClient.put(`/donations/${id}`, data),
  delete: (id) => apiClient.delete(`/donations/${id}`),
};

export default donationAPI;