import api from './client';

export const ownershipApi = {
  // Assign an owner to an apartment
  assign: async ({ ownerId, apartmentId }) => {
    const response = await api.post('/ownerships/assign', { ownerId, apartmentId });
    return response.data;
  },

  // Transfer ownership of an apartment to a new owner
  transfer: async (apartmentId, { newOwnerId, transferDate }) => {
    const response = await api.post(`/ownerships/apartments/${apartmentId}/transfer`, {
      newOwnerId,
      transferDate,
    });
    return response.data;
  },

  // Get current owner for an apartment
  getCurrentOwner: async (apartmentId) => {
    const response = await api.get(`/ownerships/apartments/${apartmentId}/current`);
    return response.data;
  },

  // Get ownership history for an apartment
  getApartmentHistory: async (apartmentId) => {
    const response = await api.get(`/ownerships/apartments/${apartmentId}/history`);
    return response.data;
  },

  // Get all apartments owned by a user
  getByOwner: async (ownerId) => {
    const response = await api.get(`/ownerships/owners/${ownerId}/apartments`);
    return response.data;
  },
};

export default ownershipApi;

