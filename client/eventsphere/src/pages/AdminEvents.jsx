import React, { useEffect, useState } from "react";
import api from "../api/axios";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch (err) {
        console.error("Approve failed", err);
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
    } catch (err) {
        console.error("Reject failed", err);
    }
    };


  if (loading) return <p>Loading events...</p>;
  if (events.length === 0) return <p>No events found.</p>;

  return (
    <div>
      <h2>All Events (Admin)</h2>

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
        <strong>Status:</strong> {event.status}
        </p>

        {event.status === "pending" && (
        <>
            <button onClick={() => handleApprove(event._id)}>
            Approve
            </button>

            <button onClick={() => handleReject(event._id)}>
            Reject
            </button>
        </>
        )}
          {/* Approve / Reject buttons come next */}
        </div>
      ))}
    </div>
  );
}

export default AdminEvents;
