import apiClient from './apiClient';

const attendanceAPI = {
  getAll: () => apiClient.get('/attendance'),
  getByStaff: (staffId) => apiClient.get(`/attendance/${staffId}`),
  create: (data) => apiClient.post('/attendance', data),
};

export default attendanceAPI;