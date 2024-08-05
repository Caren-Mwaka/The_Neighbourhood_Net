
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import logoImage from './assets/images/logo.jpeg'; // Correct path to your logo
import backgroundImage from './assets/images/landingpage.jpg'; // Correct path to your background image
import shareImage from './assets/images/share.jpeg'; // Correct path to your share image
import protectImage from './assets/images/protect.jpeg'; // Correct path to your protect image
import engageImage from './assets/images/engage.jpeg'; // Correct path to your engage image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';

const LandingPage = () => {
  return (
    <>
      <div className="section landing-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <header className="app-bar">
          <div className="app-bar-links">
            <a href="#contact" className="contact-link">
              <FontAwesomeIcon icon={faAddressBook} size="2x" />
              <span>CONTACT US</span>
            </a>
            <a href="#about">ABOUT</a>
          </div>
          <div className="right-links">
            <Link to="/login">Login</Link>
            <a href="#login">LOGIN</a>
            <Link to="/register">REGISTER</Link>
          </div>
        </header>
        <img src={logoImage} alt="Logo" className="logo" />
      </div>
      <div className="section welcome-section">
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