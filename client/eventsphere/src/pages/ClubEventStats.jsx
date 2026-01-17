import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ClubNav from "../components/ClubNav";

function ClubEventStats() {
  const { eventId } = useParams();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(`/stats/events/${eventId}`);
        setStats(res.data.stats);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load stats");
      }
    };

    fetchStats();
  }, [eventId]);

  if (error) return <p>{error}</p>;
  if (!stats) return <p>Loading stats...</p>;

  return (
    <div>
      <h2>Event Stats</h2>
      <ClubNav />
      <p>Total: {stats.total}</p>
      <p>Approved: {stats.approved}</p>
      <p>Pending: {stats.pending}</p>
      <p>Rejected: {stats.rejected}</p>
      <p>Attended: {stats.attended}</p>
      <p>Remaining: {stats.remaining}</p>
    </div>
  );
}

export default ClubEventStats;
