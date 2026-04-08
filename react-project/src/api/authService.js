import apiClient from './apiClient';

const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getPendingRequests: () => apiClient.get('/auth/registration-requests'),
  approveRequest: (id) => apiClient.post(`/auth/registration-requests/${id}/approve`),
  declineRequest: (id) => apiClient.post(`/auth/registration-requests/${id}/decline`),
  getRequestStatus: (id) => apiClient.get(`/auth/registration-requests/status/${id}`),
};

export default authAPI;
