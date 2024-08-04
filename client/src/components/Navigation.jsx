import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => (
  <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/login">Login</Link></li> {/* Added Login link */}
      <li><Link to="/incident-page">Incident Page</Link></li>
    </ul>
  </nav>
);

export default Navigation;
