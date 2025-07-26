import api from './api';

// ⚠️ Do NOT start with a slash since baseURL already ends with one
// Ensure your `api.js` instance uses `import.meta.env.VITE_API_URL` as its baseURL
const EVENTS_ENDPOINT = 'events';

// Helper function to construct full URL for logging using the environment variable
const getFullUrlForLogging = (endpoint) => {
  // Access the base URL used by the api instance
  const instanceBaseUrl = api.defaults.baseURL || '';
  // Prefer the environment variable for logging, fallback to instance base URL
  const baseUrlForLogging = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : instanceBaseUrl;
  return `${baseUrlForLogging}/${endpoint}`;
};

export const getEvents = async () => {
  try {
    console.log(`[EventsService] Attempting to fetch events from ${getFullUrlForLogging(EVENTS_ENDPOINT)}`);
    const response = await api.get(EVENTS_ENDPOINT);
    console.log(`[EventsService] Successfully fetched events`);
    return response.data;
  } catch (error) {
    console.error(`[EventsService] Error fetching events from ${getFullUrlForLogging(EVENTS_ENDPOINT)}:`, error);
    const errorMessage = error.response?.data?.message || 'Failed to fetch events';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};

export const createEvent = async (eventData) => {
  try {
    console.log(`[EventsService] Attempting to create event at ${getFullUrlForLogging(EVENTS_ENDPOINT)}`);
    const response = await api.post(EVENTS_ENDPOINT, eventData);
    console.log(`[EventsService] Successfully created event with ID: ${response.data._id}`);
    return response.data;
  } catch (error) {
    console.error(`[EventsService] Error creating event at ${getFullUrlForLogging(EVENTS_ENDPOINT)}:`, error);
    const errorMessage = error.response?.data?.message || 'Failed to create event';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    console.log(`[EventsService] Attempting to update event ID: ${id} at ${getFullUrlForLogging(`${EVENTS_ENDPOINT}/${id}`)}`);
    const response = await api.put(`${EVENTS_ENDPOINT}/${id}`, eventData);
    console.log(`[EventsService] Successfully updated event ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error(`[EventsService] Error updating event ID: ${id} at ${getFullUrlForLogging(`${EVENTS_ENDPOINT}/${id}`)}:`, error);
    const errorMessage = error.response?.data?.message || 'Failed to update event';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};

export const deleteEvent = async (id) => {
  try {
    console.log(`[EventsService] Attempting to delete event ID: ${id} at ${getFullUrlForLogging(`${EVENTS_ENDPOINT}/${id}`)}`);
    const response = await api.delete(`${EVENTS_ENDPOINT}/${id}`);
    console.log(`[EventsService] Successfully deleted event ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error(`[EventsService] Error deleting event ID: ${id} at ${getFullUrlForLogging(`${EVENTS_ENDPOINT}/${id}`)}:`, error);
    const errorMessage = error.response?.data?.message || 'Failed to delete event';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};