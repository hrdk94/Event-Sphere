import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import StudentNav from "../components/StudentNav";

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
      const res = await api.post(`/events/${eventId}/register`);
      setMessage("✅ Registered successfully!");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
        <StudentNav />
        <div className="max-w-3xl mx-auto p-6 text-zinc-400">
          Loading event details…
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
        <StudentNav />
        <div className="max-w-3xl mx-auto p-6 text-red-400">
          {message || "Event not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <StudentNav />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-white mb-2">
          {event.title}
        </h1>

        <p className="text-zinc-400 mb-6">
          Detailed information about this event
        </p>

        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 space-y-4">
          <p className="text-zinc-300">{event.description}</p>

          <div className="text-sm text-zinc-400 space-y-1">
            <p>📍 <span className="font-medium">Venue:</span> {event.venue}</p>
            <p>📅 <span className="font-medium">Date:</span> {new Date(event.date).toDateString()}</p>
            <p>⏰ <span className="font-medium">Time:</span> {event.timeStatus}</p>
          </div>

          {event.isCancelled ? (
            <p className="text-red-400 font-medium">
              ❌ This event has been cancelled
            </p>
          ) : (
            <button
              onClick={handleRegister}
              disabled={registering}
              className="mt-4 px-5 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 rounded-md text-sm text-white transition"
            >
              {registering ? "Registering…" : "Register for Event"}
            </button>
          )}

          {message && (
            <p className="text-sm mt-2 text-zinc-300">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
