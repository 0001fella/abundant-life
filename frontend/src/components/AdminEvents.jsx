import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/events"; // adjust if deployed

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_URL);
      setEvents(res.data);
    } catch (err) {
      toast.error("Failed to fetch events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add or update
  const onSubmit = async (data) => {
    try {
      if (editingEvent) {
        await axios.put(`${API_URL}/${editingEvent._id}`, data);
        toast.success("Event updated");
      } else {
        await axios.post(API_URL, data);
        toast.success("Event created");
      }
      reset();
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      toast.error("Failed to save event");
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Edit event
  const startEdit = (event) => {
    setEditingEvent(event);
    reset(event);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Manage Events</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded-lg p-6 mb-10 max-w-xl"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingEvent ? "Edit Event" : "Add New Event"}
        </h2>

        <input {...register("title", { required: true })} placeholder="Title" className="w-full mb-3 p-2 border rounded" />
        <input {...register("date", { required: true })} placeholder="Date (e.g., July 20, 2025)" className="w-full mb-3 p-2 border rounded" />
        <input {...register("time")} placeholder="Time (e.g., 10:00 AM)" className="w-full mb-3 p-2 border rounded" />
        <input {...register("location")} placeholder="Location" className="w-full mb-3 p-2 border rounded" />
        <input {...register("image")} placeholder="Image URL" className="w-full mb-3 p-2 border rounded" />
        <textarea {...register("description")} placeholder="Description" className="w-full mb-3 p-2 border rounded" />

        <div className="flex gap-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingEvent ? "Update" : "Create"}
          </button>
          {editingEvent && (
            <button type="button" onClick={() => { setEditingEvent(null); reset(); }} className="text-red-500">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Event list */}
      <div className="grid md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event._id} className="bg-white p-4 shadow rounded-lg">
            <h3 className="font-bold text-xl">{event.title}</h3>
            <p>{event.date} • {event.time}</p>
            <p className="text-sm text-gray-600">{event.location}</p>
            <p className="mt-2 text-gray-700">{event.description}</p>
            {event.image && (
              <img src={event.image} alt={event.title} className="mt-2 h-32 w-full object-cover rounded" />
            )}
            <div className="mt-4 flex gap-3">
              <button onClick={() => startEdit(event)} className="text-blue-600 font-medium">Edit</button>
              <button onClick={() => deleteEvent(event._id)} className="text-red-600 font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEvents;
