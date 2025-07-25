import api from './api';

const API_URL = '/devotionals';

// GET all devotionals
export const getDevotionals = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    const message = error?.response?.data?.error || error.message || 'Failed to fetch devotionals';
    throw new Error(message);
  }
};

// CREATE a new devotional
export const createDevotional = async (devotionalData) => {
  try {
    const payload = {
      ...devotionalData,
      date: new Date(devotionalData.date).toISOString(),
    };

    const response = await api.post(API_URL, payload);
    return response.data;
  } catch (error) {
    console.error("createDevotional error:", error.response?.data || error.message);
    const message = error?.response?.data?.error || error.message || 'Failed to create devotional';
    throw new Error(message);
  }
};

// UPDATE a devotional
export const updateDevotional = async (id, devotionalData) => {
  try {
    const payload = {
      ...devotionalData,
      date: new Date(devotionalData.date).toISOString(),
    };

    const response = await api.put(`${API_URL}/${id}`, payload);
    return response.data;
  } catch (error) {
    const message = error?.response?.data?.error || error.message || 'Failed to update devotional';
    throw new Error(message);
  }
};

// DELETE a devotional
export const deleteDevotional = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    const message = error?.response?.data?.error || error.message || 'Failed to delete devotional';
    throw new Error(message);
  }
};
