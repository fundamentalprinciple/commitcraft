import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Global response error handler – surfaces error messages cleanly
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.error ?? err.message;
      return Promise.reject(new Error(message));
    }
    return Promise.reject(err);
  },
);

export default api;
