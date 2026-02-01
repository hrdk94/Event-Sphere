import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import StudentNav from "../components/StudentNav";

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
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
        <StudentNav />
        <div className="max-w-4xl mx-auto p-6">
          <p className="text-zinc-400">Loading events…</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
        <StudentNav />
        <div className="max-w-4xl mx-auto p-6">
          <p className="text-zinc-400">No events available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <StudentNav />

      <div className="max-w-4xl mx-auto p-6">
        {/* Page Header */}
        <h1 className="text-2xl font-semibold text-white mb-1">
          Available Events
        </h1>
        <p className="text-zinc-400 mb-6">
          Browse upcoming approved events
        </p>

        {/* Event Cards */}
        <div className="space-y-5">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 space-y-3"
            >
              <h3 className="text-lg font-semibold text-white">
                {event.title}
              </h3>

              <p className="text-sm text-zinc-300">
                {event.description}
              </p>

              <div className="text-sm text-zinc-400 space-y-1">
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(event.date).toDateString()}
                </p>
                <p>
                  <span className="font-medium">Venue:</span>{" "}
                  {event.venue}
                </p>
                <p>
                  <span className="font-medium">Time:</span>{" "}
                  {event.timeStatus}
                </p>
              </div>

              {event.isCancelled ? (
                <p className="text-red-400 text-sm font-medium">
                  ❌ Event Cancelled
                </p>
              ) : (
                <button
                  onClick={() => navigate(`/events/${event._id}`)}
                  className="mt-3 inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-sm text-white transition"
                >
                  View Details
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;
