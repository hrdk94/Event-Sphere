import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (events.length === 0) {
    return <p>No events available.</p>;
  }

  return (
    <div>
      <h2>Available Events</h2>

      {events.map((event) => (
        <div
          key={event._id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "12px",
          }}
        >
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(event.date).toDateString()}
          </p>
          <p>
            <strong>Venue:</strong> {event.venue}
          </p>

          {/* View Details comes next phase */}
          <button onClick={()=>navigate(`/events/${event._id}`)}>View Details </button>
        </div>
      ))}
    </div>
  );
}

export default Events;
