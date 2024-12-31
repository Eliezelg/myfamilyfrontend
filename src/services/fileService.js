import axios from 'axios';

const API_URL = '/api/files';

// Configuration Axios avec le token
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  };
};

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/upload`, formData, getAuthConfig());
    return response.data.url;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de l\'upload du fichier');
  }
};

export const deleteFile = async (fileUrl) => {
  try {
    const response = await axios.delete(`${API_URL}`, {
      ...getAuthConfig(),
      data: { fileUrl }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du fichier');
  }
};
