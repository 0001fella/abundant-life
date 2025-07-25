import api from './api';

const ADMIN_URL = '/admin';

export const updateProfile = async (userId, profileData) => {
  try {
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

    const response = await api.put(`${ADMIN_URL}/profile/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Profile update failed';
  }
};
