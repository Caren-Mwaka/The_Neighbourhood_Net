import React, { useState } from 'react';
import { Box, Container, Grid, TextField, Button, Typography, MenuItem, InputAdornment, FormControl, InputLabel, Select } from '@mui/material';
import { Shield, CalendarToday } from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './IncidentPage.css';
import backgroundImage from '../assets/incidents-image.jpg'; 

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  date: Yup.string().required('Date is required'),
  type: Yup.string().required('Type is required'),
  priority: Yup.string().required('Priority is required'),
  description: Yup.string().required('Description is required'),
});

function IncidentPage() {
  const [incidents, setIncidents] = useState([]);

  const handleSubmit = (values, { resetForm }) => {
    const newIncident = {
      id: incidents.length + 1,
      ...values,
    };
    setIncidents([...incidents, newIncident]);
    resetForm();
  };

  return (
    <Box className="report-section">
      <Container maxWidth="md">
        <Box className="report-container">
          <Box className="report-image" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Typography variant="h4" className="report-title">
              THE NEIGHBOURHOOD WATCH
            </Typography>
            <Typography variant="body1" className="report-subtitle">
              Report incidents swiftly and help keep our neighborhood safe.
            </Typography>
          </Box>
          <Box className="report-form">
            <Typography variant="h4" className="form-title">
              Incident Report
            </Typography>
            <Formik
              initialValues={{ name: '', date: '', type: '', priority: '', description: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form noValidate autoComplete="off">
                  <FormControl fullWidth margin="normal" variant="outlined">
                    <Field
                      as={TextField}
                      variant="outlined"
                      fullWidth
                      name="name"
                      placeholder="Enter first name and last name"
                      InputProps={{
                        style: { color: '#000' },
                      }}
                      style={{ backgroundColor: '#fff' }}
                      helperText={<ErrorMessage name="name" />}
                      error={!!<ErrorMessage name="name" />}
                    />
                  </FormControl>
                  <FormControl fullWidth margin="normal" variant="outlined">
                    <Field
                      as={TextField}
                      variant="outlined"
                      fullWidth
                      type="date"
                      name="date"
                      placeholder="Date of the incident"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        style: { color: '#000' },
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday style={{ color: '#000' }} />
                          </InputAdornment>
                        ),
                      }}
                      style={{ backgroundColor: '#fff' }}
                      helperText={<ErrorMessage name="date" />}
                      error={!!<ErrorMessage name="date" />}
                    />
                  </FormControl>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel style={{ color: '#000' }}>Incident type</InputLabel>
                        <Field
                          as={Select}
                          name="type"
                          label="Incident type"
                          variant="outlined"
                          style={{ backgroundColor: '#fff', color: '#000' }}
                        >
                          <MenuItem value="theft">Theft</MenuItem>
                          <MenuItem value="vandalism">Vandalism</MenuItem>
                          <MenuItem value="accident">Accident</MenuItem>
                        </Field>
                        <ErrorMessage name="type" component="div" className="error-message" />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel style={{ color: '#000' }}>Priority level</InputLabel>
                        <Field
                          as={Select}
                          name="priority"
                          label="Priority level"
                          variant="outlined"
                          style={{ backgroundColor: '#fff', color: '#000' }}
                        >
                          <MenuItem value="high">High</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="low">Low</MenuItem>
                        </Field>
                        <ErrorMessage name="priority" component="div" className="error-message" />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <FormControl fullWidth margin="normal" variant="outlined">
                    <Field
                      as={TextField}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      name="description"
                      placeholder="Description"
                      InputProps={{
                        style: { color: '#000' },
                      }}
                      style={{ backgroundColor: '#fff' }}
                      helperText={<ErrorMessage name="description" />}
                      error={!!<ErrorMessage name="description" />}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    startIcon={<Shield />}
                    className="btn"
                    disabled={isSubmitting}
                  >
                    SUBMIT REPORT
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Container>
      <Container maxWidth="md">
        <Box className="incident-list-container">
          {incidents.map((incident) => (
            <Box key={incident.id} className="incident-card">
              <Typography variant="h6">Report #{incident.id}</Typography>
              <Typography variant="body2"><strong>Name:</strong> {incident.name}</Typography>
              <Typography variant="body2"><strong>Date:</strong> {incident.date}</Typography>
              <Typography variant="body2"><strong>Type:</strong> {incident.type}</Typography>
              <Typography variant="body2"><strong>Priority:</strong> {incident.priority}</Typography>
              <Typography variant="body2"><strong>Description:</strong> {incident.description}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default IncidentPage;
