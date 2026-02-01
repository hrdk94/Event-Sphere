import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ClubNav from "../components/ClubNav";

const EventRegistrations = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await api.get(
          `/events/${eventId}/registrations`
        );
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

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <ClubNav />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-white mb-6">
          Event Registrations
        </h1>

        {loading && (
          <p className="text-zinc-400">
            Loading registrations…
          </p>
        )}

        {!loading && registrations.length === 0 && (
          <p className="text-zinc-400">
            No registrations yet.
          </p>
        )}

        <div className="space-y-4">
          {registrations.map((reg) => (
            <div
              key={reg._id}
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">
                    {reg.userId.name}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {reg.userId.email}
                  </p>
                </div>

                <span
                  className={`text-sm font-medium ${
                    reg.status === "approved"
                      ? "text-green-400"
                      : reg.status === "rejected"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {reg.status}
                </span>
              </div>

              {reg.status === "pending" && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleApprove(reg._id)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md text-sm text-white"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(reg._id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-sm text-white"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate("/club/scan")}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-sm text-white"
          >
            Scan QR (Mark Attendance)
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrations;
