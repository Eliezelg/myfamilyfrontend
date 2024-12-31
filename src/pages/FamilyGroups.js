import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  ContentCopy as CopyIcon,
  Photo as PhotoIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { getFamilies, createFamily, updateFamily, deleteFamily, getInviteLink, getInviteCode } from '../services/familyService';
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

const FamilyGroups = () => {
  const { user } = useAuth();
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    patriarchName: '',
    matriarchName: '',
    location: '',
    foundingDate: '',
  });

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const response = await getFamilies();
      console.log('Réponse des familles:', response);
      setFamilies(response.data.families || []);
      setError('');
    } catch (err) {
      console.error('Erreur de récupération des familles:', err);
      setError(err.message || 'Erreur lors de la récupération des familles');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (family = null) => {
    if (family) {
      setSelectedFamily(family);
      setFormData({
        name: family.name,
        description: family.description || '',
        patriarchName: family.patriarchName || '',
        matriarchName: family.matriarchName || '',
        location: family.location || '',
        foundingDate: family.foundingDate?.split('T')[0] || '',
      });
    } else {
      setSelectedFamily(null);
      setFormData({
        name: '',
        description: '',
        patriarchName: '',
        matriarchName: '',
        location: '',
        foundingDate: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFamily(null);
  };

  const handleOpenInviteDialog = (family) => {
    setSelectedFamily(family);
    setOpenInviteDialog(true);
  };

  const handleCloseInviteDialog = () => {
    setOpenInviteDialog(false);
    setSelectedFamily(null);
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
      if (selectedFamily) {
        await updateFamily(selectedFamily.id, formData);
        setSuccess('Famille mise à jour avec succès');
      } else {
        await createFamily(formData);
        setSuccess('Famille créée avec succès');
      }
      await fetchFamilies();
      handleCloseDialog();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (familyId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette famille ?')) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      await deleteFamily(familyId);
      setSuccess('Famille supprimée avec succès');
      fetchFamilies();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression de la famille');
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = async (familyId) => {
    try {
      const response = await getInviteLink(familyId);
      await navigator.clipboard.writeText(response.inviteLink);
      setSuccess('Lien d\'invitation copié dans le presse-papier');
    } catch (err) {
      setError('Erreur lors de la génération du lien d\'invitation');
    }
  };

  const copyInviteCode = async (familyId) => {
    try {
      const response = await getInviteCode(familyId);
      await navigator.clipboard.writeText(response.inviteCode);
      setSuccess('Code d\'invitation copié dans le presse-papier');
    } catch (err) {
      setError('Erreur lors de la génération du code d\'invitation');
    }
  };

  const renderFamilyCard = (family) => (
    <Card key={family.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="div">
            {family.name}
          </Typography>
          <Box>
            <IconButton onClick={() => handleOpenDialog(family)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleOpenInviteDialog(family)}>
              <ShareIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(family.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label="Informations" />
          <Tab label="Photos" icon={<PhotoIcon />} />
        </Tabs>

        <TabPanel value={selectedTab} index={0}>
          <Box mt={2}>
            <Typography color="textSecondary" gutterBottom>
              Description: {family.description || 'Non spécifié'}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Patriarche: {family.patriarchName || 'Non spécifié'}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Matriarche: {family.matriarchName || 'Non spécifié'}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Localisation: {family.location || 'Non spécifié'}
            </Typography>
            <Typography color="textSecondary">
              Date de création: {family.foundingDate ? new Date(family.foundingDate).toLocaleDateString() : 'Non spécifié'}
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <PhotoGallery familyId={family.id} />
        </TabPanel>
      </CardContent>
    </Card>
  );

  if (loading && families.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Groupes Familiaux
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Créer une famille
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={3}>
          {families.map((family) => (
            renderFamilyCard(family)
          ))}
        </Grid>
      </Paper>

      {/* Dialog de création/modification */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedFamily ? 'Modifier la famille' : 'Créer une nouvelle famille'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                name="name"
                label="Nom de la famille"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                name="patriarchName"
                label="Nom du patriarche"
                value={formData.patriarchName}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                name="matriarchName"
                label="Nom de la matriarche"
                value={formData.matriarchName}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                name="location"
                label="Lieu"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                name="foundingDate"
                label="Date de fondation"
                type="date"
                value={formData.foundingDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {selectedFamily ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog d'invitation */}
      <Dialog open={openInviteDialog} onClose={handleCloseInviteDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Inviter des membres</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>
              Vous pouvez inviter des membres de votre famille en leur envoyant un lien d'invitation
              ou un code d'invitation.
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<CopyIcon />}
              onClick={() => selectedFamily && copyInviteLink(selectedFamily.id)}
              sx={{ mb: 2 }}
            >
              Copier le lien d'invitation
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<CopyIcon />}
              onClick={() => selectedFamily && copyInviteCode(selectedFamily.id)}
            >
              Copier le code d'invitation
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInviteDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FamilyGroups;
