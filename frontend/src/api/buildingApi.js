import client from './client';

const BASE = '/buildings';

const buildingApi = {
  /** GET /buildings — all buildings */
  getAll: () => client.get(BASE).then(r => r.data),

  /** GET /buildings/{id} */
  getById: (id) => client.get(`${BASE}/${id}`).then(r => r.data),

  /** GET /buildings/residence/{residenceId} */
  getByResidence: (residenceId) =>
    client.get(`${BASE}/residence/${residenceId}`).then(r => r.data),

  /** POST /buildings */
  create: (data) => client.post(BASE, data).then(r => r.data),

  /** PUT /buildings/{id} */
  update: (id, data) => client.put(`${BASE}/${id}`, data).then(r => r.data),

  /** DELETE /buildings/{id} */
  delete: (id) => client.delete(`${BASE}/${id}`),
};

export default buildingApi;

