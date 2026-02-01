import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ClubNav from "../components/ClubNav";

const ClubEvents = () => {
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

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <ClubNav />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-white mb-1">
          My Events
        </h1>
        <p className="text-zinc-400 mb-6">
          Manage all events created by your club
        </p>

        {message && (
          <p className="mb-4 text-sm text-emerald-400">
            {message}
          </p>
        )}

        {loading && <p className="text-zinc-400">Loading your events…</p>}

        {!loading && events.length === 0 && (
          <p className="text-zinc-400">
            You haven’t created any events yet.
          </p>
        )}

        <div className="grid grid-cols-1 gap-5">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 space-y-3"
            >
              <h3 className="text-lg font-semibold text-white">
                {event.title}
              </h3>

              <div className="text-sm text-zinc-400 space-y-1">
                <p>
                  Date: {new Date(event.date).toDateString()}
                </p>
                <p>
                  Status:{" "}
                  <span className="font-medium">
                    {event.status}
                  </span>
                </p>
                <p>Time: {event.timeStatus}</p>
              </div>

              {event.isCancelled && (
                <p className="text-red-400 text-sm font-medium">
                  ❌ Event Cancelled
                </p>
              )}

              <div className="flex flex-wrap gap-3 pt-3">
                {event.status === "approved" && (
                  <>
                    <button
                      onClick={() =>
                        navigate(
                          `/club/events/${event._id}/registrations`
                        )
                      }
                      className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-md text-sm"
                    >
                      View Registrations
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/club/events/${event._id}/stats`
                        )
                      }
                      className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-md text-sm"
                    >
                      View Stats
                    </button>
                  </>
                )}

                {!event.isCancelled && (
                  <button
                    onClick={() =>
                      handleCancelEvent(event._id)
                    }
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-sm text-white"
                  >
                    Cancel Event
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubEvents;
