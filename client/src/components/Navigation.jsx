import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css'; 
const Navigation = () => (
  <nav className="navbar">
    <ul className="nav-links">
      <li><Link to="/profile">Profile</Link></li>
      <li><Link to="/events">Events</Link></li>
      <li><Link to="/incident-reports">Incident Reports</Link></li>
      <li className="center">
        <span>The</span>
        <span>Neighbourhood</span>
        <span>Net</span>
      </li>
      <li><Link to="/community-forum">Community Forum</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><button className="logout-button">Logout</button></li>
    </ul>
  </nav>
);

export default Navigation;
