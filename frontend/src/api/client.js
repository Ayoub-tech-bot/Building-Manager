import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor to format errors nicely
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend returns validation map or custom error
    const message =
      error.response?.data?.error ||
      (error.response?.data && typeof error.response.data === 'object'
        ? Object.values(error.response.data).join(', ')
        : null) ||
      error.message ||
      'Une erreur est survenue';

    return Promise.reject(new Error(message));
  }
);

export default api;

