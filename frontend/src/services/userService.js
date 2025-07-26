import api from './api'; // ✅ Uses centralized Axios instance with baseURL & credentials

// Construct the full base URL for logging/debugging purposes using the environment variable
const BASE_URL_FOR_LOGGING = `${import.meta.env.VITE_API_URL || ''}${api.defaults.baseURL || ''}`;
const USERS_URL = '/users'; // Relative to your configured baseURL in api.js
const FULL_USERS_URL_FOR_LOGGING = `${BASE_URL_FOR_LOGGING}${USERS_URL}`; // For consistent logging

export const getUser = async (userId) => {
  try {
    console.log(`[UserService] Attempting to fetch user with ID: ${userId} from ${FULL_USERS_URL_FOR_LOGGING}/${userId}`);
    const response = await api.get(`${USERS_URL}/${userId}`);
    console.log(`[UserService] Successfully fetched user with ID: ${userId}`);
    return response.data;
  } catch (error) {
    console.error(`[UserService] Error fetching user with ID: ${userId} from ${FULL_USERS_URL_FOR_LOGGING}/${userId}`, error);
    const errorMessage = error.response?.data?.message || 'Failed to fetch user';
    throw new Error(errorMessage);
  }
};

export const updateProfile = async (userId, profileData) => {
  try {
    console.log(`[UserService] Attempting to update profile for user ID: ${userId} at ${FULL_USERS_URL_FOR_LOGGING}/${userId}`);
    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);

    if (profileData.profileImage) {
      formData.append('profileImage', profileData.profileImage);
    }

    if (profileData.currentPassword && profileData.newPassword) {
      formData.append('currentPassword', profileData.currentPassword);
      formData.append('newPassword', profileData.newPassword);
    }

    const response = await api.put(`${USERS_URL}/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(`[UserService] Successfully updated profile for user ID: ${userId}`);
    return response.data;
  } catch (error) {
    console.error(`[UserService] Error updating profile for user ID: ${userId} at ${FULL_USERS_URL_FOR_LOGGING}/${userId}`, error);
    const errorMessage = error.response?.data?.message || 'Profile update failed';
    throw new Error(errorMessage);
  }
};