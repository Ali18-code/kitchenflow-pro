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
};
