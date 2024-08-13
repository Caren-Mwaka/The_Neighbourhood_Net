import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import logoImage from '../assets/images/net-logo-copy.jpeg'; 
import backgroundImage from '../assets/images/landingpage.jpg'; 
import shareImage from '../assets/images/share.jpeg'; 
import protectImage from '../assets/images/protect.jpeg'; 
import engageImage from '../assets/images/engage.jpeg'; 
import foodtrucksImage from '../assets/images/foodtrucks.jpeg';
import kidsImage from '../assets/images/kids.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <>
      <div className="landing-section section" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <header className="app-bar">
          <div className="app-bar-links">
            <Link to="/contact" className="contact-link">
              <FontAwesomeIcon icon={faAddressBook} size="2x" />
              <span>CONTACT US</span>
            </Link>
            <Link to="/about">ABOUT</Link>
          </div>
          <div className="right-links">
            <Link to="/login">LOGIN</Link>
            <Link to="/register">REGISTER</Link>
          </div>
        </header>
        <div className="logo-container">
          <div className="logo-background">
            <img src={logoImage} alt="Logo" className="logo-image" />
          </div>
        </div>
      </div>
      <div className="welcome-section section ">
        
        <h1>Welcome to The Neighborhood Net</h1>
        <p>Your Local Community Watch and Engagement Platform</p>
       
        <div className="images-container">
        <div className="image-card kids">
            <img src={kidsImage} alt="Kids" />
            
          </div>
          <div className="image-card share">
            <img src={shareImage} alt="Share" />
           
          </div>
          <div className="image-card protect">
            <img src={protectImage} alt="Protect" />
            
          </div>
          <div className="image-card engage">
            <img src={engageImage} alt="Engage" />
           
          </div>
          <div className="image-card foodtrucks">
            <img src={foodtrucksImage} alt="Foodtrucks" />
            
          </div>
          </div>
          <div className="footer">
    <p>Follow us on:</p>
    <div className='socials'>
    <FaTwitter size={32} color="white" />
    <a href="https://twitter.com/neighborhoodn3t"  target="_blank" rel="noopener noreferrer">neighborhoodn3t</a>  

    
    <FaFacebook size={32} color="white" />
    <a href="https://facebook.com/theneighbourhoodnet"target="_blank" rel="noopener noreferrer">theneighbourhoodnet</a> 
    <FaInstagram size={32} color="white" /> 
    <a href="https://instagram.com/theneighbourhoodnet"target="_blank" rel="noopener noreferrer">theneighbourhoodnet</a>
    
    </div>
</div>

        </div>
      
    </>
  );
};

export default LandingPage;
