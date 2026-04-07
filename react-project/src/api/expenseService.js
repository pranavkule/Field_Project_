import apiClient from './apiClient';

const expenseAPI = {
  // Get all expenses
  getAll: () => apiClient.get('/expenses'),

  // Get expense summary
  getSummary: () => apiClient.get('/expenses/summary'),

  // Add new expense
  create: (data) => apiClient.post('/expenses', data),

  // Update expense
  update: (id, data) => apiClient.put(`/expenses/${id}`, data),

  // Delete expense
  delete: (id) => apiClient.delete(`/expenses/${id}`),
};

export default expenseAPI;
