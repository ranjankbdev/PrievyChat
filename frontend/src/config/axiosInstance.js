import axios from 'axios';
import { API_URL } from './config.js';
import formatApiError from '../utils/formatApiError.js';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(formatApiError(error));
  }
);

export default axiosInstance;
