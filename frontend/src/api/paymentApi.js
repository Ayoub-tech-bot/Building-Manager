import api from './client';

export const paymentApi = {
  // Fetch all recorded payments
  getAll: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  // Fetch single payment by ID
  getById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // Fetch payments made for a specific fee
  getByFee: async (feeId) => {
    const response = await api.get(`/payments/fee/${feeId}`);
    return response.data;
  },

  // Fetch payments for an apartment
  getByApartment: async (apartmentId) => {
    const response = await api.get(`/payments/apartment/${apartmentId}`);
    return response.data;
  },

  // Get financial balance calculation for a fee
  getBalance: async (feeId) => {
    const response = await api.get(`/payments/fee/${feeId}/balance`);
    return response.data;
  },

  // Record a payment
  // Payload: { amount: number, paymentMethod: string, feeId: number, apartmentId?: number, paymentDate?: string }
  create: async (data) => {
    const response = await api.post('/payments', data);
    return response.data;
  },

  // Update payment
  update: async (id, data) => {
    const response = await api.put(`/payments/${id}`, data);
    return response.data;
  },

  // Delete payment
  delete: async (id) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },
};

export default paymentApi;

