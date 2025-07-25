import api from './api';

const API_URL = '/events';

export const getEvents = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch events';
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await api.post(API_URL, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create event';
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update event';
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete event';
  }
};
