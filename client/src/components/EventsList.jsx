import React, { useState, useEffect } from 'react';
import './EventsList.css';
import headerimage from "../assets/friends.jpg";
import { toast } from 'react-toastify';

// const baseURL = import.meta.env.VITE_BASE_URL || 'https://the-neighbourhood-net-1.onrender.com';

const defaultImages = {
  sports: "https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=600",
  music: "https://media.istockphoto.com/id/1806011581/photo/overjoyed-happy-young-people-dancing-jumping-and-singing-during-concert-of-favorite-group.jpg?s=612x612&w=0&k=20&c=cMFdhX403-yKneupEN-VWSfFdy6UWf1H0zqo6QBChP4=",
  food: "https://images.pexels.com/photos/6260616/pexels-photo-6260616.jpeg?auto=compress&cs=tinysrgb&w=600",
  arts: "https://images.pexels.com/photos/4006576/pexels-photo-4006576.jpeg?auto=compress&cs=tinysrgb&w=600",
  fashion: "https://images.pexels.com/photos/2170387/pexels-photo-2170387.jpeg?auto=compress&cs=tinysrgb&w=600",
  business: "https://images.pexels.com/photos/8349233/pexels-photo-8349233.jpeg?auto=compress&cs=tinysrgb&w=600",
  tech: "https://plus.unsplash.com/premium_photo-1661540865559-56bc639e539e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dGVjaCUyMGV2ZW50fGVufDB8fDB8fHww",
  youth: "https://images.pexels.com/photos/5935240/pexels-photo-5935240.jpeg?auto=compress&cs=tinysrgb&w=600",
  religious: "https://plus.unsplash.com/premium_photo-1702058277923-c93281398c83?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2h1cmNoJTIwZXZlbnQlMjAlMkIlMjBibGFjayUyMGNvbW11bml0eXxlbnwwfHwwfHx8MA%3D%3D",
  environment: "https://images.pexels.com/photos/4505447/pexels-photo-4505447.jpeg?auto=compress&cs=tinysrgb&w=600",
  all: 'https://images.pexels.com/photos/3611077/pexels-photo-3611077.jpeg?auto=compress&cs=tinysrgb&w=600',
};

const Event = ({ event, onRSVP }) => {
  const defaultImage = defaultImages[event.type] || defaultImages.all;
  const imageUrl = event.image_url || defaultImage;

  return (
    <div className="event-card">
      <img src={imageUrl} alt={event.name} className="event-image" />
      <div className="event-info">
        <h3>{event.name}</h3>
        <p>{event.date} - {event.time} | {event.location}</p>
        <button onClick={() => onRSVP(event.id)}>RSVP</button>
      </div>
    </div>
  );
};

const EventHeader = () => {
  return (
    <div className="header">
      <img src={headerimage} alt="Events Header" className="header-image" />
      <div className="header-text">
        <h1>"Stay Connected"</h1>
        <h1>"Join Upcoming Events"</h1>
      </div>
    </div>
  );
};

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://the-neighbourhood-net-1.onrender.com/api/events');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        let filteredEvents = data.events;

        if (category !== 'all') {
          filteredEvents = data.events.filter(event => event.type === category);
        }

        setEvents(filteredEvents);
        toast.success('Events loaded successfully'); 
      } catch (error) {
        setError('Failed to fetch events.');
        console.error('Fetch events error:', error);
        toast.error('Failed to load events'); 
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [category]);

  async function handleRSVP(eventId) {
    const token = localStorage.getItem('token'); 
    
    try {
      const response = await fetch('https://the-neighbourhood-net-1.onrender.com/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ eventId }) 
      });
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('RSVP successful:', data);
      toast.success('RSVP successful'); 
    } catch (error) {
      console.error('RSVP error:', error);
      toast.error('RSVP failed'); 
    }
  }

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(events.length / eventsPerPage);

  return (
    <div className="events-container">
      <div className="header-container">
        <EventHeader />
      </div>
      <div className="eventslist-container">
        <select className="category-filter" onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Events</option>
          <option value="sports">Sports</option>
          <option value="music">Music</option>
          <option value="food">Food</option>
          <option value="arts">Arts</option>
          <option value="fashion">Fashion</option>
          <option value="business">Business</option>
          <option value="tech">Tech</option>
          <option value="youth">Youth</option>
          <option value="environment">Environment</option>
          <option value="religious">Religious</option>
        </select>
        {loading ? <p>Loading...</p> : error ? <p>{error}</p> : currentEvents.map((event) => (
          <Event key={event.id} event={event} onRSVP={handleRSVP} />
        ))}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={i + 1 === currentPage ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsList;
