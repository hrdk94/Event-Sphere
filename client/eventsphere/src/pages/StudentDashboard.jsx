import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StudentNav from "../components/StudentNav";

function StudentDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get("/analytics/student");
      setStats(res.data);
    };

    fetchStats();
  }, []);

  return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
    <StudentNav />

    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-white mb-1">
        Student Dashboard
      </h1>
      <p className="text-zinc-400 mb-8">
        Overview of your activity on EventSphere
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
          <p className="text-sm text-zinc-400">Registrations</p>
          <p className="text-3xl font-semibold text-white mt-2">
            {stats?.totalRegistrations ?? "—"}
          </p>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
          <p className="text-sm text-zinc-400">Attended</p>
          <p className="text-3xl font-semibold text-white mt-2">
            {stats?.attended ?? "—"}
          </p>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
          <p className="text-sm text-zinc-400">Certificates Eligible</p>
          <p className="text-3xl font-semibold text-white mt-2">
            {stats?.certificatesEligible ?? "—"}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm" onClick={() => navigate("/events")}>
          Browse Events
        </button>
        <button className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-md text-sm" onClick={() => navigate("/my-registrations")}>
          My Registrations
        </button>
      </div>
    </div>
  </div>
  );
}

export default StudentDashboard;

