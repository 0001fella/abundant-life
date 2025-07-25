import api from './api';

export const login = async (credentials) => {
  try {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || 'Invalid email or password';
  }
};

export const register = async (userData) => {
  try {
    const res = await api.post('/auth/register', userData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

export const logout = async () => {
  try {
    const res = await api.post('/auth/logout');
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || 'Logout failed';
  }
};

export const getProfile = async () => {
  try {
    const res = await api.get('/auth/profile');
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || 'Unauthorized';
  }
};

// ✅ NEW FUNCTION: getLoginStats
export const getLoginStats = async () => {
  try {
    const res = await api.get('/auth/login-stats'); // <-- adjust endpoint if needed
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch login stats';
  }
};
