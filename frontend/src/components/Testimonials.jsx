import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, User, Star, Search, Filter, ChevronDown, X, CheckCircle, AlertCircle } from "lucide-react";

// Define your backend API base URL here.
// IMPORTANT: Replace this with the actual URL of your Node.js backend.
const API_BASE_URL = "http://localhost:5000/api"; // Example: "https://your-backend-app.herokuapp.com/api"

// ---
// Testimonial Card Component (for reusability)
// ---
const TestimonialCard = ({ testimonial, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
    className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 p-6 transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
  >
    <div className="flex items-start gap-4 mb-4">
      <div className="bg-emerald-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md">
        {testimonial.name ? testimonial.name.charAt(0).toUpperCase() : 'A'} {/* Ensure charAt(0) is safe */}
      </div>
      <div>
        <h3 className="font-bold text-gray-900">{testimonial.name || "Anonymous"}</h3>
        <p className="text-sm text-gray-500">
          {testimonial.date ? new Date(testimonial.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }) : 'N/A'}
        </p>
      </div>
    </div>

    <p className="text-gray-700 mb-6 leading-relaxed relative pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-emerald-500 before:rounded-full">
      "{testimonial.message}"
    </p>

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
  </motion.div>
);

// ---
// Main Testimonials Page Component
// ---
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
    setError(null); // Clear previous errors
    try {
      console.log(`Attempting to fetch testimonials from: ${API_BASE_URL}/testimonials`);
      const response = await fetch(`${API_BASE_URL}/testimonials`);
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
        setError(
          "Could not connect to the backend server. Please ensure your Node.js backend is running and accessible, and check your API_BASE_URL and CORS settings."
        );
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
      console.log(`Attempting to submit testimonial to: ${API_BASE_URL}/testimonials`);
      const response = await fetch(`${API_BASE_URL}/testimonials`, {
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
      setTestimonials([
        { ...submittedTestimonial, id: submittedTestimonial._id, date: new Date(submittedTestimonial.date) },
        ...testimonials,
      ]);
      setName("");
      setMessage("");
      setIsSubmitted(true); // Show success message

      // Hide success message and form after a delay
      setTimeout(() => {
        setShowForm(false);
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to submit testimonial:", err);
      if (err.message.includes("Failed to fetch")) {
        setError(
          "Could not connect to the backend server. Please ensure your Node.js backend is running and accessible, and check your API_BASE_URL and CORS settings."
        );
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
    .filter((testimonial) => {
      const matchesSearch =
        testimonial.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        testimonial.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filterOption === "all" || testimonial.rating.toString() === filterOption;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Ensure date objects are compared
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (sortOption === "newest") {
        return dateB.getTime() - dateA.getTime();
      }
      if (sortOption === "oldest") {
        return dateA.getTime() - dateB.getTime();
      }
      if (sortOption === "rating") {
        return b.rating - a.rating;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased">
      {/* Floating Form Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-emerald-600 text-white font-medium rounded-full shadow-lg flex items-center space-x-2 shadow-emerald-500/40 transition-all duration-200 hover:bg-emerald-700"
      >
        <MessageSquare size={20} />
        <span className="hidden sm:inline">Share Your Story</span>
      </motion.button>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-200 relative"
            >
              <button
                onClick={() => {
                  setShowForm(false);
                  setIsSubmitted(false); // Reset submission status on close
                  setError(null); // Clear error on close
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-emerald-600 transition-colors"
                aria-label="Close form"
              >
                <X size={24} />
              </button>

              {isSubmitted ? (
                <div className="py-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-6"
                  >
                    <CheckCircle className="h-10 w-10 text-emerald-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Sharing!</h3>
                  <p className="text-gray-600">Your powerful story will inspire many.</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Share God's Work</h3>
                    <p className="text-gray-500 text-sm">Tell us how your faith has grown with us.</p>
                  </div>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      <span className="block sm:inline">{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          id="name"
                          type="text"
                          placeholder="John Smith"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Testimony</label>
                      <textarea
                        id="message"
                        placeholder="How has God worked in your life through our church?"
                        className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 h-40 transition-colors"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className={`w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-all duration-200 ${
                        isLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-emerald-700"
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin h-5 w-5 mr-3 text-white"
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
                          Sharing...
                        </div>
                      ) : (
                        "Share Testimony"
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 text-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/0c1b33/1a2d4d?text=Subtle+Pattern')] opacity-5"></div>
        <div className="relative max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Stories of God's <span className="text-emerald-400">Faithfulness</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-gray-300 mb-10"
          >
            Discover how God is transforming lives through our vibrant faith community.
          </motion.p>

          <motion.button
            onClick={() => setShowForm(true)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-full shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center mx-auto space-x-2"
          >
            <MessageSquare className="mr-2" size={18} />
            Share Your Story
          </motion.button>
        </div>
      </section>

      {/* Testimonials Grid Section */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="relative w-full md:max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search testimonials..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Sort Dropdown */}
              <div className="relative w-full md:w-48">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none w-full px-4 py-3 bg-white border border-gray-300 rounded-full pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rating">Highest Rating</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <ChevronDown size={20} />
                </div>
              </div>

              {/* Filter by Rating */}
              <div className="flex-shrink-0">
                <div className="flex gap-2">
                  {[5, 4, 3].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilterOption(filterOption === `${rating}` ? "all" : `${rating}`)}
                      className={`px-3 py-2 rounded-full border transition-all duration-200 ${
                        filterOption === `${rating}`
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <Star
                        size={16}
                        className={filterOption === `${rating}` ? "fill-current" : "stroke-current"}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-center py-8">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Testimonials</h3>
              <p className="text-gray-600 max-w-md mx-auto">{error}</p>
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
                We couldn't find any stories matching your search. Try different keywords or share your own!
              </p>
            </div>
          ) : (
            <>
              <motion.div
                layout
                className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence>
                  {filteredTestimonials.slice(0, visibleCount).map((testimonial, index) => (
                    <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {visibleCount < filteredTestimonials.length && (
                <div className="text-center mt-16">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadMore}
                    className="px-8 py-4 bg-white text-gray-800 font-bold rounded-full border border-gray-300 hover:bg-gray-100 transition-colors shadow-md flex items-center mx-auto"
                  >
                    Load More Testimonials
                    <ChevronDown className="w-5 h-5 ml-2" />
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="inline-block mb-4 bg-white/20 text-white rounded-full px-4 py-1 text-sm font-medium tracking-wider"
          >
            BE PART OF OUR STORY
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight"
          >
            Your Testimony Inspires Hope
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-emerald-100 max-w-2xl mx-auto mb-8"
          >
            Share how God has worked in your life and encourage others on their journey of faith.
          </motion.p>

          <motion.button
            onClick={() => setShowForm(true)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.3 }}
            className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            Share Your Testimony
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default ALCC_Testimonials;
