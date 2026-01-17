import { Link } from "react-router-dom";
import React from "react";


function StudentNav() {
  return (
    <div>
      <Link to="/student/dashboard">Dashboard</Link> |{" "}
      <Link to="/events">Events</Link> |{" "}
      <Link to="/my-registrations">My Registrations</Link> |{" "}
      <Link to="/">Logout</Link>
      <hr />
    </div>
  );
}

export default StudentNav;
