import api from './api';

const API_URL = '/donations';

export const getDonations = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch donations';
  }
};

export const createDonation = async (donationData) => {
  try {
    const response = await api.post(API_URL, donationData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create donation';
  }
};

export const updateDonation = async (id, donationData) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, donationData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update donation';
  }
};

export const deleteDonation = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete donation';
  }
};
