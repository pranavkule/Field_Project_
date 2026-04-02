import apiClient from './apiClient';

const healthAPI = {
  // Log health vitals
  logVitals: (data) => apiClient.post('/health', data),

  // Get health records for specific child
  getByChild: (childId) => apiClient.get(`/health/${childId}`),

  // Get all health records
  getAll: () => apiClient.get('/health'),
};

export default healthAPI;
