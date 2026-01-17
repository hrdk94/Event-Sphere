import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function ClubEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
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

  const handleCancelEvent = async (eventId) => {
  try {
    await api.patch(`/club/events/${eventId}/cancel`);

    // update local state immediately
    setEvents((prev) =>
      prev.map((ev) =>
        ev._id === eventId ? { ...ev, isCancelled: true } : ev
      )
    );

    setMessage("Event cancelled successfully");
  } catch (err) {
    setMessage(
      err.response?.data?.message || "Failed to cancel event"
    );
  }
};


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

          {event.isCancelled ? (
            <p style ={{color: "red"}}> Event Cancelled </p>
          ):(
            <button onClick={()=> handleCancelEvent(event_.id)}>
              Cancel Events 
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default ClubEvents;
