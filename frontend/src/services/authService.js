import api from './api';

// Helper function to construct full URL for logging using the environment variable
const getFullUrlForLogging = (endpoint) => {
  // Access the base URL used by the api instance
  const instanceBaseUrl = api.defaults.baseURL || '';
  // Prefer the environment variable for logging, fallback to instance base URL
  const baseUrlForLogging = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : instanceBaseUrl;
  // Ensure endpoint starts with '/' for correct concatenation
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrlForLogging}${formattedEndpoint}`;
};

export const login = async (credentials) => {
  try {
    console.log(`[AuthService] Attempting login at ${getFullUrlForLogging('/auth/login')}`);
    const res = await api.post('/auth/login', credentials);
    console.log(`[AuthService] Login successful`);
    return res.data;
  } catch (error) {
    console.error(`[AuthService] Login error at ${getFullUrlForLogging('/auth/login')}:`, error);
    const errorMessage = error.response?.data?.message || 'Invalid email or password';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};

export const register = async (userData) => {
  try {
    console.log(`[AuthService] Attempting registration at ${getFullUrlForLogging('/auth/register')}`);
    const res = await api.post('/auth/register', userData);
    console.log(`[AuthService] Registration successful`);
    return res.data;
  } catch (error) {
    console.error(`[AuthService] Registration error at ${getFullUrlForLogging('/auth/register')}:`, error);
    const errorMessage = error.response?.data?.message || 'Registration failed';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};

export const logout = async () => {
  try {
    console.log(`[AuthService] Attempting logout at ${getFullUrlForLogging('/auth/logout')}`);
    const res = await api.post('/auth/logout');
    console.log(`[AuthService] Logout successful`);
    return res.data;
  } catch (error) {
    console.error(`[AuthService] Logout error at ${getFullUrlForLogging('/auth/logout')}:`, error);
    const errorMessage = error.response?.data?.message || 'Logout failed';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};

export const getProfile = async () => {
  try {
    console.log(`[AuthService] Attempting to fetch profile at ${getFullUrlForLogging('/auth/profile')}`);
    const res = await api.get('/auth/profile');
    console.log(`[AuthService] Profile fetched successfully`);
    return res.data;
  } catch (error) {
    console.error(`[AuthService] Profile fetch error at ${getFullUrlForLogging('/auth/profile')}:`, error);
    const errorMessage = error.response?.data?.message || 'Unauthorized';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};

// ✅ NEW FUNCTION: getLoginStats
export const getLoginStats = async () => {
  try {
    console.log(`[AuthService] Attempting to fetch login stats at ${getFullUrlForLogging('/auth/login-stats')}`);
    const res = await api.get('/auth/login-stats'); // <-- adjust endpoint if needed
    console.log(`[AuthService] Login stats fetched successfully`);
    return res.data;
  } catch (error) {
    console.error(`[AuthService] Login stats fetch error at ${getFullUrlForLogging('/auth/login-stats')}:`, error);
    const errorMessage = error.response?.data?.message || 'Failed to fetch login stats';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};

// ✅ NEW FUNCTION: getLoginHistory (Assuming this function exists based on AdminDashboard.jsx)
export const getLoginHistory = async () => {
    try {
        console.log(`[AuthService] Attempting to fetch login history at ${getFullUrlForLogging('/auth/login-history')}`);
        const res = await api.get('/auth/login-history'); // Adjust endpoint if needed
        console.log(`[AuthService] Login history fetched successfully`);
        return res.data;
    } catch (error) {
        console.error(`[AuthService] Login history fetch error at ${getFullUrlForLogging('/auth/login-history')}:`, error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch login history';
        throw new Error(errorMessage); // Throw Error object for consistency
    }
};