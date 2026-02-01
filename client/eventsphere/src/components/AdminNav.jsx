import { Link, useLocation } from "react-router-dom";
import React from "react";

const AdminNav = () => {
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
          <div className="text-lg font-semibold text-white">
            EventSphere Admin
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/dashboard"
              className={linkClass("/admin/dashboard")}
            >
              Dashboard
            </Link>

            <Link
              to="/admin/events"
              className={linkClass("/admin/events")}
            >
              Events
            </Link>

            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
