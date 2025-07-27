import axios from 'axios';

// 🌐 Determine base URL based on environment
// Ensure VITE_API_URL is used as the primary source for the API base URL
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api` // Ensure '/api' is appended if your backend expects it
  : (import.meta.env.PROD
    ? 'https://abundant-life.onrender.com/api' // Fallback for production if VITE_API_URL is missing (adjust domain if needed)
    : 'http://localhost:5000/api'); // Dev: target local backend directly

// 🚀 Create Axios instance
const api = axios.create({
  baseURL, // This baseURL will be prepended to all requests made with this instance
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials (cookies) with requests if your auth uses them
});

// 🔐 Request Interceptor: Attach Bearer token and log requests in dev
api.interceptors.request.use(
  (config) => {
    // Optional: Check for token in Authorization header or fallback to localStorage
    // const token = config.headers.Authorization?.split(' ')[1] || localStorage.getItem('token');
    const token = localStorage.getItem('token'); // Standard approach

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      const method = config.method?.toUpperCase();
      // Construct full URL for logging, considering baseURL might be relative
      const fullUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
      console.debug(`[API Request] ${method} ${fullUrl}`, {
        params: config.params,
        data: config.data,
        headers: config.headers, // Log headers for debugging
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

// 🔁 Response Interceptor: Log responses in dev, handle auth errors globally
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      const method = response.config.method?.toUpperCase();
      // Construct full URL for logging
      const fullUrl = response.config.baseURL ? `${response.config.baseURL}${response.config.url}` : response.config.url;
      console.debug(`[API Response] ${method} ${fullUrl}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    // Use the full URL from the config for better error context
    const url = error.config?.baseURL && error.config?.url
      ? `${error.config.baseURL}${error.config.url}`
      : (error.config?.url || 'Unknown URL');

    // 🌍 Fallback error message
    const serverMessage = error.response?.data?.message || error.response?.data?.error; // Check common error fields
    const fallbackMessage = error.message || 'An unexpected error occurred';
    // Ensure error.message is set for upstream handlers
    error.message = serverMessage || fallbackMessage;

    // Handle common auth errors globally
    if ([401, 403].includes(status)) {
      console.warn(`[API Auth Error] ${status} on ${url}. Token might be invalid or missing.`);
      // Clear local token
      localStorage.removeItem('token');
      // Clear any other user-related data from storage if necessary
      // e.g., localStorage.removeItem('user');

      // Check if already on login page to prevent redirect loop
      const isLoginPage = window.location.pathname.includes('/login');
      if (!isLoginPage) {
         console.log('[API Interceptor] Redirecting to /login due to auth error.');
         // Use navigate if within a React component context, otherwise direct assignment is okay for full redirect
         // For a general service like this, direct assignment is standard
         // Include redirect back to the original page if needed
         const redirectTo = encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
         window.location.replace(`/login?redirect=${redirectTo}`);
      }
    }

    if (import.meta.env.DEV) {
      console.error(`[API Error] ${status || '???'} on ${url}:`, error.message, error.response?.data); // Log more details in dev
    }

    return Promise.reject(error); // Re-throw the error for specific service handlers
  }
);

export default api;