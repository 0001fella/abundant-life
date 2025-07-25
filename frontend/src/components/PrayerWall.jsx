import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, HeartHandshake, MessageSquare, Cross, ChevronDown, X, Filter, ChevronRight, Search } from "lucide-react";

const PrayerWall = () => {
  const [prayers, setPrayers] = useState([]);
  const [formData, setFormData] = useState({ name: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [loadingPrayers, setLoadingPrayers] = useState(true);
  
  // API configuration
  const apiBaseUrl = typeof __api_base_url !== 'undefined' ? __api_base_url : '';
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  // Fetch prayers from your Node.js/MongoDB backend
  const fetchPrayers = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/prayers?appId=${appId}`);
      if (!response.ok) throw new Error('Failed to fetch prayers');
      
      const data = await response.json();
      setPrayers(data);
      setLoadingPrayers(false);
    } catch (error) {
      console.error("Error fetching prayers:", error);
      setLoadingPrayers(false);
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
      const response = await fetch(`${apiBaseUrl}/api/prayers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          appId,
          name: formData.name.trim() || "Anonymous"
        })
      });

      if (!response.ok) throw new Error('Submission failed');

      setFormData({ name: "", text: "" });
      setSuccessMessage(true);
      setShowForm(false);
      fetchPrayers(); // Refresh the list

      setTimeout(() => setSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Error adding prayer request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePray = async (prayerId) => {
    try {
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
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (sortOption === "newest") {
        return dateB - dateA;
      } else if (sortOption === "oldest") {
        return dateA - dateB;
      } else if (sortOption === "popular") {
        return b.prayerCount - a.prayerCount;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#0c1b33] font-sans">
      {/* Floating Form Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-full shadow-lg flex items-center space-x-2 shadow-amber-500/30"
      >
        <MessageSquare size={20} />
        <span>Share Prayer Request</span>
      </motion.button>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#0c1b33]">Share Your Prayer Request</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-amber-500">
                <X size={20} />
              </button>
            </div>

            {successMessage ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-4">
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[#0c1b33] mb-2">Prayer Request Submitted!</h3>
                <p className="text-gray-500">Our church family will be praying for you.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="John Smith"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Prayer Request</label>
                  <textarea
                    placeholder="How can we pray for you?"
                    className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 h-40"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-lg transition-all ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:opacity-90"
                  } shadow-md`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    "Share Prayer Request"
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 text-center overflow-hidden bg-gradient-to-r from-[#0c1b33] to-[#1a2d4d]">
        <div className="absolute inset-0 opacity-10">
          <div className="pattern-cross pattern-amber-500 pattern-opacity-10 pattern-size-20"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="relative max-w-4xl mx-auto"
        >
          <motion.div className="inline-block mb-4 bg-amber-500/20 text-amber-400 rounded-full px-4 py-1 text-sm font-medium tracking-wider">
            PRAY WITHOUT CEASING
          </motion.div>

          <motion.h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
            Share Your <span className="text-amber-400">Prayer</span> Requests
          </motion.h1>

          <motion.p className="max-w-2xl mx-auto text-xl text-amber-400 mb-8">
            Submit your requests and pray for others in our faith community
          </motion.p>

          <motion.div 
            className="flex items-center justify-center gap-3 bg-amber-500/20 border border-amber-500/30 px-6 py-2 rounded-full max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Cross className="text-amber-400" size={20} />
            <span className="text-white">"Pray without ceasing" - 1 Thessalonians 5:17</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-12 px-4 sm:px-6 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search prayer requests..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={18} />
                <span>Filters</span>
              </button>
            </div>
          </div>
          
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-8"
            >
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { value: "newest", label: "Newest" },
                      { value: "oldest", label: "Oldest" },
                      { value: "popular", label: "Most Prayed For" }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setSortOption(option.value)}
                        className={`px-4 py-2 text-sm rounded-lg ${
                          sortOption === option.value 
                            ? 'bg-amber-500 text-white font-medium' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Prayer Requests Section */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              className="inline-block mb-4 bg-amber-500/20 text-amber-500 rounded-full px-4 py-1 text-sm font-medium tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              PRAYER REQUESTS
            </motion.div>
            <motion.h2
              className="text-3xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Join Us in Prayer
            </motion.h2>
          </div>

          {loadingPrayers ? (
            <div className="text-center py-12">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Loading prayers...</p>
            </div>
          ) : filteredPrayers.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Prayer Requests Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We couldn't find any prayer requests matching your search. Try different keywords or share your own request!
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPrayers.slice(0, visibleCount).map((prayer, index) => (
                  <motion.div
                    key={prayer._id}
                    className="bg-gradient-to-br from-white to-amber-50 rounded-2xl overflow-hidden shadow-lg border border-gray-100"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    whileHover={{ y: -10, rotate: -1 }}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="bg-gradient-to-br from-[#0c1b33] to-[#1a2d4d] w-12 h-12 rounded-full flex items-center justify-center text-amber-400 font-bold text-xl flex-shrink-0">
                          {prayer.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#0c1b33]">{prayer.name}</h3>
                          <p className="text-sm text-amber-500">
                            {prayer.date ? new Date(prayer.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            }) : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6 relative pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-amber-500 before:rounded-full">
                        "{prayer.request}"
                      </p>

                      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-amber-500">
                          <HeartHandshake size={16} />
                          <span className="font-medium">{prayer.prayerCount || 0} prayers</span>
                        </div>
                        <button 
                          onClick={() => handlePray(prayer._id)}
                          className="px-4 py-2 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 rounded-full text-sm font-medium transition flex items-center"
                        >
                          <HeartHandshake size={16} className="mr-1" />
                          I prayed
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {visibleCount < filteredPrayers.length && (
                <div className="text-center mt-12">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadMore}
                    className="px-6 py-3 bg-white text-[#0c1b33] font-medium rounded-full border border-gray-300 hover:bg-gray-50 transition-colors shadow-md flex items-center mx-auto"
                  >
                    Load More Prayers
                    <ChevronDown className="w-5 h-5 ml-2" />
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-[#0c1b33]/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-amber-600 mb-2">240+</div>
              <h3 className="text-lg font-bold text-[#0c1b33] mb-2">Prayers Answered</h3>
              <p className="text-gray-600">God's faithfulness in our community</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-amber-600 mb-2">1,850+</div>
              <h3 className="text-lg font-bold text-[#0c1b33] mb-2">Prayers Offered</h3>
              <p className="text-gray-600">By our church members this year</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl font-bold text-amber-600 mb-2">12</div>
              <h3 className="text-lg font-bold text-[#0c1b33] mb-2">Prayer Categories</h3>
              <p className="text-gray-600">Healing, provision, relationships, and more</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Encouragement Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-[#0c1b33] to-[#1a2d4d]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="bg-amber-500/10 p-10 rounded-2xl border border-amber-500/20 inline-block">
              <Cross className="mx-auto mb-4 text-amber-400" size={40} />
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                "The prayer of a righteous person is powerful and effective"
              </h3>
              <p className="text-lg text-amber-400 max-w-xl mx-auto">
                James 5:16
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            className="inline-block mb-4 bg-amber-100 text-amber-600 rounded-full px-4 py-1 text-sm font-medium tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            PRAYER CHANGES THINGS
          </motion.div>
          
          <motion.h2
            className="text-3xl font-bold mb-6 text-[#0c1b33]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your Prayer Matters
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Share your request and experience the power of corporate prayer
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-full shadow-lg hover:opacity-90 transition-all"
            >
              Share Prayer Request
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 bg-[#0c1b33] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span className="text-amber-500">ALCC</span> Prayer Wall
              </div>
              <p className="text-amber-500/80">Abundant Life Celebration Center</p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-amber-500/80 mb-2">Nairobi, Kenya</p>
              <p className="text-amber-500/80">© {new Date().getFullYear()} ALCC Ministries. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrayerWall;