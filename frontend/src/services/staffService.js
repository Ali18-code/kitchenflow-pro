import apiClient from './apiClient';

export const staffService = {
  async getStaff() {
    const res = await apiClient.get('/staff');
    return res.data;
  },

  async createStaff(data) {
    const res = await apiClient.post('/staff', data);
    return res.data;
  },

  async toggleStatus(id, active) {
    const res = await apiClient.patch(`/staff/${id}/status`, { active });
    return res.data;
  },
};
