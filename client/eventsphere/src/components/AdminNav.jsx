import { Link } from "react-router-dom";
import React from "react";

function AdminNav() {
  return (
    <div>
      <Link to="/admin/dashboard">Dashboard</Link> |{" "}
      <Link to="/admin/events">All Events</Link> |{" "}
      <Link to="/">Logout</Link>
      <hr />
    </div>
  );
}

export default AdminNav;
