import api from './api';

const API_URL = '/api/children';

// Configuration Axios avec le token
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getChildren = async (familyId) => {
  try {
    const response = await api.get(`/families/${familyId}/children`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des enfants');
  }
};

export const getChild = async (familyId, childId) => {
  try {
    const response = await api.get(`/families/${familyId}/children/${childId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de l\'enfant');
  }
};

export const createChild = async (familyId, childData) => {
  try {
    const response = await api.post(`/families/${familyId}/children`, childData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la création de l\'enfant');
  }
};

export const updateChild = async (familyId, childId, childData) => {
  try {
    const response = await api.put(`/families/${familyId}/children/${childId}`, childData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la modification de l\'enfant');
  }
};

export const deleteChild = async (familyId, childId) => {
  try {
    const response = await api.delete(`/families/${familyId}/children/${childId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'enfant');
  }
};
