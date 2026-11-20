import apiClient from './apiClient';

export const authService = {
  async login(email, password) {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  async getProfile() {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  async getUsers() {
    const res = await apiClient.get('/users');
    return res.data;
  },

  async createUser(data) {
    const res = await apiClient.post('/users', data);
    return res.data;
  },

  async updateUser(id, data) {
    const res = await apiClient.patch(`/users/${id}`, data);
    return res.data;
  },
};
