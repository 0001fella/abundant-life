import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, User, Star, Search, Filter, ChevronDown, X, CheckCircle, AlertCircle } from "lucide-react";

// --- Updated API Configuration ---
// Use the deployed backend URL for production, localhost for development
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? '' // Relative path for local development
  : 'https://abundant-life.onrender.com'; // Explicit backend URL for Netlify deployment
// --- End of Updated API Configuration ---

// Testimonial Card Component (for reusability)
const TestimonialCard = ({ testimonial, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
  >
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
            <p className="text-sm text-gray-500">
              {testimonial.date ? new Date(testimonial.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center text-emerald-500">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={i < testimonial.rating ? "fill-current" : "stroke-current"}
              size={16}
              aria-label={`${testimonial.rating} out of 5 stars`}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-700 italic">"{testimonial.message}"</p>
    </div>
  </motion.div>
);

// Main Testimonials Page Component
const ALCC_Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6); // Increased initial count for a fuller page
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [filterOption, setFilterOption] = useState("all");
  const [error, setError] = useState(null); // State for API errors

  // Function to fetch testimonials from the backend
  const fetchTestimonials = async () => {
    setError(null); // Clear previous error
    try {
      console.log(`Attempting to fetch testimonials from: ${API_BASE_URL}/api/testimonials`);
      const response = await fetch(`${API_BASE_URL}/api/testimonials`);
      if (!response.ok) {
        // If the response is not OK, it means the server responded but with an error status
        const errorText = await response.text(); // Get raw text to help debug
        throw new Error(`Server responded with status ${response.status}: ${errorText || response.statusText}`);
      }
      const data = await response.json();
      // Map MongoDB's _id to id for consistency if needed, and ensure date is handled
      const formattedData = data.map(t => ({
        ...t,
        id: t._id, // Use _id from MongoDB as id
        date: t.date ? new Date(t.date) : new Date(), // Ensure date is a Date object or default
      }));
      setTestimonials(formattedData);
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
      // Provide more specific error message for network issues
      if (err.message.includes("Failed to fetch")) {
        setError("Could not connect to the backend server. Please ensure your Node.js backend is running and accessible, and check your API_BASE_URL and CORS settings.");
      } else {
        setError(`Failed to load testimonials: ${err.message}. Please try again later.`);
      }
    }
  };

  // Fetch testimonials on component mount
  useEffect(() => {
    fetchTestimonials();
  }, []); // Empty dependency array means this runs once on mount

  // Handle testimonial submission to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors
    const newTestimonialData = {
      name: name.trim() || "Anonymous",
      message: message.trim(),
      // Backend should handle date creation, but sending it from frontend as fallback
      date: new Date().toISOString(),
      rating: 5, // Default rating for new submissions
    };
    try {
      console.log(`Attempting to submit testimonial to: ${API_BASE_URL}/api/testimonials`);
      const response = await fetch(`${API_BASE_URL}/api/testimonials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTestimonialData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const submittedTestimonial = await response.json();
      // Add the newly submitted testimonial to the beginning of the list
      setTestimonials([{ ...submittedTestimonial, id: submittedTestimonial._id, date: new Date(submittedTestimonial.date) }, ...testimonials]);
      setName("");
      setMessage("");
      setIsLoading(false);
      setIsSubmitted(true); // Show success message
      // Hide success message and form after a delay
      setTimeout(() => {
        setShowForm(false);
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to submit testimonial:", err);
      if (err.message.includes("Failed to fetch")) {
        setError("Could not connect to the backend server. Please ensure your Node.js backend is running and accessible, and check your API_BASE_URL and CORS settings.");
      } else {
        setError(`Failed to submit your testimony: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // Filter and sort testimonials
  const filteredTestimonials = testimonials
    .filter(testimonial => {
      const matchesSearch = testimonial.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        testimonial.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterOption === "all" || (filterOption === "5star" && testimonial.rating === 5);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortOption === "oldest") {
        return new Date(a.date) - new Date(b.date);
      } else if (sortOption === "rating") {
        return b.rating - a.rating;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      {/* Floating Form Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-full shadow-lg flex items-center space-x-2 shadow-emerald-500/30"
      >
        <MessageSquare size={20} />
        <span>Share Your Testimony</span>
      </motion.button>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Share Your Testimony</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Testimony Submitted!</h3>
                  <p className="text-gray-600">Thank you for sharing your experience with our church family.</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
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
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Testimony</label>
                      <textarea
                        placeholder="Share how God has worked in your life..."
                        className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 h-40"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center text-yellow-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="fill-current" size={20} />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">5 Star Rating</span>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-lg transition-all ${
                        isLoading ? "opacity-75 cursor-not-allowed" : "hover:opacity-90"
                      } shadow-md`}
                    >
                      {isLoading ? (
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
                        "Share Testimony"
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 text-center overflow-hidden bg-gradient-to-r from-[#065f46] to-[#047857]">
        <div className="absolute inset-0 opacity-10">
          <div className="pattern-cross pattern-amber-500 pattern-opacity-10 pattern-size-20"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-4xl mx-auto"
        >
          <motion.div className="inline-block mb-4 bg-emerald-500/20 text-emerald-300 rounded-full px-4 py-1 text-sm font-medium tracking-wider">
            SHARE YOUR STORY
          </motion.div>
          <motion.h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
            Your <span className="text-emerald-300">Testimonies</span> Encourage Us
          </motion.h1>
          <motion.p className="max-w-2xl mx-auto text-xl text-emerald-200 mb-8">
            Read inspiring stories from our church family and share your own journey of faith
          </motion.p>
          <motion.div
            className="flex items-center justify-center gap-3 bg-emerald-500/20 border border-emerald-500/30 px-6 py-2 rounded-full max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Star className="text-emerald-300 fill-current" size={20} />
            <span className="text-white">"We have this treasure in jars of clay" - 2 Corinthians 4:7</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-12 px-4 sm:px-6 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search testimonies..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={20} />
                </div>
              </div>
              <div className="relative">
                <select
                  value={filterOption}
                  onChange={(e) => setFilterOption(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Ratings</option>
                  <option value="5star">5 Star Only</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <Filter size={20} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Testimonies <span className="text-emerald-600">({filteredTestimonials.length})</span>
            </h2>
            <p className="text-gray-600">
              Showing {Math.min(visibleCount, filteredTestimonials.length)} of {filteredTestimonials.length} testimonies
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {error && !isLoading && (
            <div className="text-center py-12">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Testimonies</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">{error}</p>
              <button
                onClick={fetchTestimonials}
                className="mt-4 px-6 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors"
              >
                Retry Loading
              </button>
            </div>
          )}
          {!error && filteredTestimonials.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Testimonies Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We couldn't find any testimonies matching your search. Try different keywords or share your own story!
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredTestimonials.slice(0, visibleCount).map((testimonial, index) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
                ))}
              </div>
              {visibleCount < filteredTestimonials.length && (
                <div className="text-center mt-12">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadMore}
                    className="px-6 py-3 bg-white text-[#065f46] font-medium rounded-full border border-gray-300 hover:bg-gray-50 transition-colors shadow-md flex items-center mx-auto"
                  >
                    Load More Testimonies
                    <ChevronDown className="w-5 h-5 ml-2" />
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-50 to-[#065f46]/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-emerald-600 mb-2">1,250+</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Stories Shared</h3>
              <p className="text-gray-600">Of God's faithfulness in our community</p>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-emerald-600 mb-2">98%</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Positive Impact</h3>
              <p className="text-gray-600">Of testimonies encouraging others</p>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl font-bold text-emerald-600 mb-2">50+</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Monthly Shares</h3>
              <p className="text-gray-600">New testimonies added each month</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Encouragement Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-[#065f46] to-[#047857]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="bg-emerald-500/10 p-10 rounded-2xl border border-emerald-500/20 inline-block">
              <Star className="mx-auto mb-4 text-emerald-300 fill-current" size={40} />
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up."
              </h3>
              <p className="text-lg text-emerald-200 max-w-xl mx-auto">
                Galatians 6:9
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            className="inline-block mb-4 bg-emerald-100 text-emerald-800 rounded-full px-4 py-1 text-sm font-medium tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            YOUR STORY MATTERS
          </motion.div>
          <motion.h2
            className="text-3xl font-bold mb-6 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Share Your Experience
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your testimony can be a source of encouragement and hope for others in our church family
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-full shadow-lg hover:opacity-90 transition-all"
            >
              Share Your Testimony
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 bg-[#065f46] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span className="text-emerald-300">ALCC</span> Testimonies
              </div>
              <p className="text-emerald-200">Abundant Life Celebration Center</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-emerald-200 mb-2">Nairobi, Kenya</p>
              <p className="text-emerald-200">© {new Date().getFullYear()} ALCC Ministries. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ALCC_Testimonials;