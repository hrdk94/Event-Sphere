import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ClubNav from "../components/ClubNav";

function ClubEventRegistrations() {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    try {
      const res = await api.get(`/club/events/${eventId}/registrations`);
      setRegistrations(res.data.registrations);
    } catch (err) {
      setError("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [eventId]);

  const handleApprove = async (id) => {
    await api.patch(`/club/registrations/${id}/approve`);
    fetchRegistrations();
  };

  const handleReject = async (id) => {
    await api.patch(`/club/registrations/${id}/reject`);
    fetchRegistrations();
  };

  if (loading) return <p>Loading registrations...</p>;
  if (error) return <p>{error}</p>;
  if (registrations.length === 0)
    return <p>No registrations yet for this event.</p>;

  return (
    <div>
      <ClubNav />
      <h2>Event Registrations</h2>
      <p>Total Registrations: {registrations.length}</p>

      {registrations.map((reg) => (
        <div
          key={reg._id}
          style={{
            border: "1px solid #ccc",
            padding: "14px",
            marginBottom: "12px",
          }}
        >
          {/* STUDENT INFO */}
          <section>
            <p>
              <strong>{reg.userId.name}</strong>
            </p>
            <p>{reg.userId.email}</p>
          </section>

          <hr />

          {/* STATUS */}
          <section>
            <p>
              <strong>Status:</strong>{" "}
              {reg.status === "pending" && "🕒 Pending"}
              {reg.status === "approved" && "✅ Approved"}
              {reg.status === "rejected" && "❌ Rejected"}
            </p>
          </section>

          {/* ACTIONS */}
          {reg.status === "pending" && (
            <section>
              <button onClick={() => handleApprove(reg._id)}>
                Approve
              </button>{" "}
              <button onClick={() => handleReject(reg._id)}>
                Reject
              </button>
            </section>
          )}
        </div>
      ))}
    </div>
  );
}

export default ClubEventRegistrations;
