import React, { useState, useEffect } from 'react';
import './HomePage.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faShieldAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import photo1 from '../assets/events.jpg';
import photo2 from '../assets/middlephoto.jpg';
import photo3 from '../assets/teamphoto2.jpg';

const HomePage = () => {
  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    const toggleCards = () => {
      setCardIndex((prevIndex) => (prevIndex + 1) % 3);
    };

    const intervalId = setInterval(toggleCards, 600000);

    return () => clearInterval(intervalId);
  }, []);

  const cardImages = [photo1, photo2, photo3];
  const cardTitles = ['Engage', 'Protect', 'Team'];

  return (
    <div className="homepage">
      <div className="frame">
        <div className="cards-container">
          {cardImages.map((image, index) => (
            <div
              key={index}
              className={`card ${cardIndex === index ? 'card-top' : 'card-back'}`}
            >
              <img src={image} alt={`photo${index + 1}`} className="card-image" />
            </div>
          ))}
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
