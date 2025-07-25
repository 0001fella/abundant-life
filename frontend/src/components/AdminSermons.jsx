import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const initialForm = {
  title: "",
  speaker: "",
  date: "",
  description: "",
  videoFile: null,
  audioFile: null,
  imageFile: null,
};

const AdminSermons = () => {
  const [sermons, setSermons] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadPreviews, setUploadPreviews] = useState({
    video: null,
    audio: null,
    image: null,
  });

  // Fetch sermons list
  const fetchSermons = async () => {
    try {
      const res = await axios.get("/sermons");
      setSermons(res.data);
    } catch {
      toast.error("Failed to load sermons.");
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  // Controlled text inputs
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle file inputs + previews
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files.length) return;

    const file = files[0];
    setForm((prev) => ({ ...prev, [`${name}File`]: file }));

    // Preview for image, video, audio
    const url = URL.createObjectURL(file);
    setUploadPreviews((prev) => ({ ...prev, [name]: url }));
  };

  // Reset form & previews
  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setUploadPreviews({ video: null, audio: null, image: null });
  };

  // Submit create or update with file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use FormData for multipart upload
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("speaker", form.speaker);
      formData.append("date", form.date);
      formData.append("description", form.description);

      if (form.videoFile) formData.append("videoFile", form.videoFile);
      if (form.audioFile) formData.append("audioFile", form.audioFile);
      if (form.imageFile) formData.append("imageFile", form.imageFile);

      if (editingId) {
        await axios.put(`/sermons/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Sermon updated");
      } else {
        await axios.post("/sermons", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Sermon created");
      }
      resetForm();
      fetchSermons();
    } catch (err) {
      toast.error("Failed to save sermon");
    } finally {
      setLoading(false);
    }
  };

  // Load sermon data for editing, reset previews to URLs from API response
  const handleEdit = (sermon) => {
    setEditingId(sermon._id);
    setForm({
      title: sermon.title,
      speaker: sermon.speaker,
      date: sermon.date.slice(0, 10), // format yyyy-mm-dd
      description: sermon.description || "",
      videoFile: null,
      audioFile: null,
      imageFile: null,
    });

    setUploadPreviews({
      video: sermon.videoUrl || null,
      audio: sermon.audioUrl || null,
      image: sermon.image || null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sermon?")) return;
    try {
      await axios.delete(`/sermons/${id}`);
      toast.success("Sermon deleted");
      fetchSermons();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">🗣️ Manage Sermons</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-10 space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="speaker"
          placeholder="Speaker"
          value={form.speaker}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* File inputs with previews */}
        <div>
          <label className="block mb-1 font-semibold">Video File</label>
          <input type="file" accept="video/*" name="video" onChange={handleFileChange} />
          {uploadPreviews.video && (
            <video controls src={uploadPreviews.video} className="mt-2 max-h-40 rounded" />
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Audio File</label>
          <input type="file" accept="audio/*" name="audio" onChange={handleFileChange} />
          {uploadPreviews.audio && (
            <audio controls src={uploadPreviews.audio} className="mt-2 w-full" />
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Image File</label>
          <input type="file" accept="image/*" name="image" onChange={handleFileChange} />
          {uploadPreviews.image && (
            <img src={uploadPreviews.image} alt="Preview" className="mt-2 max-h-40 rounded" />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : editingId ? "Update" : "Create"} Sermon
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="grid md:grid-cols-2 gap-6">
        {sermons.map((s) => (
          <div key={s._id} className="bg-white rounded shadow p-4 border border-gray-200">
            {s.image && <img src={s.image} alt={s.title} className="w-full h-40 object-cover rounded mb-2" />}
            <h2 className="text-lg font-semibold">{s.title}</h2>
            <p className="text-sm text-gray-600">{s.speaker} - {new Date(s.date).toLocaleDateString()}</p>
            <p className="text-sm my-2">{s.description}</p>
            <div className="flex gap-4 mt-2">
              {s.videoUrl && (
                <a href={s.videoUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">
                  🎥 Watch
                </a>
              )}
              {s.audioUrl && (
                <a href={s.audioUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">
                  🔊 Listen
                </a>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleEdit(s)}
                className="text-yellow-600 font-medium hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s._id)}
                className="text-red-600 font-medium hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSermons;
