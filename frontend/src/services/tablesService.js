import apiClient from './apiClient';

export const tablesService = {
  async getTables() {
    const res = await apiClient.get('/tables');
    return res.data;
  },

  async createTable(data) {
    const res = await apiClient.post('/tables', data);
    return res.data;
  },

  async updateTable(id, data) {
    const res = await apiClient.patch(`/tables/${id}`, data);
    return res.data;
  },
};
