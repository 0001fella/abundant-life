import api from './api';

// ⚠️ Do NOT start with a slash since baseURL already ends with one
const RESOURCES_ENDPOINT = 'resources';

export const getResources = async () => {
  try {
    const response = await api.get(RESOURCES_ENDPOINT);
    return response.data;
  } catch (error) {
    const errorMessage = error.message || 'Failed to fetch resources';
    console.error(
      'getResources error:',
      errorMessage,
      '\nFull URL:',
      api.defaults.baseURL + RESOURCES_ENDPOINT
    );
    throw new Error(errorMessage);
  }
};

export const uploadResource = async (formData) => {
  try {
    const response = await api.post(RESOURCES_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    let errorMessage = 'Failed to upload resource';

    if (error.response) {
      errorMessage = error.response.data?.message ||
        `Server responded with ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'No response received from server';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out';
    }

    console.error(
      'uploadResource error:',
      errorMessage,
      '\nFull URL:',
      api.defaults.baseURL + RESOURCES_ENDPOINT
    );
    throw new Error(errorMessage);
  }
};

export const updateResource = async (id, resourceData) => {
  try {
    const response = await api.put(`${RESOURCES_ENDPOINT}/${id}`, resourceData, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    let errorMessage = 'Failed to update resource';

    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = 'Resource not found';
      } else {
        errorMessage = error.response.data?.message ||
          `Server responded with ${error.response.status}`;
      }
    }

    console.error(
      'updateResource error:',
      errorMessage,
      '\nFull URL:',
      `${api.defaults.baseURL}${RESOURCES_ENDPOINT}/${id}`
    );
    throw new Error(errorMessage);
  }
};

export const deleteResource = async (id) => {
  try {
    const response = await api.delete(`${RESOURCES_ENDPOINT}/${id}`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    let errorMessage = 'Failed to delete resource';

    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = 'Resource not found';
      } else {
        errorMessage = error.response.data?.message ||
          `Server responded with ${error.response.status}`;
      }
    }

    console.error(
      'deleteResource error:',
      errorMessage,
      '\nFull URL:',
      `${api.defaults.baseURL}${RESOURCES_ENDPOINT}/${id}`
    );
    throw new Error(errorMessage);
  }
};
