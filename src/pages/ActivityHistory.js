import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ActivityHistory = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    dateRange: 'week',
    user: 'all',
  });

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/activity-history', { params: filters });
      setActivities(response.data);
    } catch (err) {
      setError('Erreur lors de la récupération de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'event':
        return <EventIcon />;
      case 'profile':
        return <PersonIcon />;
      case 'settings':
        return <SettingsIcon />;
      case 'security':
        return <SecurityIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'event':
        return 'primary';
      case 'profile':
        return 'secondary';
      case 'settings':
        return 'warning';
      case 'security':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && activities.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Historique des Activités
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Type d'activité"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="event">Événements</MenuItem>
              <MenuItem value="profile">Profils</MenuItem>
              <MenuItem value="settings">Paramètres</MenuItem>
              <MenuItem value="security">Sécurité</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Période"
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
            >
              <MenuItem value="today">Aujourd'hui</MenuItem>
              <MenuItem value="week">Cette semaine</MenuItem>
              <MenuItem value="month">Ce mois</MenuItem>
              <MenuItem value="year">Cette année</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Utilisateur"
              name="user"
              value={filters.user}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="me">Moi</MenuItem>
              <MenuItem value="family">Famille</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <List>
          {activities.map((activity) => (
            <ListItem
              key={activity._id}
              sx={{
                mb: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ListItemIcon>
                {getActivityIcon(activity.type)}
              </ListItemIcon>
              <ListItemText
                primary={activity.description}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(activity.timestamp)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.user}
                    </Typography>
                  </Box>
                }
              />
              <Chip
                label={activity.type}
                color={getActivityColor(activity.type)}
                size="small"
                sx={{ ml: 2 }}
              />
            </ListItem>
          ))}
        </List>

        {activities.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              Aucune activité trouvée pour les filtres sélectionnés
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ActivityHistory;
