import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Heart, Plus, X } from 'lucide-react';

const PrayerRequests = () => {
  // Use environment variable for API base URL, fallback to localhost for development
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const appId = import.meta.env.VITE_APP_ID || 'default-app-id'; // Ensure appId is defined

  const [prayers, setPrayers] = useState([]);
  const [formData, setFormData] = useState({ name: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingPrayers, setLoadingPrayers] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  // Fetch prayer requests
  const fetchPrayers = async () => {
    try {
      // FIXED ERROR: Use apiBaseUrl instead of hardcoded localhost
      const response = await fetch(`${apiBaseUrl}/api/prayers?appId=${appId}`);
      if (!response.ok) throw new Error('Failed to fetch prayers');
      const data = await response.json();
      setPrayers(data);
      setLoadingPrayers(false);
    } catch (error) {
      console.error("Error fetching prayers:", error);
      setLoadingPrayers(false);
      // Optionally, set an error state to display to the user
      // setErrorState("Failed to load prayer requests. Please try again later.");
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchPrayers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;
    setIsSubmitting(true);
    try {
      // FIXED ERROR: Use apiBaseUrl instead of hardcoded localhost
      const response = await fetch(`${apiBaseUrl}/api/prayers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          appId, // Include appId in the request body
          name: formData.name.trim() || "Anonymous"
        }),
      });
      if (!response.ok) throw new Error('Submission failed');
      setFormData({ name: "", text: "" });
      setSuccessMessage(true);
      setShowForm(false);
      fetchPrayers(); // Refresh the list
      setTimeout(() => setSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Error adding prayer request:", error);
      // Optionally, set an error state to display to the user
      // setErrorState("Failed to submit prayer request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePray = async (prayerId) => {
    try {
      // FIXED ERROR: Use apiBaseUrl instead of hardcoded localhost
      const response = await fetch(`${apiBaseUrl}/api/prayers/${prayerId}/pray`, {
        method: 'PATCH'
      });
      if (!response.ok) throw new Error('Prayer update failed');

      // Update local state instead of refetching all prayers
      setPrayers(prayers.map(prayer =>
        prayer._id === prayerId
          ? { ...prayer, prayerCount: (prayer.prayerCount || 0) + 1 }
          : prayer
      ));
    } catch (error) {
      console.error("Error updating prayer count:", error);
      // Optionally, set an error state to display to the user
      // setErrorState("Failed to record your prayer. Please try again.");
    }
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  // Filter and sort prayers
  const filteredPrayers = prayers
    .filter(prayer => {
      const matchesSearch = prayer.request.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           prayer.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first

  const displayedPrayers = filteredPrayers.slice(0, visibleCount);

  if (loadingPrayers) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading prayer requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Prayer Requests</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your prayer needs with our community. We believe in the power of prayer and are here to support you.
          </p>
        </motion.div>

        {/* Search and Add Prayer Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full sm:w-auto flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search prayers or names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Prayer Request
          </motion.button>
        </div>

        {/* Prayer Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
              >
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit a Prayer Request</h2>
                {successMessage ? (
                  <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-4">
                    <p className="font-medium">Prayer request submitted successfully!</p>
                    <p className="text-sm mt-1">Thank you for sharing with our community.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                        Prayer Request *
                      </label>
                      <textarea
                        id="text"
                        name="text"
                        rows={4}
                        required
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Share your prayer request..."
                      ></textarea>
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Prayer'}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prayer Requests List */}
        <div className="space-y-6">
          {displayedPrayers.length > 0 ? (
            displayedPrayers.map((prayer) => (
              <motion.div
                key={prayer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{prayer.name}</h3>
                        <span className="text-xs text-gray-500">
                          {new Date(prayer.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700">{prayer.request}</p>
                      <div className="mt-4 flex items-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePray(prayer._id)}
                          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Pray ({prayer.prayerCount || 0})
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No prayer requests</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'No prayers match your search.' : 'Get started by adding a new prayer request.'}
              </p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredPrayers.length && (
          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMore}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Load More
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerRequests;