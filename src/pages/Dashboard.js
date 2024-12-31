import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Cake as CakeIcon,
  Notifications as NotificationsIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { getFamilies } from '../services/familyService';
import FamilyForm from '../components/FamilyForm';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    children: [],
    upcomingBirthdays: [],
    recentActivities: []
  });
  const [families, setFamilies] = useState([]);
  const [showFamilyForm, setShowFamilyForm] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchFamilies();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [childrenRes, activitiesRes] = await Promise.all([
        api.get('/children'),
        api.get('/activities/recent')
      ]);

      // Trier les anniversaires à venir
      const today = new Date();
      const upcomingBirthdays = childrenRes.data.children
        .map(child => {
          const birthDate = new Date(child.dateOfBirth);
          const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
          if (nextBirthday < today) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
          }
          return { ...child, nextBirthday };
        })
        .sort((a, b) => a.nextBirthday - b.nextBirthday)
        .slice(0, 3);

      setDashboardData({
        children: childrenRes.data.children,
        upcomingBirthdays,
        recentActivities: activitiesRes.data.activities
      });
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchFamilies = async () => {
    try {
      const response = await getFamilies();
      setFamilies(response.data.families);
      setError('');
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des familles');
    }
  };

  const handleFamilyCreated = (newFamily) => {
    setFamilies([...families, newFamily]);
    setShowFamilyForm(false);
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatActivityDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* En-tête */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1">
              Tableau de bord
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowFamilyForm(!showFamilyForm)}
            >
              {showFamilyForm ? 'Masquer le formulaire' : 'Créer une famille'}
            </Button>
          </Paper>
        </Grid>

        {/* Formulaire de création de famille */}
        {showFamilyForm && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <FamilyForm onFamilyCreated={handleFamilyCreated} />
            </Paper>
          </Grid>
        )}

        {/* Liste des familles */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Mes familles
            </Typography>
            {families.length === 0 ? (
              <Typography color="textSecondary">
                Vous n'avez pas encore de famille. Créez-en une !
              </Typography>
            ) : (
              <List>
                {families.map((family) => (
                  <React.Fragment key={family.id}>
                    <ListItem
                      button
                      onClick={() => navigate(`/families/${family.id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <GroupIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={family.name}
                        secondary={`${family.children?.length || 0} enfant(s)`}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Carte de profil */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <Avatar
              src={user?.profilePicture}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {user?.email}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/profile')}
              sx={{ mt: 2 }}
            >
              Modifier mon profil
            </Button>
          </Paper>
        </Grid>

        {/* Résumé des enfants */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Mes Enfants ({dashboardData.children.length})
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/children')}
              >
                Gérer les enfants
              </Button>
            </Box>
            <Grid container spacing={2}>
              {dashboardData.children.map((child) => (
                <Grid item xs={12} sm={6} md={4} key={child.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={child.photo || '/placeholder-child.png'}
                      alt={`${child.firstName} ${child.lastName}`}
                    />
                    <CardContent>
                      <Typography variant="h6">
                        {child.firstName}
                      </Typography>
                      <Typography color="textSecondary">
                        {calculateAge(child.dateOfBirth)} ans
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Anniversaires à venir */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Prochains Anniversaires
            </Typography>
            <List>
              {dashboardData.upcomingBirthdays.map((child) => (
                <React.Fragment key={child.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <CakeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${child.firstName} ${child.lastName}`}
                      secondary={`${new Date(child.nextBirthday).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long'
                      })} - ${calculateAge(child.dateOfBirth) + 1} ans`}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Activités récentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Activités Récentes
            </Typography>
            <List>
              {dashboardData.recentActivities.map((activity) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <NotificationsIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.description}
                      secondary={formatActivityDate(activity.createdAt)}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
