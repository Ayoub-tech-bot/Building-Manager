import api from './client';

export const userApi = {
  // Fetch all users
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Fetch users by role ('Owner', 'Syndic', 'Employee', 'Admin')
  getByRole: async (role) => {
    const response = await api.get(`/users/role/${role}`);
    return response.data;
  },

  // Fetch single user by UUID
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create user
  create: async (data) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  // Update user
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // Delete user
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default userApi;

