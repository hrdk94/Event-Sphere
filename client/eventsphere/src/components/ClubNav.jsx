import { Link } from "react-router-dom";
import React from "react";

function ClubNav() {
  return (
    <div>
      <Link to="/club/dashboard">Dashboard</Link> |{" "}
      <Link to="/club/events">My Events</Link> |{" "}
      <Link to="/club/scan">Scan QR</Link> |{" "}
      <Link to="/">Logout</Link>
      <hr />
    </div>
  );
}

export default ClubNav;
