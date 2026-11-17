import apiClient from './apiClient';

export const ordersService = {
  async createOrder(orderData) {
    const res = await apiClient.post('/orders', orderData);
    return res.data;
  },

  async getOrders(params = {}) {
    const res = await apiClient.get('/orders', { params });
    return res.data;
  },

  async getOrderById(id) {
    const res = await apiClient.get(`/orders/${id}`);
    return res.data;
  },

  async cancelOrder(id) {
    const res = await apiClient.post(`/orders/${id}/cancel`);
    return res.data;
  },
};
