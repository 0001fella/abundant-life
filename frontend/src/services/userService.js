import api from './api'; // ✅ Uses centralized Axios instance with baseURL & credentials

const USERS_URL = '/users'; // Relative to your configured baseURL in api.js

export const getUser = async (userId) => {
  try {
    const response = await api.get(`${USERS_URL}/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch user';
  }
};

export const updateProfile = async (userId, profileData) => {
  try {
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

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Profile update failed';
  }
};
