import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const TwoFactorAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    // Vérifier si le 2FA est déjà activé pour l'utilisateur
    const check2FAStatus = async () => {
      try {
        const response = await api.get('/auth/2fa-status');
        setIs2FAEnabled(response.data.enabled);
      } catch (err) {
        setError('Erreur lors de la vérification du statut 2FA');
      }
    };

    check2FAStatus();
  }, []);

  const handleEnable2FA = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.post('/auth/enable-2fa');
      setQrCode(response.data.qrCode);
      setSuccess('Scannez le QR code avec votre application d\'authentification');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'activation du 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await api.post('/auth/verify-2fa', { code: verificationCode });
      setIs2FAEnabled(true);
      setQrCode('');
      setSuccess('2FA activé avec succès');
      setVerificationCode('');
    } catch (err) {
      setError(err.response?.data?.message || 'Code de vérification invalide');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      setLoading(true);
      setError('');
      await api.post('/auth/disable-2fa');
      setIs2FAEnabled(false);
      setSuccess('2FA désactivé avec succès');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la désactivation du 2FA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Authentification à deux facteurs
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" gutterBottom>
            Status: {is2FAEnabled ? 'Activé' : 'Désactivé'}
          </Typography>

          {!is2FAEnabled && !qrCode && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEnable2FA}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Activer 2FA'}
            </Button>
          )}

          {is2FAEnabled && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDisable2FA}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Désactiver 2FA'}
            </Button>
          )}
        </Box>

        {qrCode && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Scannez ce QR Code
            </Typography>
            <img src={qrCode} alt="QR Code pour 2FA" style={{ maxWidth: '100%' }} />
            
            <Box component="form" onSubmit={handleVerify2FA} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Code de vérification"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                margin="normal"
                required
                type="text"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !verificationCode}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Vérifier'}
              </Button>
            </Box>
          </Box>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte.
          Une fois activée, vous devrez fournir un code de vérification en plus de votre mot de passe lors de la connexion.
        </Typography>
      </Paper>
    </Container>
  );
};

export default TwoFactorAuth;
