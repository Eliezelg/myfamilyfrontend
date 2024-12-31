import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  FormControlLabel,
  Switch,
  IconButton,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { PhotoCamera, Security } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    preferredLanguage: user?.preferredLanguage || 'fr',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Récupérer le statut 2FA au chargement
  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const response = await api.get('/auth/2fa-status');
        setTwoFactorEnabled(response.data.enabled);
      } catch (err) {
        console.error('Erreur lors de la récupération du statut 2FA:', err);
      }
    };
    fetch2FAStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérification de la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La taille du fichier ne doit pas dépasser 5MB');
      return;
    }

    // Vérification du type de fichier
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/user/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await updateProfile({ profilePicture: response.data.url });
      setSuccess('Photo de profil mise à jour avec succès');
    } catch (err) {
      setError('Erreur lors du téléchargement de la photo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation des champs obligatoires
    if (!profileData.firstName || !profileData.lastName) {
      setError('Le prénom et le nom sont obligatoires');
      setLoading(false);
      return;
    }

    // Validation du mot de passe
    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        setError('Veuillez entrer votre mot de passe actuel');
        setLoading(false);
        return;
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        setError('Les nouveaux mots de passe ne correspondent pas');
        setLoading(false);
        return;
      }
      if (profileData.newPassword.length < 8) {
        setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
        setLoading(false);
        return;
      }
    }

    try {
      await updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        preferredLanguage: profileData.preferredLanguage,
        phoneNumber: profileData.phoneNumber,
        ...(profileData.newPassword && {
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword,
        }),
      });
      setSuccess('Profil mis à jour avec succès');
      
      // Réinitialiser les champs de mot de passe
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateTo2FA = () => {
    navigate('/2fa');
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Mon Profil
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </Box>

        <Grid container spacing={4}>
          {/* Section Photo de profil */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              src={user?.profilePicture}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture-file"
              type="file"
              onChange={handleProfilePictureChange}
            />
            <label htmlFor="profile-picture-file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                disabled={loading}
              >
                Changer la photo
              </Button>
            </label>
          </Grid>

          {/* Section Informations personnelles */}
          <Grid item xs={12} md={8}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prénom"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={profileData.email}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Numéro de téléphone"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+33 6 12 34 56 78"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Langue préférée"
                    name="preferredLanguage"
                    value={profileData.preferredLanguage}
                    onChange={handleChange}
                  >
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="he">עברית</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* Section Sécurité */}
              <Typography variant="h6" gutterBottom>
                Sécurité
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<Security />}
                  onClick={handleNavigateTo2FA}
                  sx={{ mb: 2 }}
                >
                  {twoFactorEnabled ? 'Gérer l\'authentification à 2 facteurs' : 'Activer l\'authentification à 2 facteurs'}
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Mot de passe actuel"
                    name="currentPassword"
                    value={profileData.currentPassword}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Nouveau mot de passe"
                    name="newPassword"
                    value={profileData.newPassword}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirmer le nouveau mot de passe"
                    name="confirmPassword"
                    value={profileData.confirmPassword}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, textAlign: 'right' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Enregistrer les modifications'}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
