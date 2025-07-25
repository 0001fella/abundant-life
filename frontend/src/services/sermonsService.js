import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/sermons'; // change to match your backend URL

// Fetch all sermons
export const getAllSermons = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

// Get a single sermon by ID
export const getSermonById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

// Create a new sermon
export const createSermon = async (sermonData) => {
  const response = await axios.post(API_BASE_URL, sermonData);
  return response.data;
};

// Update a sermon
export const updateSermon = async (id, updatedData) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData);
  return response.data;
};

// Delete a sermon
export const deleteSermon = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
