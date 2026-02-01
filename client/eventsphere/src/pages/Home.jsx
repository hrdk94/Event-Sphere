import { useNavigate } from "react-router-dom";
import React from "react";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      {/* Top Bar */}
      <div className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">
            EventSphere
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm text-zinc-300 hover:text-white"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-sm text-white"
            >
              Register
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-white leading-tight max-w-3xl">
          A smarter way to manage and attend college events
        </h2>

        <p className="text-zinc-400 mt-6 max-w-2xl">
          EventSphere helps students register for events, clubs manage
          participation, and admins maintain complete control — all in one
          streamlined platform.
        </p>

        <div className="mt-10 flex gap-4">
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-md text-sm"
          >
            Login
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              🎓 For Students
            </h3>
            <p className="text-zinc-400 text-sm">
              Discover events, register instantly, get QR-based entry, and
              track attendance.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              🏫 For Clubs
            </h3>
            <p className="text-zinc-400 text-sm">
              Create events, approve registrations, scan QR codes, and view
              real-time stats.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              🛠 For Admins
            </h3>
            <p className="text-zinc-400 text-sm">
              Approve events, monitor platform activity, and maintain system
              integrity.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 py-6">
        <p className="text-center text-zinc-500 text-sm">
          © {new Date().getFullYear()} EventSphere. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Home;
