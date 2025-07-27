import axios from 'axios';

// ✅ Determine base URL from environment
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ✅ Create Axios instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for cookie/session-based auth
});

// 🔐 Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      const method = config.method?.toUpperCase();
      const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
      console.debug(`[API Request] ${method} ${fullUrl}`, {
        params: config.params,
        data: config.data,
        headers: config.headers,
        tokenAttached: !!token,
      });
    }

    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// 🔁 Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      const method = response.config.method?.toUpperCase();
      const fullUrl = `${response.config.baseURL || ''}${response.config.url || ''}`;
      console.debug(`[API Response] ${method} ${fullUrl}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const config = error.config || {};
    const url = `${config.baseURL || ''}${config.url || ''}`;
    const serverMessage = error.response?.data?.message || error.response?.data?.error;
    const fallbackMessage = error.message || 'An unexpected error occurred';

    error.message = serverMessage || fallbackMessage;

    // 🔐 Handle auth errors globally
    if ([401, 403].includes(status)) {
      localStorage.removeItem('token');

      const isLoginPage = window.location.pathname.includes('/login');
      if (!isLoginPage) {
        const redirectTo = encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
        console.warn(`[Auth Redirect] Redirecting to /login from ${url}`);
        window.location.replace(`/login?redirect=${redirectTo}`);
      }
    }

    if (import.meta.env.DEV) {
      console.error(`[API Error] ${status || '???'} on ${url}:`, error.message, error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default api;
