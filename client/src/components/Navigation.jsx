import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";
import homelogo from "../assets/neighbourhood-net-logo.png";

import LogoutButton from "./LogoutButton";

const Navigation = ({ notificationCount = 0 }) => (
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
        <Link to="/home">Home</Link> 
      </li>
      <li>
        <Link to="/profile">Profile</Link>
      </li>
      <li>
        <Link to="/events">Events</Link>
      </li>
      <li>
        <Link to="/incident-page">Incident Reports</Link>
      </li>
      <li>
        <Link to="/community-forum">Community Forum</Link>
      </li>
      <li>
        <Link to="/notifications">
          Notifications
          {notificationCount > 0 && (
            <span className="notification-count">{notificationCount}</span>
          )}
        </Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <LogoutButton />
      </li>
    </ul>
  </nav>
);

export default Navigation;
