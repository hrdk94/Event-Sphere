import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import StudentNav from "../components/StudentNav";

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await api.get("/registrations/mine");
        setRegistrations(res.data); // backend returns ARRAY
      } catch (err) {
        console.error("Failed to fetch registrations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) {
    return <p>Loading your registrations...</p>;
  }

  if (registrations.length === 0) {
    return <p>You have not registered for any events.</p>;
  }

  return (
    <div>
      <StudentNav />
      <h2>My Registrations</h2>

      {registrations.map((reg) => (
        <div
          key={reg._id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "12px",
          }}
        >
          <h3>{reg.eventId.title}</h3>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(reg.eventId.date).toDateString()}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {reg.status === "pending" && "Pending Approval"}
            {reg.status === "approved" && "Approved"}
            {reg.status === "rejected" && "Rejected"}
          </p>

          <p>
            <strong>Attendance:</strong>{" "}
            {reg.attended ? " Attended" : " Not Attended"}
          </p>

          {reg.eventId.isCancelled && (
            <p style={{ color: "red" }}>Event Cancelled</p>
          )}

          <p>
            <strong>Status:</strong>{" "}
            {reg.attended ? "Attended" : reg.status}
          </p>

          {reg.status === "approved" &&
            !reg.attended &&
            !reg.eventId.isCancelled &&
            reg.eventId.timeStatus !== "past" ? (
              <button
                onClick={() =>
                  navigate(`/my-registrations/${reg._id}/qr`)
                }
              >
                View QR Ticket
              </button>
            ) : (
              <p>QR not available</p>
            )}

            <p>
              <strong>Certificate:</strong>{" "}
              {reg.certificateIssued
                ? "Issued"
                : reg.attended
                ? "Eligible"
                : "Not Eligible"}
            </p>

        </div>
      ))}
    </div>
  );
}

export default MyRegistrations;
