import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { createFamily } from '../services/familyService';

const FamilyForm = ({ onFamilyCreated }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await createFamily({ name });
      setName('');
      if (onFamilyCreated) {
        onFamilyCreated(response.data.family);
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la création de la famille');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Créer une nouvelle famille
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Nom de la famille"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        margin="normal"
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Création...' : 'Créer la famille'}
      </Button>
    </Box>
  );
};

export default FamilyForm;
