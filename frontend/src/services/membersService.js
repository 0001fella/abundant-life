import api from './api';

// ⚠️ Do NOT start with a slash since baseURL already ends with one
// Ensure your `api.js` instance uses `import.meta.env.VITE_API_URL` as its baseURL
const MEMBERS_ENDPOINT = 'members';

// Helper function to construct full URL for logging using the environment variable
const getFullUrlForLogging = (endpoint) => {
  // Access the base URL used by the api instance
  const instanceBaseUrl = api.defaults.baseURL || '';
  // Prefer the environment variable for logging, fallback to instance base URL
  const baseUrlForLogging = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : instanceBaseUrl;
  return `${baseUrlForLogging}/${endpoint}`;
};

export const getMembers = async () => {
  try {
    console.log(`[MembersService] Attempting to fetch members from ${getFullUrlForLogging(MEMBERS_ENDPOINT)}`);
    const response = await api.get(MEMBERS_ENDPOINT);
    console.log(`[MembersService] Successfully fetched members`);
    return response.data;
  } catch (error) {
    console.error(`[MembersService] Error fetching members from ${getFullUrlForLogging(MEMBERS_ENDPOINT)}:`, error);
    const errorMessage = error.response?.data?.message || 'Failed to fetch members';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};

export const createMember = async (memberData) => {
  try {
    console.log(`[MembersService] Attempting to create member at ${getFullUrlForLogging(MEMBERS_ENDPOINT)}`);
    const response = await api.post(MEMBERS_ENDPOINT, memberData);
    console.log(`[MembersService] Successfully created member with ID: ${response.data._id}`);
    return response.data;
  } catch (error) {
    console.error(`[MembersService] Error creating member at ${getFullUrlForLogging(MEMBERS_ENDPOINT)}:`, error);
    const errorMessage = error.response?.data?.message || 'Failed to create member';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};

export const updateMember = async (id, memberData) => {
  try {
    console.log(`[MembersService] Attempting to update member ID: ${id} at ${getFullUrlForLogging(`${MEMBERS_ENDPOINT}/${id}`)}`);
    const response = await api.put(`${MEMBERS_ENDPOINT}/${id}`, memberData);
    console.log(`[MembersService] Successfully updated member ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error(`[MembersService] Error updating member ID: ${id} at ${getFullUrlForLogging(`${MEMBERS_ENDPOINT}/${id}`)}:`, error);
    const errorMessage = error.response?.data?.message || 'Failed to update member';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};

export const deleteMember = async (id) => {
  try {
    console.log(`[MembersService] Attempting to delete member ID: ${id} at ${getFullUrlForLogging(`${MEMBERS_ENDPOINT}/${id}`)}`);
    const response = await api.delete(`${MEMBERS_ENDPOINT}/${id}`);
    console.log(`[MembersService] Successfully deleted member ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error(`[MembersService] Error deleting member ID: ${id} at ${getFullUrlForLogging(`${MEMBERS_ENDPOINT}/${id}`)}:`, error);
    const errorMessage = error.response?.data?.message || 'Failed to delete member';
    throw new Error(errorMessage); // Throw Error object for consistency
  }
};