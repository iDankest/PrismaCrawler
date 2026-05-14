import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 8000, // Tus 8 segundos de margen
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para el Token (lo que ya tenías en tu fetch)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;