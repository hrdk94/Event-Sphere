import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    participantLimit: "",
    requiresApproval: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events/create", form);
      navigate("/club/events");
    } catch (err) {
      console.error("Event creation failed", err);
    }
  };

  return (
    <div>
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} />
        <br /><br />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />
        <br /><br />

        <input type="date" name="date" onChange={handleChange} />
        <br /><br />

        <input name="venue" placeholder="Venue" onChange={handleChange} />
        <br /><br />

        <input
          type="number"
          name="participantLimit"
          placeholder="Participant Limit"
          onChange={handleChange}
        />
        <br /><br />

        <label>
          <input
            type="checkbox"
            name="requiresApproval"
            onChange={handleChange}
          />
          Requires Approval
        </label>

        <br /><br />

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
