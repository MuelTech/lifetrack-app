import axios from 'axios';
import { useAuthStore } from './store/authStore';

// Use EXPO_PUBLIC_API_URL if defined (for production), otherwise fallback to the hardcoded local IP
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.153.53:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().sessionToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
