import api from './api';

// ⚠️ Do NOT start with a slash since baseURL already ends with one
// Ensure your `api.js` instance uses `import.meta.env.VITE_API_URL` as its baseURL
const ADMIN_ENDPOINT = 'admin';

// Helper function to construct full URL for logging using the environment variable
const getFullUrlForLogging = (endpoint) => {
  // Access the base URL used by the api instance
  const instanceBaseUrl = api.defaults.baseURL || '';
  // Prefer the environment variable for logging, fallback to instance base URL
  const baseUrlForLogging = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : instanceBaseUrl;
  return `${baseUrlForLogging}/${endpoint}`;
};

export const updateProfile = async (userId, profileData) => {
  try {
    console.log(`[AdminService] Attempting to update profile for user ID: ${userId} at ${getFullUrlForLogging(`${ADMIN_ENDPOINT}/profile/${userId}`)}`);
    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('phone', profileData.phone);

    if (profileData.profileImage) {
      formData.append('profileImage', profileData.profileImage);
    }

    if (profileData.currentPassword && profileData.newPassword) {
      formData.append('currentPassword', profileData.currentPassword);
      formData.append('newPassword', profileData.newPassword);
    }

    const response = await api.put(`${ADMIN_ENDPOINT}/profile/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log(`[AdminService] Successfully updated profile for user ID: ${userId}`);
    return response.data;
  } catch (error) {
    console.error(`[AdminService] Error updating profile for user ID: ${userId} at ${getFullUrlForLogging(`${ADMIN_ENDPOINT}/profile/${userId}`)}:`, error);
    const errorMessage = error.response?.data?.message || 'Profile update failed';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};