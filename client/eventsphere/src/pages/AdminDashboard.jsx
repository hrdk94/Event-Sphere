import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user?.name || "Admin"}</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/admin/events")}>
          Manage Events
        </button>

        <br /><br />

        <button onClick={() => navigate("/admin/users")}>
          Manage Users
        </button>

        <br /><br />

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
