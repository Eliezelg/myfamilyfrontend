import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { uploadPhoto, getFamilyPhotos, deletePhoto } from '../services/photoService';

const PhotoGallery = ({ familyId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPhotos();
  }, [familyId]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const response = await getFamilyPhotos(familyId);
      setPhotos(response.data.photos);
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
      setError('Erreur lors du chargement des photos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        setError('Seuls les formats JPEG et PNG sont acceptés');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('La taille du fichier ne doit pas dépasser 10MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner une photo');
      return;
    }

    try {
      setUploading(true);
      await uploadPhoto(familyId, selectedFile, title, description);
      await loadPhotos();
      setUploadDialogOpen(false);
      resetUploadForm();
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
      try {
        await deletePhoto(photoId);
        await loadPhotos();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError(error.message);
      }
    }
  };

  const resetUploadForm = () => {
    setSelectedFile(null);
    setTitle('');
    setDescription('');
    setError('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Photos de famille</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setUploadDialogOpen(true)}
        >
          Ajouter une photo
        </Button>
      </Box>

      <Grid container spacing={3}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={photo.thumbnailUrl}
                alt={photo.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle1" noWrap>
                      {photo.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Par {photo.uploadedBy.firstName} {photo.uploadedBy.lastName}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(photo.id)}
                    aria-label="supprimer"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                {photo.description && (
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    {photo.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une photo</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <input
              accept="image/jpeg,image/png"
              style={{ display: 'none' }}
              id="photo-upload"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="photo-upload">
              <Button variant="outlined" component="span" fullWidth>
                {selectedFile ? selectedFile.name : 'Choisir une photo'}
              </Button>
            </label>

            <TextField
              margin="normal"
              fullWidth
              label="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {error && (
              <Typography color="error" variant="body2" mt={1}>
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disabled={!selectedFile || uploading}
          >
            {uploading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PhotoGallery;
