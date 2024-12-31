import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { getFamilyDetails } from '../services/familyService';
import PhotoGallery from '../components/PhotoGallery';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`family-tabpanel-${index}`}
      aria-labelledby={`family-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const FamilyDetails = () => {
  const { familyId } = useParams();
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadFamilyDetails();
  }, [familyId]);

  const loadFamilyDetails = async () => {
    try {
      setLoading(true);
      const response = await getFamilyDetails(familyId);
      setFamily(response.data.family);
    } catch (error) {
      console.error('Erreur lors du chargement des détails de la famille:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!family) {
    return (
      <Container>
        <Typography variant="h6" align="center">
          Famille non trouvée
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {family.name}
        </Typography>
        {family.description && (
          <Typography variant="body1" color="textSecondary">
            {family.description}
          </Typography>
        )}
      </Box>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Informations" />
          <Tab label="Photos" />
          <Tab label="Membres" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Détails de la famille
            </Typography>
            <Typography>
              <strong>Patriarche:</strong> {family.patriarchName || 'Non spécifié'}
            </Typography>
            <Typography>
              <strong>Matriarche:</strong> {family.matriarchName || 'Non spécifié'}
            </Typography>
            <Typography>
              <strong>Localisation:</strong> {family.location || 'Non spécifié'}
            </Typography>
            <Typography>
              <strong>Date de création:</strong>{' '}
              {new Date(family.foundingDate).toLocaleDateString() || 'Non spécifié'}
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <PhotoGallery familyId={familyId} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Liste des membres
          </Typography>
          {/* TODO: Ajouter la liste des membres */}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default FamilyDetails;
