import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        setMessage("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await api.post(`/events/${eventId}/register`);
      setMessage("Registered successfully");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <p>Loading event...</p>;
  if (!event) return <p>Event not found</p>;

  return (
    <div>
      <h2>{event.title}</h2>

      <p>{event.description}</p>

      <p>
        <strong>Date:</strong>{" "}
        {new Date(event.date).toDateString()}
      </p>

      <p>
        <strong>Venue:</strong> {event.venue}
      </p>

      <p>
        <strong>Participants limit:</strong>{" "}
        {event.participantLimit || "Unlimited"}
      </p>

      <button onClick={handleRegister} disabled={registering}>
        {registering ? "Registering..." : "Register"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default EventDetails;
