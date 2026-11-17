import api from './client';

export const apartmentApi = {
  // Fetch all apartments
  getAll: async () => {
    const response = await api.get('/apartments');
    return response.data;
  },

  // Fetch single apartment by ID
  getById: async (id) => {
    const response = await api.get(`/apartments/${id}`);
    return response.data;
  },

  // Fetch apartments for a specific residence
  getByResidence: async (residenceId) => {
    const response = await api.get(`/apartments/residence/${residenceId}`);
    return response.data;
  },

  // Fetch apartments for a specific building
  getByBuilding: async (buildingId) => {
    const response = await api.get(`/apartments/building/${buildingId}`);
    return response.data;
  },

  // Create a new apartment
  // Payload: { unitNumber: string, sizeM2: number, residenceId: number }
  create: async (data) => {
    const response = await api.post('/apartments', data);
    return response.data;
  },

  // Update an apartment
  update: async (id, data) => {
    const response = await api.put(`/apartments/${id}`, data);
    return response.data;
  },

  // Delete an apartment
  delete: async (id) => {
    const response = await api.delete(`/apartments/${id}`);
    return response.data;
  },
};

export default apartmentApi;

