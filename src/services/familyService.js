import api from './api';

export const getFamilies = async () => {
  try {
    const response = await api.get('/families');
    return response.data;
  } catch (error) {
    console.error('Erreur getFamilies:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des familles');
  }
};

export const getFamily = async (familyId) => {
  try {
    const response = await api.get(`/families/${familyId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur getFamily:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de la famille');
  }
};

// Alias pour getFamily pour plus de clarté dans le code
export const getFamilyDetails = getFamily;

export const createFamily = async (familyData) => {
  try {
    const response = await api.post('/families', familyData);
    return response.data;
  } catch (error) {
    console.error('Erreur createFamily:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Erreur lors de la création de la famille');
  }
};

export const updateFamily = async (familyId, familyData) => {
  try {
    const response = await api.put(`/families/${familyId}`, familyData);
    return response.data;
  } catch (error) {
    console.error('Erreur updateFamily:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Erreur lors de la modification de la famille');
  }
};

export const deleteFamily = async (familyId) => {
  try {
    const response = await api.delete(`/families/${familyId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur deleteFamily:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de la famille');
  }
};

export const getInviteLink = async (familyId) => {
  try {
    console.log('Génération du lien d\'invitation pour la famille:', familyId);
    const response = await api.post(`/invites/invite-link`, { familyId });
    console.log('Réponse du serveur:', response.data);
    if (response.data.status === 'success' && response.data.data) {
      return {
        inviteLink: response.data.data.inviteLink
      };
    }
    throw new Error('Format de réponse invalide');
  } catch (error) {
    console.error('Erreur getInviteLink:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Erreur lors de la génération du lien d\'invitation');
  }
};

export const getInviteCode = async (familyId) => {
  try {
    console.log('Génération du code d\'invitation pour la famille:', familyId);
    const response = await api.post(`/invites/invite-code`, { familyId });
    console.log('Réponse du serveur:', response.data);
    if (response.data.status === 'success' && response.data.data) {
      return {
        inviteCode: response.data.data.inviteCode
      };
    }
    throw new Error('Format de réponse invalide');
  } catch (error) {
    console.error('Erreur getInviteCode:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Erreur lors de la génération du code d\'invitation');
  }
};

export const joinFamilyWithToken = async (token) => {
  try {
    console.log('Tentative de rejoindre avec le token:', token);
    const response = await api.post('/invites/join', { token });
    console.log('Réponse du serveur:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur joinFamilyWithToken:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Erreur lors de la tentative de rejoindre la famille');
  }
};

export const joinFamilyWithCode = async (code) => {
  try {
    console.log('Tentative de rejoindre avec le code:', code);
    const response = await api.post('/invites/join', { code });
    console.log('Réponse du serveur:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur joinFamilyWithCode:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Erreur lors de la tentative de rejoindre la famille');
  }
};
