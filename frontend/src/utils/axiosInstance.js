// utils/axiosInstance.js
import axios from 'axios';

// Dynamically choose baseURL for mobile and dev environments
const getBaseURL = () => {
  // Prefer environment variable
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

  // Fallback: detect if running on mobile browser + localhost server
  const isLocalhost = window.location.hostname === 'localhost';
  if (isLocalhost) {
    return 'http://localhost:5000/api';
  }

  // If running on LAN/mobile without proper .env, fallback to IP (update this with your local IP if needed)
  return 'http://192.168.0.100:5000/api'; // ✅ Replace with your actual LAN IP
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

// Logging for debugging
console.log('[Axios Config] Base URL:', axiosInstance.defaults.baseURL);

// Response interceptor to handle 401 errors and unexpected data
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.debug('[Axios Response]', response);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Session expired - redirecting to login');
      // You can use react-router here if preferred
      window.location.href = '/login';
    } else if (error.response?.status === 404) {
      console.error('❌ API route not found:', error.config.url);
    } else if (error.response?.status >= 500) {
      console.error('🚨 Server error:', error.response.data || error.message);
    } else {
      console.error('❗ API error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
