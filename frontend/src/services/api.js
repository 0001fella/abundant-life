import axios from 'axios';

// 🌐 Determine base URL based on environment
const baseURL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL || 'https://your-production-domain.com/api'
  : 'http://localhost:5000/api'; // Dev: target backend directly

// 🚀 Create Axios instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Request Interceptor: Attach Bearer token and log requests in dev
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      const method = config.method?.toUpperCase();
      const fullUrl = `${config.baseURL}${config.url}`;
      console.debug(`[API Request] ${method} ${fullUrl}`, {
        params: config.params,
        data: config.data,
        tokenAttached: !!token,
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Response Interceptor: Log responses in dev, handle auth errors globally
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      const method = response.config.method?.toUpperCase();
      const fullUrl = `${response.config.baseURL}${response.config.url}`;
      console.debug(`[API Response] ${method} ${fullUrl}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || 'Unknown URL';

    // 🌍 Fallback error message
    const serverMessage = error.response?.data?.message;
    const fallbackMessage = error.message || 'An unexpected error occurred';
    error.message = serverMessage || fallbackMessage;

    if ([401, 403].includes(status)) {
      localStorage.removeItem('token');

      const isLoginPage = window.location.pathname.includes('/login');
      if (!isLoginPage) {
        const redirectTo = encodeURIComponent(window.location.pathname);
        window.location.replace(`/login?redirect=${redirectTo}`);
      }
    }

    if (import.meta.env.DEV) {
      console.error(`[API Error] ${status || 'No Status'} on ${url}:`, error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
