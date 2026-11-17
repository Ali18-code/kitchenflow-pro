import apiClient from './apiClient';

export const stationsService = {
  async getStations() {
    const res = await apiClient.get('/stations');
    return res.data;
  },

  async updateStation(id, data) {
    const res = await apiClient.patch(`/stations/${id}`, data);
    return res.data;
  },
};
