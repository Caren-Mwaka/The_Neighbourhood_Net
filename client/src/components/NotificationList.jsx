import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import NotificationCard from './NotificationCard';

const NotificationList = () => {
  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5555/notifications');
        const data = await response.json();
        setNotificationList(data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDismiss = (index) => {
    const newNotifications = notificationList.filter((_, i) => i !== index);
    setNotificationList(newNotifications);
  };

  return (
    <Grid container spacing={2}>
      {notificationList.map((notification, index) => (
        <NotificationCard
          key={index}
          title={notification.title}
          message={notification.message}
          date={notification.date}
          onDismiss={() => handleDismiss(index)}
        />
      ))}
    </Grid>
  );
};

export default NotificationList;