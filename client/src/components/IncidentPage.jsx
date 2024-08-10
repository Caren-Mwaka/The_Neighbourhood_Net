
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem, InputAdornment, FormControl, InputLabel, Select, IconButton } from '@mui/material';
import { Shield, CalendarToday, FilterList } from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './IncidentPage.css';
import backgroundImage from '../assets/incidents-image.jpg';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  date: Yup.string().required('Date is required'),
  type: Yup.string().required('Type is required'),
  priority: Yup.string().required('Priority is required'),
  location: Yup.string().required('Location is required'),
  description: Yup.string().required('Description is required'),
});

function IncidentPage() {
  const [incidents, setIncidents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 3;
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('http://localhost:5555/incidents')
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data.incidents)) {
          // Sort the incidents by date in descending order (latest first)
          const sortedIncidents = data.incidents.sort((a, b) => new Date(b.date) - new Date(a.date));
          setIncidents(sortedIncidents);
        } else {
          console.error('Fetched data is not in the expected format:', data);
          setIncidents([]);
        }
      })
      .catch(error => console.error('Error fetching incidents:', error));
  }, []);

  const handleSubmit = (values, { resetForm }) => {
    fetch('http://localhost:5555/incidents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then(response => response.json())
      .then(data => {
        const newIncident = { id: data.id, ...values };
        // Insert the new incident at the beginning of the list
        const sortedIncidents = [newIncident, ...incidents].sort((a, b) => new Date(b.date) - new Date(a.date));
        setIncidents(sortedIncidents);
        resetForm();
      })
      .catch(error => {
        console.error('Error posting incident:', error);
      });
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  const filteredIncidents = filter === 'all' ? incidents : incidents.filter(incident => incident.type === filter);

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredIncidents.slice(indexOfFirstReport, indexOfLastReport);

  const totalPages = Math.ceil(filteredIncidents.length / reportsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <Box className="report-section">
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
            initialValues={{ name: '', date: '', type: '', priority: '', location: '', description: '' }}
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
                <Box display="flex" justifyContent="space-between">
                  <FormControl margin="normal" variant="outlined" style={{ width: '48%' }}>
                    <InputLabel style={{ color: '#000' }}>Incident type</InputLabel>
                    <Field
                      as={Select}
                      name="type"
                      label="Incident type"
                      variant="outlined"
                      style={{ backgroundColor: '#fff', color: '#000' }}
                    >
                      <MenuItem value="safety">Safety Concerns</MenuItem>
                      <MenuItem value="environmental">Environmental Hazards</MenuItem>
                      <MenuItem value="health">Public Health Issues</MenuItem>
                      <MenuItem value="infrastructure">Infrastructure Issues</MenuItem>
                      <MenuItem value="protests">Protests</MenuItem>
                    </Field>
                    <ErrorMessage name="type" component="div" className="error-message" />
                  </FormControl>
                  <FormControl margin="normal" variant="outlined" style={{ width: '48%' }}>
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
                </Box>
                <FormControl fullWidth margin="normal" variant="outlined">
                  <Field
                    as={TextField}
                    variant="outlined"
                    fullWidth
                    name="location"
                    placeholder="Location of the incident"
                    InputProps={{
                      style: { color: '#000' },
                    }}
                    style={{ backgroundColor: '#fff' }}
                    helperText={<ErrorMessage name="location" />}
                    error={!!<ErrorMessage name="location" />}
                  />
                </FormControl>
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

      <Box className="incident-list-container">
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <IconButton>
            <FilterList style={{ color: '#fff' }} />
          </IconButton>
          <FormControl variant="outlined" style={{ minWidth: 200, marginLeft: '8px' }}>
            <Select
              value={filter}
              onChange={handleFilterChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Filter incidents by type' }}
              style={{ color: '#fff', backgroundColor: '#192F2C' }}
            >
              <MenuItem value="all">All Incidents</MenuItem>
              <MenuItem value="safety">Safety Concerns</MenuItem>
              <MenuItem value="environmental">Environmental Hazards</MenuItem>
              <MenuItem value="health">Public Health Issues</MenuItem>
              <MenuItem value="infrastructure">Infrastructure Issues</MenuItem>
              <MenuItem value="protests">Protests</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {currentReports.map((incident) => (
          <Box key={incident.id} className="incident-card">
            <Typography variant="h6">Incident Report No.{incident.id}</Typography>
            <Typography variant="body1">{incident.type} - {incident.date}</Typography>
            <Typography variant="body2">Priority level: {incident.priority}</Typography>
            <Typography variant="body2">Location: {incident.location}</Typography>
            <Typography variant="body2">
              <strong>Description:</strong><br />{incident.description}
            </Typography>
          </Box>
        ))}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button onClick={handlePrevPage} disabled={currentPage === 1} style={{ color: '#fff' }}>
            Previous
          </Button>
          <Button onClick={handleNextPage} disabled={currentPage === totalPages} style={{ color: '#fff' }}>
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default IncidentPage;
