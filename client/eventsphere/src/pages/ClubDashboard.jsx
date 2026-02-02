import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ClubNav from "../components/ClubNav";

const ClubDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [stats, setStats] = useState(null);

    useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get("/analytics/club");
      setStats(res.data);
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <ClubNav />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-white mb-1">
          Club Dashboard
        </h1>
        <p className="text-zinc-400 mb-2">
          Welcome, {user?.name || "Club Coordinator"}
        </p>
        <p className="text-zinc-400 mb-8">
          Manage your events and registrations
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <p className="text-sm text-zinc-400">My Events</p>
            <p className="text-3xl font-semibold text-white mt-2">
              {stats?.totalEvents ?? "—"}
            </p>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <p className="text-sm text-zinc-400">Total Registrations</p>
            <p className="text-3xl font-semibold text-white mt-2">
              {stats?.totalRegistrations ?? "—"}
            </p>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <p className="text-sm text-zinc-400">Attendance Marked</p>
            <p className="text-3xl font-semibold text-white mt-2">
              {stats?.attended ?? "—"}
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/club/events/create")}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-sm text-white transition"
          >
            Create Event
          </button>

          <button
            onClick={() => navigate("/club/events")}
            className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-md text-sm transition"
          >
            View My Events
          </button>

          <button
            onClick={() => navigate("/club/scan")}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md text-sm text-white transition"
          >
            Scan QR (Mark Attendance)
          </button>

          <button
            onClick={logout}
            className="ml-auto px-5 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm text-white transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClubDashboard;
