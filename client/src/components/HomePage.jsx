import React from 'react';
import './HomePage.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faShieldAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/neighbourhood-net-logo.png';
import photo1 from '../assets/events.jpg';
import photo2 from '../assets/middlephoto.jpg';
import photo3 from '../assets/teamphoto2.jpg';

const Card = ({ imageSrc }) => (
  <div className="card">
    <img src={imageSrc} alt="Card Image" className="card-image" />
  </div>
);

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="frame">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="cards-container">
          <Card imageSrc={photo1} />
          <Card imageSrc={photo2} />
          <Card imageSrc={photo3} />
        </div>
      </div>
      <div className="bottom-frames">
        <div className="bottom-frame">
          <FontAwesomeIcon icon={faUsers} className="bottom-frame-icon" />
          <div className="bottom-frame-title">ENGAGE</div>
          <div className="bottom-frame-text">Connect with your neighbors and stay informed about local events.</div>
        </div>
        <div className="bottom-frame">
          <FontAwesomeIcon icon={faShieldAlt} className="bottom-frame-icon" />
          <div className="bottom-frame-title">SECURE</div>
          <div className="bottom-frame-text">Together, we ensure a safer and stronger neighborhood.</div>
        </div>
        <div className="bottom-frame">
          <FontAwesomeIcon icon={faExclamationCircle} className="bottom-frame-icon" />
          <div className="bottom-frame-title">PROTECT</div>
          <div className="bottom-frame-text">Easily report incidents and concerns to enhance community safety.</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
