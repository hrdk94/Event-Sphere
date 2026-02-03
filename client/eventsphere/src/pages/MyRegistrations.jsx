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
        setRegistrations(res.data);
      } catch (err) {
        console.error("Failed to fetch registrations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100 p-6">
        <StudentNav />
        <p className="mt-8 text-zinc-400">Loading your registrations...</p>
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100 p-6">
        <StudentNav />
        <p className="mt-8 text-zinc-400">
          You have not registered for any events.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-6">
      <StudentNav />

      <div className="max-w-3xl mx-auto mt-8">
        <h2 className="text-2xl font-semibold mb-6 text-white">
          My Registrations
        </h2>

        <div className="space-y-5">
          {registrations.map((reg) => (
            <div
              key={reg._id}
              className="rounded-xl bg-zinc-800 border border-zinc-700 p-5 shadow-md"
            >
              <div className="space-y-4">
                {/* EVENT INFO */}
                <section>
                  <h3 className="text-lg font-semibold tracking-tight text-white">
                    {reg.eventId.title}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    {new Date(reg.eventId.date).toDateString()}
                  </p>

                  {reg.eventId.isCancelled && (
                    <p className="mt-1 text-sm text-red-400">
                      ❌ Event Cancelled
                    </p>
                  )}
                </section>

                <hr className="border-zinc-700" />

                {/* STATUS */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <p>
                    <span className="text-zinc-400">Registration:</span>{" "}
                    {reg.status === "pending" && (
                      <span className="text-yellow-400 ml-1">
                        Pending Approval
                      </span>
                    )}
                    {reg.status === "approved" && (
                      <span className="text-green-400 ml-1">
                        Approved
                      </span>
                    )}
                    {reg.status === "rejected" && (
                      <span className="text-red-400 ml-1">
                        Rejected
                      </span>
                    )}
                  </p>

                  <p>
                    <span className="text-zinc-400">Attendance:</span>{" "}
                    {reg.attended ? (
                      <span className="text-green-400 ml-1">
                        Attended
                      </span>
                    ) : (
                      <span className="text-zinc-400 ml-1">
                        Not Attended
                      </span>
                    )}
                  </p>
                </section>

                {/* ACTIONS */}
                <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {reg.status === "approved" &&
                  !reg.attended &&
                  !reg.eventId.isCancelled &&
                  reg.eventId.timeStatus !== "past" ? (
                    <button
                      onClick={() =>
                        navigate(`/my-registrations/${reg._id}/qr`)
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500/90 hover:bg-blue-500 text-white text-sm font-medium transition"
                    >
                      View QR Ticket
                    </button>
                  ) : (
                    <p className="text-sm text-zinc-500 italic">
                      QR not available
                    </p>
                  )}

                  <p className="text-sm">
                    <strong>Certificate:</strong>{" "}
                    {reg.certificateIssued ? (
                      <span className="text-green-400 font-medium">Issued</span>
                    ) : reg.attended ? (
                      <span className="text-yellow-400">Eligible</span>
                    ) : (
                      <span className="text-zinc-400">Not eligible</span>
                    )}
                  </p>
                </section>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyRegistrations;
