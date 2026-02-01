import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StudentNav from "../components/StudentNav";

function StudentDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
          <p className="text-zinc-400 text-sm">Registered Events</p>
          <p className="text-2xl font-semibold text-white">X</p>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
          <p className="text-zinc-400 text-sm">Attended</p>
          <p className="text-2xl font-semibold text-white">X</p>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
          <p className="text-zinc-400 text-sm">Certificates</p>
          <p className="text-2xl font-semibold text-white">X</p>
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

