import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StudentDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  return (
    <div>
      <h2>Student Dashboard</h2>
      <p>Welcome, {user?.name || "Student"}</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/events")}>
          Browse Events
        </button>

        <br /><br />
        
        <button onClick={() => navigate("/my-registrations")}>
          My Registrations
        </button>

        <br /><br />

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;
