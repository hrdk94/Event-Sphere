import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ClubNav from "../components/ClubNav";

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

      // Update UI immediately
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
      <ClubNav />
      <h2>My Events</h2>

      {message && <p>{message}</p>}

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
            <strong>Approval Status:</strong> {event.status}
          </p>

          <p>
            <strong>Time Status:</strong> {event.timeStatus}
          </p>

          {event.isCancelled && (
            <p style={{ color: "red" }}>❌ Event Cancelled</p>
          )}

          <p>
            <strong>Date:</strong>{" "}
            {new Date(event.date).toDateString()}
          </p>

          {/* Actions */}
          {event.status === "approved" && !event.isCancelled && (
            <>
              <button
                onClick={() =>
                  navigate(`/club/events/${event._id}/registrations`)
                }
              >
                View Registrations
              </button>{" "}
              <button
                onClick={() =>
                  navigate(`/club/events/${event._id}/stats`)
                }
              >
                View Stats
              </button>
            </>
          )}

          <br /><br />

          {event.isCancelled ? (
            <p style={{ color: "red" }}>
              No actions available (event cancelled)
            </p>
          ) : (
            <button
              onClick={() => handleCancelEvent(event._id)}
              style={{ color: "red" }}
            >
              Cancel Event
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default ClubEvents;
