import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import api from '../services/api';

const JoinFamily = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [familyDetails, setFamilyDetails] = useState(null);
  const [formData, setFormData] = useState({
    inviteCode: '',
    relationship: '',
    additionalInfo: '',
  });

  // Extraire le code d'invitation de l'URL si présent
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) {
      setFormData(prev => ({ ...prev, inviteCode: code }));
      fetchFamilyDetails(code);
    }
  }, [location]);

  const fetchFamilyDetails = async (code) => {
    try {
      const response = await api.get(`/invites/by-code/${code}`);
      setFamilyDetails(response.data);
    } catch (err) {
      setError('Code d\'invitation invalide');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/invites/join', formData);
      setSuccess('Vous avez rejoint la famille avec succès !');
      setTimeout(() => {
        navigate('/family-groups');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la tentative de rejoindre la famille');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.inviteCode) {
      setError('Veuillez entrer un code d\'invitation');
      return;
    }
    fetchFamilyDetails(formData.inviteCode);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Rejoindre une Famille
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Code d'invitation"
                name="inviteCode"
                value={formData.inviteCode}
                onChange={handleChange}
                required
                helperText="Entrez le code d'invitation que vous avez reçu"
              />
              {!familyDetails && (
                <Button
                  onClick={handleVerifyCode}
                  variant="outlined"
                  sx={{ mt: 1 }}
                  disabled={loading}
                >
                  Vérifier le code
                </Button>
              )}
            </Grid>

            {familyDetails && (
              <>
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Vous allez rejoindre la famille : <strong>{familyDetails.name}</strong>
                    {familyDetails.patriarchName && (
                      <><br />Patriarche : {familyDetails.patriarchName}</>
                    )}
                    {familyDetails.matriarchName && (
                      <><br />Matriarche : {familyDetails.matriarchName}</>
                    )}
                  </Alert>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Votre lien de parenté</InputLabel>
                    <Select
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleChange}
                      label="Votre lien de parenté"
                    >
                      <MenuItem value="child">Fils/Fille</MenuItem>
                      <MenuItem value="grandchild">Petit-fils/Petite-fille</MenuItem>
                      <MenuItem value="spouse">Conjoint(e)</MenuItem>
                      <MenuItem value="sibling">Frère/Sœur</MenuItem>
                      <MenuItem value="cousin">Cousin(e)</MenuItem>
                      <MenuItem value="other">Autre</MenuItem>
                    </Select>
                    <FormHelperText>
                      Sélectionnez votre relation avec le patriarche/la matriarche
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {formData.relationship === 'other' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Précisez votre lien"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Rejoindre la famille'}
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default JoinFamily;
