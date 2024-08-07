import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css'; 

import LogoutButton from './LogoutButton';

const Navigation = () => (
  <nav className="navbar">
    <ul className="nav-links">
      <li><Link to="/profile">Profile</Link></li>
      <li><Link to="/events">Events</Link></li>
      <li><Link to="/incident-page">Incident Reports</Link></li>
      <li className="center">
        <span>The</span>
        <span>Neighbourhood</span>
        <span>Net</span>
      </li>
      <li><Link to="/community-forum">Community Forum</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><LogoutButton /></li>
    </ul>
  </nav>
);

export default Navigation;
