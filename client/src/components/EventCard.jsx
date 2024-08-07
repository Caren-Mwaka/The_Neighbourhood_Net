import React from "react";
import styles from "./EventCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

function EventCard({ id, name, date, time, location, image, onRSVP }) {
  return (
    <article className={styles.eventCard}>
      <img src={image} alt="" className={styles.eventImage} />
      <div className={styles.eventDetails}>
        <h2 className={styles.eventName}>{name}</h2>
        <div className={styles.dateWrapper}>
          <FontAwesomeIcon icon={faCalendarAlt} className={styles.dateIcon} />
          <time className={styles.date}>{date}</time>
        </div>
        <div className={styles.infoWrapper}>
          <div className={styles.timeWrapper}>
            <FontAwesomeIcon icon={faClock} className={styles.timeIcon} />
            <time className={styles.time}>{time}</time>
          </div>
          <button className={styles.rsvpButton} onClick={() => onRSVP(id)}>
            RSVP
          </button>
        </div>
        <div className={styles.locationWrapper}>
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className={styles.locationIcon}
          />
          <address className={styles.location}>{location}</address>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
