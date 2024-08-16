import React, { useState, useEffect } from 'react';
import NotificationCard from './NotificationCard';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Notifications.css';

const NotificationList = () => {
  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/notifications`);
        const data = await response.json();
        console.log('Fetched Notifications:', data.notifications);
        setNotificationList(data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Error fetching notifications.');
      }
    };

    fetchNotifications();
  }, []);

  const handleDismiss = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      setNotificationList(notificationList.filter(notification => notification.id !== id));
      toast.success('Notification dismissed.');
    } catch (error) {
      console.error('Error dismissing notification:', error);
      toast.error('Error dismissing notification.');
    }
  };

  return (
    <div>

      <div className="notification-list-container">
        {notificationList.map((notification) => (
          <NotificationCard
            key={notification.id}
            title={notification.title}
            message={notification.message}
            date={notification.date}
            onDismiss={() => handleDismiss(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
