import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";
import homelogo from "../assets/neighbourhood-net-logo.png";
import LogoutButton from "./LogoutButton";

const Navigation = ({ notificationCount = 0 }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="homelogo-container">
        <img
          src={homelogo}
          alt="The Neighbourhood Net Logo"
          className="homelogo"
        />
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/home" state={{ from: location.pathname }}>Home</Link>
        </li>
        <li>
          <Link to="/profile" state={{ from: location.pathname }}>Profile</Link>
        </li>
        <li>
          <Link to="/events" state={{ from: location.pathname }}>Events</Link>
        </li>
        <li>
          <Link to="/incident-page" state={{ from: location.pathname }}>Incident Reports</Link>
        </li>
        <li>
          <Link to="/community-forum" state={{ from: location.pathname }}>Community Forum</Link>
        </li>
        <li>
          <Link to="/notifications" state={{ from: location.pathname }}>
            Notifications
            {notificationCount > 0 && (
              <span className="notification-count">{notificationCount}</span>
            )}
          </Link>
        </li>
        <li>
          <Link to="/about" state={{ from: location.pathname }}>About</Link>
        </li>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
