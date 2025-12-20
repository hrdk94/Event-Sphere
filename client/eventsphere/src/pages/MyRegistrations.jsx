import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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
            {reg.attended ? "Attended" : reg.status}
          </p>

          <button
            onClick={() =>
              navigate(`/my-registrations/${reg._id}/qr`)
            }
          >
            View QR Ticket
          </button>
        </div>
      ))}
    </div>
  );
}

export default MyRegistrations;
