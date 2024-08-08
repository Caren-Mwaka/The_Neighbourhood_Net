import React, { useState, useEffect } from 'react';
import { Button, Typography, TextField, Container, Box, Grid, Tabs, Tab, Pagination } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import './AdminDashboard.css'; 

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', username: '', email: '', password: '', role: '' });
  const [newIncident, setNewIncident] = useState({ name: '', date: '', type: '', priority: '', location: '', description: '' });
  const [userPage, setUserPage] = useState(1);
  const [incidentPage, setIncidentPage] = useState(1);
  const usersPerPage = 5;
  const incidentsPerPage = 5;

  useEffect(() => {
    fetchUsers();
    fetchIncidents();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5555/users');
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await fetch('http://localhost:5555/incidents');
      const data = await response.json();
      setIncidents(data.incidents);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('http://localhost:5555/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        const data = await response.json();
        setUsers([...users, data]);
        toast.success('User added successfully!');
        setNewUser({ name: '', username: '', email: '', password: '', role: '' });
      } else {
        toast.error('Failed to add user.');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user.');
    }
  };

  const handleAddIncident = async () => {
    try {
      const response = await fetch('http://localhost:5555/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIncident),
      });
      if (response.ok) {
        const data = await response.json();
        setIncidents([...incidents, data]);
        toast.success('Incident added successfully!');
        setNewIncident({ name: '', date: '', type: '', priority: '', location: '', description: '' });
      } else {
        toast.error('Failed to add incident.');
      }
    } catch (error) {
      console.error('Error adding incident:', error);
      toast.error('Failed to add incident.');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5555/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully!');
      } else {
        toast.error('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user.');
    }
  };

  const handleDeleteIncident = async (incidentId) => {
    try {
      const response = await fetch(`http://localhost:5555/incidents/${incidentId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setIncidents(incidents.filter(incident => incident.id !== incidentId));
        toast.success('Incident deleted successfully!');
      } else {
        toast.error('Failed to delete incident.');
      }
    } catch (error) {
      console.error('Error deleting incident:', error);
      toast.error('Failed to delete incident.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUserPageChange = (event, value) => {
    setUserPage(value);
  };

  const handleIncidentPageChange = (event, value) => {
    setIncidentPage(value);
  };

  const paginatedUsers = users.slice((userPage - 1) * usersPerPage, userPage * usersPerPage);
  const paginatedIncidents = incidents.slice((incidentPage - 1) * incidentsPerPage, incidentPage * incidentsPerPage);

  return (
    <Container className="container">
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Box className="tabsContainer">
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Users" value="users" />
          <Tab label="Incidents" value="incidents" />
        </Tabs>
      </Box>

      {activeTab === 'users' && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box className="formContainer">
              <Typography variant="h6">Add New User</Typography>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="formItem"
              />
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="formItem"
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="formItem"
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="formItem"
              />
              <TextField
                label="Role"
                variant="outlined"
                fullWidth
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="formItem"
              />
              <Button onClick={handleAddUser} variant="contained" color="primary">Add User</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className="listContainer">
              {paginatedUsers.map(user => (
                <Box key={user.id} className="item">
                  <Typography variant="body1">{user.username} ({user.email})</Typography>
                  <Button onClick={() => handleDeleteUser(user.id)} variant="contained" color="error">Delete User</Button>
                </Box>
              ))}
              <Pagination
                count={Math.ceil(users.length / usersPerPage)}
                page={userPage}
                onChange={handleUserPageChange}
                sx={{ marginTop: 2 }}
              />
            </Box>
          </Grid>
        </Grid>
      )}

      {activeTab === 'incidents' && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box className="formContainer">
              <Typography variant="h6">Add New Incident</Typography>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={newIncident.name}
                onChange={(e) => setNewIncident({ ...newIncident, name: e.target.value })}
                className="formItem"
              />
              <TextField
                label="Date"
                variant="outlined"
                fullWidth
                type="date"
                value={newIncident.date}
                onChange={(e) => setNewIncident({ ...newIncident, date: e.target.value })}
                className="formItem"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Type"
                variant="outlined"
                fullWidth
                value={newIncident.type}
                onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value })}
                className="formItem"
              />
              <TextField
                label="Priority"
                variant="outlined"
                fullWidth
                value={newIncident.priority}
                onChange={(e) => setNewIncident({ ...newIncident, priority: e.target.value })}
                className="formItem"
              />
              <TextField
                label="Location"
                variant="outlined"
                fullWidth
                value={newIncident.location}
                onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                className="formItem"
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                value={newIncident.description}
                onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                className="formItem"
              />
              <Button onClick={handleAddIncident} variant="contained" color="primary">Add Incident</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className="listContainer">
              {paginatedIncidents.map(incident => (
                <Box key={incident.id} className="item">
                  <Typography variant="body1">
                    {incident.name} ({incident.date}) - {incident.type} - {incident.priority} - {incident.location}
                  </Typography>
                  <Button onClick={() => handleDeleteIncident(incident.id)} variant="contained" color="error">Delete Incident</Button>
                </Box>
              ))}
              <Pagination
                count={Math.ceil(incidents.length / incidentsPerPage)}
                page={incidentPage}
                onChange={handleIncidentPageChange}
                sx={{ marginTop: 2 }}
              />
            </Box>
          </Grid>
        </Grid>
      )}
      <ToastContainer />
    </Container>
  );
};

export default AdminDashboard;
