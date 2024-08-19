import React, { useState, useEffect } from "react";
import dashlogo from "../assets/neighbourhood-net-logo.png";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  TextField,
  Container,
  Box,
  Tabs,
  Tab,
  Pagination,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [newIncident, setNewIncident] = useState({
    name: "",
    date: "",
    type: "",
    priority: "",
    location: "",
    description: "",
  });
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    image_url: "",
    type: "",
  });
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    date: "",
  });

  const [userPage, setUserPage] = useState(1);
  const [incidentPage, setIncidentPage] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const [notificationPage, setNotificationPage] = useState(1);

  const usersPerPage = 5;
  const incidentsPerPage = 5;
  const eventsPerPage = 5;
  const notificationsPerPage = 5;

  useEffect(() => {
    fetchUsers();
    fetchIncidents();
    fetchEvents();
    fetchNotifications();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users`);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/incidents`);
      const data = await response.json();
      setIncidents(data.incidents || []);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      toast.error("Failed to fetch incidents.");
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/events`);
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events.");
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/notifications`);
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications.");
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
  
      if (response.ok) {
        const data = await response.json();
        setUsers([...users, data]);
        toast.success("User added successfully!");
        setNewUser({
          name: "",
          username: "",
          email: "",
          password: "",
          role: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(`Failed to add user: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user.");
    }
  };
  

  const handleAddIncident = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/incidents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIncident),
      });
      if (response.ok) {
        const data = await response.json();
        setIncidents([...incidents, data]);
        toast.success("Incident added successfully!");
        setNewIncident({
          name: "",
          date: "",
          type: "",
          priority: "",
          location: "",
          description: "",
        });
      } else {
        toast.error("Failed to add incident.");
      }
    } catch (error) {
      console.error("Error adding incident:", error);
      toast.error("Failed to add incident.");
    }
  };

  const handleAddEvent = async () => {
    const formattedTime = newEvent.time.length === 5 ? `${newEvent.time}:00` : newEvent.time;
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newEvent, time: formattedTime }),
      });
      if (response.ok) {
        const data = await response.json();
        setEvents([...events, data]);
        toast.success("Event added successfully!");
        setNewEvent({
          name: "",
          date: "",
          time: "",
          location: "",
          image_url: "",
          type: "",
        });
      } else {
        toast.error("Failed to add event.");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Failed to add event.");
    }
  };

  const handleAddNotification = async () => {
    try {
      // Ensure newNotification contains all required fields
      console.log("New Notification Data:", newNotification);
  
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotification),
      });
  
      if (response.ok) {
        const data = await response.json();
        setNotifications([...notifications, data]);
        toast.success("Notification added successfully!");
        setNewNotification({ title: "", message: "", date: "" });
      } else {
        // Log the full error response to understand what's missing
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        toast.error(`Failed to add notification: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding notification:", error);
      toast.error("Failed to add notification.");
    }
  };
  

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId));
        toast.success("User deleted successfully!");
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const handleDeleteIncident = async (incidentId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${incidentId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setIncidents(incidents.filter((incident) => incident.id !== incidentId));
        toast.success("Incident deleted successfully!");
      } else {
        toast.error("Failed to delete incident.");
      }
    } catch (error) {
      console.error("Error deleting incident:", error);
      toast.error("Failed to delete incident.");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/events/${eventId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setEvents(events.filter((event) => event.id !== eventId));
        toast.success("Event deleted successfully!");
      } else {
        toast.error("Failed to delete event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event.");
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/notifications/${notificationId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNotifications(notifications.filter((notification) => notification.id !== notificationId));
        toast.success("Notification deleted successfully!");
      } else {
        toast.error("Failed to delete notification.");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification.");
    }
  };

  const handleToggleSolvedIncident = async (incidentId, solved) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/incidents/${incidentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solved: !solved }), // Toggle solved state
      });
  
      if (response.ok) {
        const updatedIncident = await response.json();
        console.log("Updated Incident:", updatedIncident); // Log updated incident
  
        // Update state
        setIncidents((prevIncidents) =>
          prevIncidents.map((incident) =>
            incident.id === incidentId ? updatedIncident : incident
          )
        );
  
        toast.success(`Incident ${!solved ? "marked as solved" : "marked as unsolved"} successfully!`);
      } else {
        toast.error("Failed to update incident.");
      }
    } catch (error) {
      console.error("Error updating incident:", error);
      toast.error("Failed to update incident.");
    }
  };
  

  const handleTabChange = (event, newTab) => {
    setActiveTab(newTab);
  };

  const handlePageChange = (event, newPage, type) => {
    switch (type) {
      case "users":
        setUserPage(newPage);
        break;
      case "incidents":
        setIncidentPage(newPage);
        break;
      case "events":
        setEventPage(newPage);
        break;
      case "notifications":
        setNotificationPage(newPage);
        break;
      default:
        break;
    }
  };

  const paginatedUsers = users.slice(
    (userPage - 1) * usersPerPage,
    userPage * usersPerPage
  );
  const paginatedIncidents = incidents.slice(
    (incidentPage - 1) * incidentsPerPage,
    incidentPage * incidentsPerPage
  );
  const paginatedEvents = events.slice(
    (eventPage - 1) * eventsPerPage,
    eventPage * eventsPerPage
  );
  const paginatedNotifications = notifications.slice(
    (notificationPage - 1) * notificationsPerPage,
    notificationPage * notificationsPerPage
  );

  return (
    <Container className="container" maxWidth={false}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          marginTop: -4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={dashlogo}
            alt="Logo"
            style={{
              width: "150px",
              height: "auto",
              maxWidth: "100%",
            }}
          />
          <Typography
            variant="h6"
            sx={{
              marginLeft: 2,
            }}
          >
            Neighbourhood Admin
          </Typography>
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#39a599",
            color: "#ffffff",
          }}
          onClick={() => navigate("/")}
        >
          Go Back
        </Button>
      </Box>

      <Box paddingBottom={5}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              color: "white",
              "&.Mui-selected": {
                color: "white",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "white",
            },
          }}
        >
          <Tab label="Users" value="users" />
          <Tab label="Incidents" value="incidents" />
          <Tab label="Events" value="events" />
          <Tab label="Notifications" value="notifications" />
        </Tabs>
      </Box>

      {activeTab === "users" && (
        <Box display="flex" justifyContent="space-between" gap={2}>
          <Box
            sx={{
              backgroundColor: "#39a599",
              padding: 2,
              borderRadius: 1,
              boxShadow: 1,
              width: "45%",
              maxWidth: 800,
              marginBottom: 10,
            }}
          >
            <Typography sx={{ color: "white" }}>Add User</Typography>
            <TextField
              label="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              fullWidth
              margin="normal"
              type="password"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAddUser}
              sx={{
                mt: 2,
                backgroundColor: "#39a599",
                color: "white",
                "&:hover": {
                  backgroundColor: "#2c8e80",
                },
              }}
            >
              Add User
            </Button>
          </Box>

          <Box
            sx={{
              width: "45%",
            }}
          >
            <Box
              sx={{
                borderColor: "white",
                padding: 2,
                borderRadius: 1,
                boxShadow: 1,
                marginBottom: 2,
                maxWidth: 200,
              }}
            >
              <Typography sx={{ color: "white" }}>Existing Users</Typography>
            </Box>
            {paginatedUsers.map((user) => (
              <Box
                key={user.id}
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography sx={{ color: "white", textAlign: "left" }}>
                  {user.name}
                  <br />
                  {user.email}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor: "#43B9AB",
                    color: "white",
                    borderColor: "#43B9AB",
                    "&:hover": {
                      backgroundColor: "#39a599",
                      borderColor: "#39a599",
                    },
                  }}
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </Button>
              </Box>
            ))}
            <Pagination
              count={Math.ceil(users.length / usersPerPage)}
              page={userPage}
              onChange={(e, value) => handlePageChange(e, value, "users")}
              sx={{ mt: 2 }}
            />
          </Box>
        </Box>
      )}

      {activeTab === "incidents" && (
        <Box display="flex" justifyContent="space-between" gap={2}>
          <Box
            sx={{
              backgroundColor: "#39a599",
              padding: 2,
              borderRadius: 1,
              boxShadow: 1,
              width: "45%",
              maxWidth: 800,
              marginBottom: 20,
            }}
          >
            <Typography sx={{ color: "white" }}>Add Incident</Typography>
            <TextField
              label="Name"
              value={newIncident.name}
              onChange={(e) =>
                setNewIncident({ ...newIncident, name: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date"
              type="date"
              value={newIncident.date}
              onChange={(e) =>
                setNewIncident({ ...newIncident, date: e.target.value })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={newIncident.type}
                onChange={(e) =>
                  setNewIncident({ ...newIncident, type: e.target.value })
                }
              >
                <MenuItem value="safety">Safety Concerns</MenuItem>
                <MenuItem value="environmental">Environmental Hazards</MenuItem>
                <MenuItem value="health">Public Health Issues</MenuItem>
                <MenuItem value="infrastructure">
                  Infrastructure Issues
                </MenuItem>
                <MenuItem value="protests">Protests</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                value={newIncident.priority}
                onChange={(e) =>
                  setNewIncident({ ...newIncident, priority: e.target.value })
                }
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Location"
              value={newIncident.location}
              onChange={(e) =>
                setNewIncident({ ...newIncident, location: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={newIncident.description}
              onChange={(e) =>
                setNewIncident({ ...newIncident, description: e.target.value })
              }
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            <Button
              variant="contained"
              onClick={handleAddIncident}
              sx={{
                mt: 2,
                backgroundColor: "#39a599",
                color: "white",
                "&:hover": {
                  backgroundColor: "#2c8e80",
                },
              }}
            >
              Add Incident
            </Button>
          </Box>

          <Box
            sx={{
              width: "45%",
            }}
          >
            <Box
              sx={{
                borderColor: "white",
                padding: 2,
                borderRadius: 1,
                boxShadow: 1,
                marginBottom: 2,
                maxWidth: 200,
              }}
            >
              <Typography sx={{ color: "white" }}>
                Existing Incidents
              </Typography>
            </Box>
            {paginatedIncidents.map((incident) => (
              <Box
                key={incident.id}
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography sx={{ color: "white", textAlign: "left" }}>
                  {incident.name}
                  <br />
                  {incident.date}
                </Typography>
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    sx={{
                      backgroundColor: incident.solved ? "#43B9AB" : "#FF4C4C",
                      color: "white",
                      borderColor: incident.solved ? "#43B9AB" : "#FF4C4C",
                      "&:hover": {
                        backgroundColor: incident.solved
                          ? "#39a599"
                          : "#ff6b6b",
                        borderColor: incident.solved
                          ? "#39a599"
                          : "#ff6b6b",
                      },
                    }}
                    onClick={() =>
                      handleToggleSolvedIncident(incident.id, incident.solved)
                    }
                  >
                    {incident.solved ? "SOLVED" : "UNSOLVED"}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      backgroundColor: "#43B9AB",
                      color: "white",
                      borderColor: "#43B9AB",
                      "&:hover": {
                        backgroundColor: "#39a599",
                        borderColor: "#39a599",
                      },
                    }}
                    onClick={() => handleDeleteIncident(incident.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
            <Pagination
              count={Math.ceil(incidents.length / incidentsPerPage)}
              page={incidentPage}
              onChange={(e, value) =>
                handlePageChange(e, value, "incidents")
              }
              sx={{ mt: 2 }}
            />
          </Box>
        </Box>
      )}

      {activeTab === "events" && (
        <Box display="flex" justifyContent="space-between" gap={2}>
          <Box
            sx={{
              backgroundColor: "#39a599",
              padding: 2,
              borderRadius: 1,
              boxShadow: 1,
              width: "45%",
              maxWidth: 800,
              marginBottom: 10,
            }}
          >
            <Typography sx={{ color: "white" }}>Add Event</Typography>
            <TextField
              label="Name"
              value={newEvent.name}
              onChange={(e) =>
                setNewEvent({ ...newEvent, name: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date"
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              type="time"
              value={newEvent.time}
              onChange={(e) =>
                setNewEvent({ ...newEvent, time: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Location"
              value={newEvent.location}
              onChange={(e) =>
                setNewEvent({ ...newEvent, location: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Image URL"
              value={newEvent.image_url}
              onChange={(e) =>
                setNewEvent({ ...newEvent, image_url: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={newEvent.type}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, type: e.target.value })
                }
                label="Type"
              >
                <MenuItem value="all">All Events</MenuItem>
                <MenuItem value="sports">Sports</MenuItem>
                <MenuItem value="music">Music</MenuItem>
                <MenuItem value="food">Food</MenuItem>
                <MenuItem value="arts">Arts</MenuItem>
                <MenuItem value="fashion">Fashion</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="tech">Tech</MenuItem>
                <MenuItem value="youth">Youth</MenuItem>
                <MenuItem value="environment">Environment</MenuItem>
                <MenuItem value="religious">Religious</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAddEvent}
              sx={{
                mt: 2,
                backgroundColor: "#39a599",
                color: "white",
                "&:hover": {
                  backgroundColor: "#2c8e80",
                },
              }}
            >
              Add Event
            </Button>
          </Box>

          <Box
            sx={{
              width: "45%",
            }}
          >
            <Box
              sx={{
                borderColor: "white",
                padding: 2,
                borderRadius: 1,
                boxShadow: 1,
                marginBottom: 2,
                maxWidth: 200,
              }}
            >
              <Typography sx={{ color: "white" }}>Existing Events</Typography>
            </Box>
            {paginatedEvents.map((event) => (
              <Box
                key={event.id}
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography sx={{ color: "white", textAlign: "left" }}>
                  {event.name}
                  <br />
                  {event.date}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor: "#43B9AB",
                    color: "white",
                    borderColor: "#43B9AB",
                    "&:hover": {
                      backgroundColor: "#39a599",
                      borderColor: "#39a599",
                    },
                  }}
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  Delete
                </Button>
              </Box>
            ))}
            <Pagination
              count={Math.ceil(events.length / eventsPerPage)}
              page={eventPage}
              onChange={(e, value) => handlePageChange(e, value, "events")}
              sx={{ mt: 2 }}
            />
          </Box>
        </Box>
      )}

      {activeTab === "notifications" && (
        <Box display="flex" justifyContent="space-between" gap={2}>
          <Box
            sx={{
              backgroundColor: "#39a599",
              padding: 2,
              borderRadius: 1,
              boxShadow: 1,
              width: "45%",
              maxWidth: 800,
              marginBottom: 10,
            }}
          >
            <Typography sx={{ color: "white" }}>Add Notification</Typography>
            <TextField
              label="Title"
              value={newNotification.title}
              onChange={(e) =>
                setNewNotification({
                  ...newNotification,
                  title: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Message"
              value={newNotification.message}
              onChange={(e) =>
                setNewNotification({
                  ...newNotification,
                  message: e.target.value,
                })
              }
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              label="Date"
              type="date"
              value={newNotification.date}
              onChange={(e) =>
                setNewNotification({ ...newNotification, date: e.target.value })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="contained"
              onClick={handleAddNotification}
              sx={{
                mt: 2,
                backgroundColor: "#39a599",
                color: "white",
                "&:hover": {
                  backgroundColor: "#2c8e80",
                },
              }}
            >
              Add Notification
            </Button>
          </Box>

          <Box
            sx={{
              width: "45%",
            }}
          >
            <Box
              sx={{
                borderColor: "white",
                padding: 2,
                borderRadius: 1,
                boxShadow: 1,
                marginBottom: 2,
                maxWidth: 200,
              }}
            >
              <Typography sx={{ color: "white" }}>
                Existing Notifications
              </Typography>
            </Box>
            {paginatedNotifications.map((notification) => (
              <Box
                key={notification.id}
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography sx={{ color: "white", textAlign: "left" }}>
                  {notification.title}
                  <br />
                  {notification.date}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor: "#43B9AB",
                    color: "white",
                    borderColor: "#43B9AB",
                    "&:hover": {
                      backgroundColor: "#39a599",
                      borderColor: "#39a599",
                    },
                  }}
                  onClick={() => handleDeleteNotification(notification.id)}
                >
                  Delete
                </Button>
              </Box>
            ))}
            <Pagination
              count={Math.ceil(notifications.length / notificationsPerPage)}
              page={notificationPage}
              onChange={(e, value) =>
                handlePageChange(e, value, "notifications")
              }
              sx={{ mt: 2 }}
            />
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default AdminDashboard;