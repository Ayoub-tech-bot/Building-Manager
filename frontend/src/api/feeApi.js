import api from './client';

export const feeApi = {
  // Fetch all fees (sorted by period desc)
  getAll: async () => {
    const response = await api.get('/fees');
    return response.data;
  },

  // Fetch single fee by ID
  getById: async (id) => {
    const response = await api.get(`/fees/${id}`);
    return response.data;
  },

  // Fetch fees for a specific apartment
  getByApartment: async (apartmentId) => {
    const response = await api.get(`/fees/apartment/${apartmentId}`);
    return response.data;
  },

  // Filter fees by status ('PAID', 'UNPAID', 'IN_PROGRESS', 'CANCELLED')
  getByStatus: async (status) => {
    const response = await api.get(`/fees/status/${status}`);
    return response.data;
  },

  // Filter fees by status and type
  filter: async (status, type) => {
    const response = await api.get('/fees/filter', {
      params: { status, type },
    });
    return response.data;
  },

  // Create a new fee
  // Payload: { period: "YYYY-MM", amount: number, type: string, dueDate: "YYYY-MM-DD", status: string, apartmentId: number }
  create: async (data) => {
    const response = await api.post('/fees', data);
    return response.data;
  },

  // Update a fee
  update: async (id, data) => {
    const response = await api.put(`/fees/${id}`, data);
    return response.data;
  },

  // Delete a fee
  delete: async (id) => {
    const response = await api.delete(`/fees/${id}`);
    return response.data;
  },
};

export default feeApi;

