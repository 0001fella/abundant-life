import api from './api';

const MEMBERS_URL = '/members';

export const getMembers = async () => {
  try {
    const response = await api.get(MEMBERS_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch members';
  }
};

export const createMember = async (memberData) => {
  try {
    const response = await api.post(MEMBERS_URL, memberData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create member';
  }
};

export const updateMember = async (id, memberData) => {
  try {
    const response = await api.put(`${MEMBERS_URL}/${id}`, memberData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update member';
  }
};

export const deleteMember = async (id) => {
  try {
    const response = await api.delete(`${MEMBERS_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete member';
  }
};
