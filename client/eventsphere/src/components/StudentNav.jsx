import { Link, useLocation } from "react-router-dom";
import React from "react";

function StudentNav() {
  const location = useLocation();

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      location.pathname === path
        ? "bg-zinc-700 text-white"
        : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
    }`;

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo / App Name */}
          <div className="text-lg font-semibold text-white">
            EventSphere
          </div>

          {/* Links */}
          <div className="flex items-center gap-2">
            <Link to="/student/dashboard" className={linkClass("/student/dashboard")}>
              Dashboard
            </Link>
            <Link to="/events" className={linkClass("/events")}>
              Events
            </Link>
            <Link to="/my-registrations" className={linkClass("/my-registrations")}>
              My Registrations
            </Link>
            <Link to="/logout" className="px-3 py-2 text-sm text-red-400 hover:text-red-300">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default StudentNav;
