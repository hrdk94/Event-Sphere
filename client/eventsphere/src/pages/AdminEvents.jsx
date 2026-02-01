import React, { useEffect, useState } from "react";
import api from "../api/axios";
import AdminNav from "../components/AdminNav";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events/admin/all");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/events/admin/${id}/approve`);
      setEvents((prev) =>
        prev.map((e) =>
          e._id === id ? { ...e, status: "approved" } : e
        )
      );
      setMessage("Event approved successfully");
    } catch (err) {
      console.error("Approve failed", err);
      setMessage("Failed to approve event");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/events/admin/${id}/reject`);
      setEvents((prev) =>
        prev.map((e) =>
          e._id === id ? { ...e, status: "rejected" } : e
        )
      );
      setMessage("Event rejected");
    } catch (err) {
      console.error("Reject failed", err);
      setMessage("Failed to reject event");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <AdminNav />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-white mb-1">
          Event Moderation
        </h1>
        <p className="text-zinc-400 mb-6">
          Review and approve events created by clubs
        </p>

        {message && (
          <p className="mb-4 text-sm text-emerald-400">
            {message}
          </p>
        )}

        {loading && (
          <p className="text-zinc-400">Loading events…</p>
        )}

        {!loading && events.length === 0 && (
          <p className="text-zinc-400">No events found.</p>
        )}

        <div className="space-y-5">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {event.title}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Created by {event.clubName || "Club"}
                  </p>
                </div>

                <span
                  className={`text-sm font-medium ${
                    event.status === "approved"
                      ? "text-green-400"
                      : event.status === "rejected"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {event.status}
                </span>
              </div>

              <p className="text-sm text-zinc-300 mt-3">
                {event.description}
              </p>

              <p className="text-sm text-zinc-400 mt-2">
                Date:{" "}
                {new Date(event.date).toDateString()}
              </p>

              {event.status === "pending" && (
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() =>
                      handleApprove(event._id)
                    }
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md text-sm text-white"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleReject(event._id)
                    }
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-sm text-white"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;
