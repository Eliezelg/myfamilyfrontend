import api from './api';

export const uploadPhoto = async (familyId, photoFile, title, description) => {
  try {
    const formData = new FormData();
    formData.append('photo', photoFile);
    formData.append('title', title || '');
    formData.append('description', description || '');

    const response = await api.post(`/photos/${familyId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erreur uploadPhoto:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Erreur lors de l\'upload de la photo');
  }
};

export const getFamilyPhotos = async (familyId) => {
  try {
    const response = await api.get(`/photos/${familyId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur getFamilyPhotos:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des photos');
  }
};

export const deletePhoto = async (photoId) => {
  try {
    const response = await api.delete(`/photos/${photoId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur deletePhoto:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de la photo');
  }
};
