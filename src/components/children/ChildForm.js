import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Alert,
  Typography
} from '@mui/material';
import { createChild, updateChild } from '../../services/childService';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('Le prénom est requis')
    .max(50, 'Le prénom ne doit pas dépasser 50 caractères'),
  lastName: Yup.string()
    .required('Le nom est requis')
    .max(50, 'Le nom ne doit pas dépasser 50 caractères'),
  birthDate: Yup.date()
    .required('La date de naissance est requise')
    .max(new Date(), 'La date de naissance ne peut pas être dans le futur')
});

const ChildForm = ({ familyId, initialData, isEdit, onSuccess }) => {
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEdit) {
        await updateChild(familyId, initialData.id, values);
      } else {
        await createChild(familyId, values);
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {isEdit ? 'Modifier l\'enfant' : 'Ajouter un enfant'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={initialData || {
          firstName: '',
          lastName: '',
          birthDate: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors, handleChange, handleBlur, values }) => (
          <Form>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="Prénom"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />

              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Nom"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.lastName && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />

              <TextField
                fullWidth
                id="birthDate"
                name="birthDate"
                label="Date de naissance"
                type="date"
                value={values.birthDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.birthDate && Boolean(errors.birthDate)}
                helperText={touched.birthDate && errors.birthDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enregistrement...' : (isEdit ? 'Modifier' : 'Ajouter')}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ChildForm;
