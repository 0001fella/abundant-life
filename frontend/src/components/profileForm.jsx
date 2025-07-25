import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { uploadFile } from "../utils/cloudinary";
import { toast } from "react-toastify";

const ProfileForm = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadFile(file); // Should return Cloudinary URL
      setProfileImage(imageUrl);
      toast.success("Avatar uploaded!");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await updateProfile({
        name,
        avatar: profileImage,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white text-black rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Update Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar */}
        <div className="text-center">
          <img
            src={profileImage || "/default-avatar.png"}
            alt="Avatar"
            className="w-24 h-24 rounded-full mx-auto object-cover mb-2 border"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mx-auto block"
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
        </div>

        {/* Name */}
        <div>
          <label className="block font-semibold mb-1">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold mb-1">Email (readonly)</label>
          <input
            type="email"
            className="w-full p-2 border rounded bg-gray-100"
            value={email}
            readOnly
          />
        </div>

        {/* Current Password (optional) */}
        <div>
          <label className="block font-semibold mb-1">Current Password (if changing)</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="•••••••"
          />
        </div>

        {/* New Password (optional) */}
        <div>
          <label className="block font-semibold mb-1">New Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
