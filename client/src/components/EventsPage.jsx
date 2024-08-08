import React, { useState } from "react";
import styles from "./EventsPage.module.css";
import EventCard from "./EventCard";
import CategorySelector from "./CategorySelector";

const events = [
  {
    id: 1,
    name: "Summer Sports Festival",
    date: "06-08-2024",
    time: "10:00 AM",
    location: "Uhuru Park",
    image:
      "https://cdn6.aptoide.com/imgs/2/4/5/24549900ead082dcfc90c1eb5b60af27_fgraphic.jpg",
    category: "sports",
  },
  {
    id: 2,
    name: "Jazz in the Park",
    date: "06-08-2024",
    time: "10:00 AM",
    location: "Uhuru Park",
    image:
      "https://media.istockphoto.com/id/1806011581/photo/overjoyed-happy-young-people-dancing-jumping-and-singing-during-concert-of-favorite-group.jpg?s=612x612&w=0&k=20&c=cMFdhX403-yKneupEN-VWSfFdy6UWf1H0zqo6QBChP4=",
    category: "music",
  },
  {
    id: 3,
    name: "Green Earth Day",
    date: "06-08-2024",
    time: "10:00 AM",
    location: "Uhuru Park",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4sYm6HtpHxbzHGRfESNeGYoj7i36aIVBrxg&s",
    category: "environment",
  },
  {
    id: 4,
    name: "Food Truck Festival",
    date: "06-08-2024",
    time: "10:00 AM",
    location: "Uhuru Park",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGeizIb4WYkhj5c-Dj7kx4FA61jvVxSDUYPA&s",
    category: "food",
  },
];

function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events.filter((event) => event.category === selectedCategory);

  const handleRSVP = (eventId) => {
    const username = "yourUsername"; // Replace with actual username from your authentication context or state
    fetch("/rsvp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventId, username }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle success response
        console.log("RSVP successful:", data);
      })
      .catch((error) => {
        // Handle error response
        console.error("Error RSVPing:", error);
      });
  };

  return (
    <div className={styles.eventsPage}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ea1fe647282f77997e35001178982703722a10af9fbda8feb6bdd7ac33d4b96c?apiKey=18e91d582d434d61992da9a14b8d63ba&&apiKey=18e91d582d434d61992da9a14b8d63ba"
            alt=""
            className={styles.heroImage}
          />
          <h1 className={styles.heroTitle}>
            <span>
              {" "}
              "Stay Connected," <br /> "Join Upcoming Events."
            </span>
          </h1>
        </div>
      </header>
      <main className={styles.eventList}>
        <section className={styles.eventListContent}>
          <CategorySelector
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          {filteredEvents.map((event) => (
            <EventCard key={event.id} {...event} onRSVP={handleRSVP} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default EventsPage;
