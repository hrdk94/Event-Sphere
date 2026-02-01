import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ClubNav from "../components/ClubNav";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    participantLimit: "",
    requiresApproval: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/events/create", {
        ...form,
        participantLimit:
          form.participantLimit === ""
            ? null
            : Number(form.participantLimit),
      });
      navigate("/club/events");
    } catch (err) {
      console.error("Event creation failed", err);
      setMessage(
        err.response?.data?.message || "Failed to create event"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <ClubNav />

      <div className="max-w-3xl mx-auto p-6">
        {/* Page Header */}
        <h1 className="text-2xl font-semibold text-white mb-1">
          Create New Event
        </h1>
        <p className="text-zinc-400 mb-8">
          Fill in the details below to publish a new event
        </p>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 space-y-6"
        >
          {/* Event Title */}
          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Hackathon 2026"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the event, rules, and expectations"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Event Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Venue
              </label>
              <input
                type="text"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                placeholder="Auditorium / Lab / Online"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-sm text-white"
              />
            </div>
          </div>

          {/* Capacity & Approval */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Participant Limit
              </label>
              <input
                type="number"
                name="participantLimit"
                value={form.participantLimit}
                onChange={handleChange}
                placeholder="Leave empty for unlimited"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Registration Approval
              </label>
              <select
                name="requiresApproval"
                value={form.requiresApproval ? "manual" : "auto"}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    requiresApproval:
                      e.target.value === "manual",
                  }))
                }
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-sm text-zinc-300"
              >
                <option value="auto">
                  Auto approve registrations
                </option>
                <option value="manual">
                  Require manual approval
                </option>
              </select>
            </div>
          </div>

          {message && (
            <p className="text-sm text-red-400">{message}</p>
          )}

          {/* Submit */}
          <div className="pt-4 border-t border-zinc-700 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md text-sm text-white transition ${
                loading
                  ? "bg-zinc-600 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
