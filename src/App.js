import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box } from '@mui/material';
import theme from './theme';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import TwoFactorAuth from './pages/TwoFactorAuth';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import MyChildren from './pages/MyChildren';
import FamilyGroups from './pages/FamilyGroups';
import JoinFamily from './pages/JoinFamily';
import FamilyDetails from './pages/FamilyDetails';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Navbar />
        <Container>
          <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Family Profile Manager
            </Typography>
          </Box>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/my-children" element={
              <PrivateRoute>
                <MyChildren />
              </PrivateRoute>
            } />
            <Route path="/family-groups" element={
              <PrivateRoute>
                <FamilyGroups />
              </PrivateRoute>
            } />
            <Route path="/join-family" element={
              <PrivateRoute>
                <JoinFamily />
              </PrivateRoute>
            } />
            <Route path="/2fa" element={
              <PrivateRoute>
                <TwoFactorAuth />
              </PrivateRoute>
            } />
            <Route path="/families/:familyId" element={
              <PrivateRoute>
                <FamilyDetails />
              </PrivateRoute>
            } />
            <Route path="/" element={
              <PrivateRoute>
                <FamilyGroups />
              </PrivateRoute>
            } />
          </Routes>
        </Container>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
