import api from './api';

// ⚠️ Do NOT start with a slash since baseURL already ends with one
// Ensure your `api.js` instance uses `import.meta.env.VITE_API_URL` as its baseURL
const EVENTS_ENDPOINT = 'events';

export const getEvents = async () => {
  try {
    const response = await api.get(EVENTS_ENDPOINT);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch events';
    throw new Error(errorMessage);
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await api.post(EVENTS_ENDPOINT, eventData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to create event';
    throw new Error(errorMessage);
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`${EVENTS_ENDPOINT}/${id}`, eventData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update event';
    throw new Error(errorMessage);
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`${EVENTS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to delete event';
    throw new Error(errorMessage);
  }
};