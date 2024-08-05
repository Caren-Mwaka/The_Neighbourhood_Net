import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="container">
      <div className="content">
        <div className="logo-container">
          <img
            src="client/src/assets/neighbourhood-net-logo.png"
            alt="Neighborhood Net Logo"
            className="logo"
          />
        </div>
        <div className="description">
          <p>
          The Neighbourhood Net is a community watch application designed to empower our tight-knit community. It provides a platform to:
            <ul>
                <li>Report incidents: Quickly and easily report any suspicious activity or safety concerns.</li>
                <li>Engage in the forum: Discuss pertinent issues affecting the community, share solutions, and connect with your neighbors.</li>
                <li>RSVP for events: Stay informed about upcoming community events and easily manage your attendance.</li>
            </ul>
            We value your feedback!  Let us know how we can improve The Neighbourhood Net by sending your suggestions to theneighbourhoodnet@gmail.com.
          </p>
        </div>
        <div className="social-icons">
          <a href="https://instagram.com/theneighbourhoodnet" className="social-link">
            <FaInstagram size={32} color="white" />
            theneighbourhoodnet
          </a>
          <a href="https://twitter.com/theneighbourhoodnet" className="social-link">
            <FaTwitter size={32} color="white" />
            theneighbourhoodnet
          </a>
          <a href="https://facebook.com/theneighbourhoodnet" className="social-link">
            <FaFacebook size={32} color="white" />
            theneighbourhoodnet</a>
        </div>
      </div>
      <div className="image-container">
        <img
          src="client/src/assets/AboutImage.jpeg" 
          alt="Neighborhood view"
          className="neighborhood-image"
        />
        <div className="image-text">
            <p>THE</p> 
            <p>NEIGHBOURHOOD</p>
            <p>NET</p>
        </div>
      </div>
    </div>
  );
};

export default About;
