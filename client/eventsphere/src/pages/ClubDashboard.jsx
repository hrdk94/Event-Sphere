import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function ClubDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  return (
    <div>
      <h2>Club Dashboard</h2>
      <p>Welcome, {user?.name || "Club Coordinator"}</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/club/events")}>
          My Events
        </button>

        <br /><br />

        <button onClick={() => navigate("/club/events/create")}>
          Create Event
        </button>

        <br /> <br />

        <button onClick={()=> {navigate("/club/scan")}}>
          Scan QR (Mark Attendance)
        </button>

        <br /><br />

        <button onClick={logout}>
          Logout
        </button>

        
      </div>
    </div>
  );
}

export default ClubDashboard;
