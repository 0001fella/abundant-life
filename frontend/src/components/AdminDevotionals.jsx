import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, PlusCircle } from "lucide-react";

const AdminDevotionals = () => {
  const [devotionals, setDevotionals] = useState([]);
  const [form, setForm] = useState({
    title: "",
    snippet: "",
    scripture: "",
    date: "",
    image: "",
  });

  const fetchDevotionals = async () => {
    try {
      const res = await axios.get("/api/devotionals");
      setDevotionals(res.data);
    } catch (err) {
      console.error("Failed to fetch devotionals", err);
    }
  };

  useEffect(() => {
    fetchDevotionals();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddDevotional = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/devotionals", form);
      fetchDevotionals();
      setForm({
        title: "",
        snippet: "",
        scripture: "",
        date: "",
        image: "",
      });
    } catch (err) {
      console.error("Error adding devotional", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this devotional?")) return;
    try {
      await axios.delete(`/api/devotionals/${id}`);
      setDevotionals(devotionals.filter((dev) => dev._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Admin: Devotionals</h1>

      {/* Add Devotional Form */}
      <form 
        onSubmit={handleAddDevotional}
        className="bg-white p-6 border border-gray-200 rounded-lg mb-10 shadow-sm space-y-4"
      >
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Add New Devotional</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="snippet"
          placeholder="Snippet"
          value={form.snippet}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="scripture"
          placeholder="Scripture (e.g., John 3:16)"
          value={form.scripture}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={18} /> Add Devotional
        </button>
      </form>

      {/* Devotionals List */}
      <div className="space-y-4">
        {devotionals.length === 0 ? (
          <p className="text-gray-500">No devotionals found.</p>
        ) : (
          devotionals.map((dev) => (
            <div
              key={dev._id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold text-blue-800">{dev.title}</h3>
                <p className="text-sm text-gray-600">{dev.snippet}</p>
                <p className="text-sm text-blue-600">{dev.scripture}</p>
                <p className="text-xs text-gray-400">{new Date(dev.date).toDateString()}</p>
              </div>
              <button
                onClick={() => handleDelete(dev._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDevotionals;
