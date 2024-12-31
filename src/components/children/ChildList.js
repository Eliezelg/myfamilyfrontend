import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { getChildren, deleteChild } from '../../services/childService';

const ChildList = ({ familyId, onEdit }) => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, childId: null });

  useEffect(() => {
    loadChildren();
  }, [familyId]);

  const loadChildren = async () => {
    try {
      const response = await getChildren(familyId);
      setChildren(response.data.children);
      setError('');
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des enfants');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (childId) => {
    setDeleteDialog({ open: true, childId });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteChild(familyId, deleteDialog.childId);
      await loadChildren();
      setDeleteDialog({ open: false, childId: null });
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression de l\'enfant');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, childId: null });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {children.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          Aucun enfant dans cette famille
        </Typography>
      ) : (
        <List>
          {children.map((child) => (
            <ListItem key={child.id}>
              <ListItemText
                primary={`${child.firstName} ${child.lastName}`}
                secondary={`Né(e) le ${formatDate(child.birthDate)}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="modifier"
                  onClick={() => onEdit(child)}
                  sx={{ mr: 1 }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="supprimer"
                  onClick={() => handleDeleteClick(child.id)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cet enfant ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChildList;
