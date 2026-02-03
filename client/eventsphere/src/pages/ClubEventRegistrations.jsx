import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ClubNav from "../components/ClubNav";

function ClubEventRegistrations() {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");

  const fetchRegistrations = async () => {
    try {
      const res = await api.get(`/club/events/${eventId}/registrations`);
      setRegistrations(res.data.registrations);
    } catch (err) {
      setError("Failed to load registrations");
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

  if (error) return <p>{error}</p>;

  return (
    <div>
      <ClubNav />
      <h2>Registrations</h2>

      {registrations.map((reg) => (
        <div key={reg._id} style={{ border: "1px solid #ccc", margin: 8 }}>
          <p>{reg.userId.name} ({reg.userId.email})</p>
          <p>Status: {reg.status}</p>

          {reg.status === "pending" && (
            <>
              <button onClick={() => handleApprove(reg._id)}>Approve</button>
              <button onClick={() => handleReject(reg._id)}>Reject</button>
            </>
          )}
        </div>
      ))}

      {reg.attended && !reg.certificateIssued && (
        <button
          onClick={() => issueCertificate(reg._id)}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-md text-sm text-white"
        >
          Issue Certificate
        </button>
      )}

      {reg.certificateIssued && (
        <span className="text-green-400 text-sm font-medium">
          Certificate Issued
        </span>
      )}
    </div>
  );
}

export default ClubEventRegistrations;
