import React, { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDonations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/donations");
      const data = await res.json();
      setDonations(data);
    } catch (err) {
      console.error("Failed to fetch donations", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDonation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/donations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDonations((prev) => prev.filter((donation) => donation._id !== id));
      } else {
        alert("Failed to delete donation.");
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Donations</h2>

      {loading ? (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="animate-spin" /> Loading donations...
        </div>
      ) : donations.length === 0 ? (
        <p>No donations yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 shadow-sm rounded-lg">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Amount (KES)</th>
                <th className="p-3">Intent</th>
                <th className="p-3">Message</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr
                  key={donation._id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3">{donation.name}</td>
                  <td className="p-3">{donation.amount}</td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">
                      {donation.intentType} - {donation.intent}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {donation.message || "-"}
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(donation.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteDonation(donation._id)}
                      className="text-red-600 hover:text-red-800 transition"
                      disabled={deletingId === donation._id}
                    >
                      {deletingId === donation._id ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDonations;
