import api from './api';

// ⚠️ Do NOT start with a slash since baseURL already ends with one
// Ensure your `api.js` instance uses `import.meta.env.VITE_API_URL` as its baseURL
const DEVOTIONALS_ENDPOINT = 'devotionals';

// Helper function to construct full URL for logging using the environment variable
const getFullUrlForLogging = (endpoint) => {
  // Access the base URL used by the api instance
  const instanceBaseUrl = api.defaults.baseURL || '';
  // Prefer the environment variable for logging, fallback to instance base URL
  const baseUrlForLogging = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : instanceBaseUrl;
  return `${baseUrlForLogging}/${endpoint}`;
};

// GET all devotionals
export const getDevotionals = async () => {
  try {
    console.log(`[DevotionalsService] Attempting to fetch devotionals from ${getFullUrlForLogging(DEVOTIONALS_ENDPOINT)}`);
    const response = await api.get(DEVOTIONALS_ENDPOINT);
    console.log(`[DevotionalsService] Successfully fetched devotionals`);
    return response.data;
  } catch (error) {
    console.error(`[DevotionalsService] Error fetching devotionals from ${getFullUrlForLogging(DEVOTIONALS_ENDPOINT)}:`, error);
    const message = error?.response?.data?.error || error.message || 'Failed to fetch devotionals';
    throw new Error(message);
  }
};

// CREATE a new devotional
export const createDevotional = async (devotionalData) => {
  try {
    console.log(`[DevotionalsService] Attempting to create devotional at ${getFullUrlForLogging(DEVOTIONALS_ENDPOINT)}`);
    const payload = {
      ...devotionalData,
      date: new Date(devotionalData.date).toISOString(),
    };

    const response = await api.post(DEVOTIONALS_ENDPOINT, payload);
    console.log(`[DevotionalsService] Successfully created devotional with ID: ${response.data._id}`);
    return response.data;
  } catch (error) {
    console.error(`[DevotionalsService] Error creating devotional at ${getFullUrlForLogging(DEVOTIONALS_ENDPOINT)}:`, error.response?.data || error.message, error);
    const message = error?.response?.data?.error || error.message || 'Failed to create devotional';
    throw new Error(message);
  }
};

// UPDATE a devotional
export const updateDevotional = async (id, devotionalData) => {
  try {
    console.log(`[DevotionalsService] Attempting to update devotional ID: ${id} at ${getFullUrlForLogging(`${DEVOTIONALS_ENDPOINT}/${id}`)}`);
    const payload = {
      ...devotionalData,
      date: new Date(devotionalData.date).toISOString(),
    };

    const response = await api.put(`${DEVOTIONALS_ENDPOINT}/${id}`, payload);
    console.log(`[DevotionalsService] Successfully updated devotional ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error(`[DevotionalsService] Error updating devotional ID: ${id} at ${getFullUrlForLogging(`${DEVOTIONALS_ENDPOINT}/${id}`)}:`, error);
    const message = error?.response?.data?.error || error.message || 'Failed to update devotional';
    throw new Error(message);
  }
};

// DELETE a devotional
export const deleteDevotional = async (id) => {
  try {
    console.log(`[DevotionalsService] Attempting to delete devotional ID: ${id} at ${getFullUrlForLogging(`${DEVOTIONALS_ENDPOINT}/${id}`)}`);
    const response = await api.delete(`${DEVOTIONALS_ENDPOINT}/${id}`);
    console.log(`[DevotionalsService] Successfully deleted devotional ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error(`[DevotionalsService] Error deleting devotional ID: ${id} at ${getFullUrlForLogging(`${DEVOTIONALS_ENDPOINT}/${id}`)}:`, error);
    const message = error?.response?.data?.error || error.message || 'Failed to delete devotional';
    throw new Error(message);
  }
};