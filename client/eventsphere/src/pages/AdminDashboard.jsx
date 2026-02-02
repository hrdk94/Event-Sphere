import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminNav from "../components/AdminNav";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get("/analytics/admin");
      setStats(res.data);
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <AdminNav />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-white mb-1">
          Admin Dashboard
        </h1>
        <p className="text-zinc-400 mb-2">
          Welcome, {user?.name || "Admin"}
        </p>
        <p className="text-zinc-400 mb-8">
          Platform overview and moderation controls
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <p className="text-sm text-zinc-400">Total Events</p>
            <p className="text-3xl font-semibold text-white mt-2">
              {stats?.totalEvents ?? "—"}
            </p>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <p className="text-sm text-zinc-400">Pending Events</p>
            <p className="text-3xl font-semibold text-yellow-400 mt-2">
              {stats?.pendingEvents ?? "—"}
            </p>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <p className="text-sm text-zinc-400">Total Users</p>
            <p className="text-3xl font-semibold text-white mt-2">
              {stats?.totalUsers ?? "—"}
            </p>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <p className="text-sm text-zinc-400">Registrations</p>
            <p className="text-3xl font-semibold text-white mt-2">
              {stats?.totalRegistrations ?? "—"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/admin/events")}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-sm text-white transition"
          >
            Review Events
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-md text-sm transition"
          >
            Manage Users
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

export default AdminDashboard;
