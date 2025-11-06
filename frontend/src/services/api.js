import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Appointments API
export const appointmentsAPI = {
  getAll: (params = {}) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
};

// Slots API
export const slotsAPI = {
  getAll: (params = {}) => api.get('/slots', { params }),
  create: (data) => api.post('/slots', data),
  createBulk: (data) => api.post('/slots/bulk', data),
  delete: (id) => api.delete(`/slots/${id}`),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;

