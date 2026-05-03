import axios from 'axios';
import { useAuthStore } from './store/authStore';

// For Android emulator, use 10.0.2.2 instead of localhost
// Alternatively, replace with your local IP when testing on a physical device
const API_BASE_URL = 'http://192.168.40.53:3000'; // Hardcoded for local testing

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
