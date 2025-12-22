import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function ClubEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events/club/mine");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch club events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading your events...</p>;
  if (events.length === 0) return <p>You haven’t created any events yet.</p>;

  return (
    <div>
      <h2>My Events</h2>

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

          <p>
            <strong>Status:</strong> {event.status}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(event.date).toDateString()}
          </p>

          <button
            onClick={() =>
              navigate(`/club/events/${event._id}/registrations`)
            }
          >
            View Registrations
          </button>
        </div>
      ))}
    </div>
  );
}

export default ClubEvents;
