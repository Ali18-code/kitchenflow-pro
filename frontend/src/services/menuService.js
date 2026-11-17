import apiClient from './apiClient';

export const menuService = {
  async getCategories() {
    const res = await apiClient.get('/menu/categories');
    return res.data;
  },

  async getItems(params = {}) {
    const res = await apiClient.get('/menu/items', { params });
    return res.data;
  },

  async getItemById(id) {
    const res = await apiClient.get(`/menu/items/${id}`);
    return res.data;
  },
};
