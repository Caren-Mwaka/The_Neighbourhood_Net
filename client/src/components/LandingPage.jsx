import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import logoImage from '../assets/images/net-logo-copy.jpeg'; 
import backgroundImage from '../assets/images/landingpage.jpg'; 
import shareImage from '../assets/images/share.jpeg'; 
import protectImage from '../assets/images/protect.jpeg'; 
import engageImage from '../assets/images/engage.jpeg'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';

const LandingPage = () => {
  return (
    <>
      <div className="landing-section section" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <header className="app-bar">
          <div className="app-bar-links">
            <Link to="/contact" className="contact-link">
              <FontAwesomeIcon icon={faAddressBook} size="2x" />
              <span>Contact Us</span>
            </Link>
            <Link to="/about">About</Link>
          </div>
          <div className="right-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </header>
        <div className="logo-container">
          <div className="logo-background">
            <img src={logoImage} alt="Logo" className="logo-image" />
          </div>
        </div>
      </div>
      <div className="welcome-section section">
        <h1>Welcome to The Neighborhood Net</h1>
        <p>Your Local Community Watch and Engagement Platform</p>
        <div className="images-container">
          <div className="image-card share">
            <img src={shareImage} alt="Share" />
            <div className="image-caption">SHARE</div>
          </div>
          <div className="image-card protect">
            <img src={protectImage} alt="Protect" />
            <div className="image-caption">PROTECT</div>
          </div>
          <div className="image-card engage">
            <img src={engageImage} alt="Engage" />
            <div className="image-caption">ENGAGE</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
