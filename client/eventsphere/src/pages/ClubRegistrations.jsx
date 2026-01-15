import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function EventRegistrations() {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await api.get(`/events/${eventId}/registrations`);
        setRegistrations(res.data.registrations);
      } catch (err) {
        console.error("Failed to fetch registrations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [eventId]);

  const handleApprove = async (regId) => {
    try {
      await api.patch(`/registrations/${regId}/approve`);
      setRegistrations((prev) =>
        prev.map((r) =>
          r._id === regId ? { ...r, status: "approved" } : r
        )
      );
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  const handleReject = async (regId) => {
    try {
      await api.patch(`/registrations/${regId}/reject`);
      setRegistrations((prev) =>
        prev.map((r) =>
          r._id === regId ? { ...r, status: "rejected" } : r
        )
      );
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  if (loading) return <p>Loading registrations...</p>;
  if (registrations.length === 0)
    return <p>No registrations yet.</p>;

  return (
    <div>
      <h2>Event Registrations</h2>

      {registrations.map((reg) => (
        <div
          key={reg._id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "12px",
          }}
        >
          <p>
            <strong>Name:</strong> {reg.userId.name}
          </p>

          <p>
            <strong>Email:</strong> {reg.userId.email}
          </p>

          <p>
            <strong>Status:</strong> {reg.status}
          </p>

          {reg.status === "pending" && (
            <>
              <button onClick={() => handleApprove(reg._id)}>
                Approve
              </button>

              <button onClick={() => handleReject(reg._id)}>
                Reject
              </button>
            </>
          )}

          <button onClick={()=>{ navigate("/club/scan")}}>
            Scan QR (Attendance)
          </button>
        </div>
      ))}
    </div>
  );
}

export default EventRegistrations;
