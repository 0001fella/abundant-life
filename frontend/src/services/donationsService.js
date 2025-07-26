import api from './api';

// ⚠️ Do NOT start with a slash since baseURL already ends with one
// Ensure your `api.js` instance uses `import.meta.env.VITE_API_URL` as its baseURL
const DONATIONS_ENDPOINT = 'donations';

// Helper function to construct full URL for logging using the environment variable
const getFullUrlForLogging = (endpoint) => {
  // Access the base URL used by the api instance
  const instanceBaseUrl = api.defaults.baseURL || '';
  // Prefer the environment variable for logging, fallback to instance base URL
  const baseUrlForLogging = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : instanceBaseUrl;
  return `${baseUrlForLogging}/${endpoint}`;
};

export const getDonations = async () => {
  try {
    console.log(`[DonationsService] Attempting to fetch donations from ${getFullUrlForLogging(DONATIONS_ENDPOINT)}`);
    const response = await api.get(DONATIONS_ENDPOINT);
    console.log(`[DonationsService] Successfully fetched donations`);
    return response.data;
  } catch (error) {
    console.error(`[DonationsService] Error fetching donations from ${getFullUrlForLogging(DONATIONS_ENDPOINT)}:`, error);
    const errorMessage = error.response?.data?.message || 'Failed to fetch donations';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};

export const createDonation = async (donationData) => {
  try {
    console.log(`[DonationsService] Attempting to create donation at ${getFullUrlForLogging(DONATIONS_ENDPOINT)}`);
    const response = await api.post(DONATIONS_ENDPOINT, donationData);
    console.log(`[DonationsService] Successfully created donation with ID: ${response.data._id}`);
    return response.data;
  } catch (error) {
    console.error(`[DonationsService] Error creating donation at ${getFullUrlForLogging(DONATIONS_ENDPOINT)}:`, error);
    const errorMessage = error.response?.data?.message || 'Failed to create donation';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};

export const updateDonation = async (id, donationData) => {
  try {
    console.log(`[DonationsService] Attempting to update donation ID: ${id} at ${getFullUrlForLogging(`${DONATIONS_ENDPOINT}/${id}`)}`);
    const response = await api.put(`${DONATIONS_ENDPOINT}/${id}`, donationData);
    console.log(`[DonationsService] Successfully updated donation ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error(`[DonationsService] Error updating donation ID: ${id} at ${getFullUrlForLogging(`${DONATIONS_ENDPOINT}/${id}`)}:`, error);
    const errorMessage = error.response?.data?.message || 'Failed to update donation';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};

export const deleteDonation = async (id) => {
  try {
    console.log(`[DonationsService] Attempting to delete donation ID: ${id} at ${getFullUrlForLogging(`${DONATIONS_ENDPOINT}/${id}`)}`);
    const response = await api.delete(`${DONATIONS_ENDPOINT}/${id}`);
    console.log(`[DonationsService] Successfully deleted donation ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error(`[DonationsService] Error deleting donation ID: ${id} at ${getFullUrlForLogging(`${DONATIONS_ENDPOINT}/${id}`)}:`, error);
    const errorMessage = error.response?.data?.message || 'Failed to delete donation';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};