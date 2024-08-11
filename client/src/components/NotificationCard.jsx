import React from 'react';
import './Notifications.css';

const NotificationCard = ({ title, message, date, onDismiss }) => {
  return (
    <div className="card-container">
      <div className="card-content">
        <h3 className="title">{title}</h3>
        <p className="message">{message}</p>
        <p className="date">{new Date(date).toLocaleDateString()}</p>
      </div>
      <button className="dismiss-button" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  );
};

export default NotificationCard;
