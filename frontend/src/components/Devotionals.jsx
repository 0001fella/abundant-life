import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CalendarDays, Search, X, Loader2, AlertCircle, CheckCircle } from "lucide-react";

// Define your backend API base URL here.
// IMPORTANT: Replace this with the actual URL of your Node.js backend.
// For example, if your backend is running locally on port 5000, it might be "http://localhost:5000/api".
// If deployed, it would be your deployed backend URL, e.g., "https://your-backend-app.herokuapp.com/api".
const API_BASE_URL = "http://localhost:5000/api";

// Default devotional data that will be shown if no devotionals are found from API
const DEFAULT_DEVOTIONALS = [
  {
    _id: "default-1", // Use _id for consistency with MongoDB
    title: "Walking in Grace",
    snippet: "Discover the daily power of God's grace in your life and how to walk in it each day.",
    content: "God's grace is sufficient for us, for His power is made perfect in weakness. When we recognize our dependence on Him, we position ourselves to receive His abundant grace. This devotional explores practical ways to walk in God's grace daily, even in challenging circumstances.",
    date: "2025-05-19T00:00:00.000Z", // ISO string for date
    scripture: "2 Corinthians 12:9",
    image: "https://placehold.co/800x600/145a32/d5f5e3?text=Grace",
    author: "Ps. Elkana Wanyonyi",
    category: "Spiritual Growth",
    readingTime: "4 min read"
  },
  {
    _id: "default-2",
    title: "Overcoming in Faith",
    snippet: "Faith isn't always easy, but it's always powerful when we trust in God's promises.",
    content: "Faith is the assurance of things hoped for, the conviction of things not seen. In this devotional, we explore how to maintain strong faith during trials and uncertainties. Through biblical examples and practical applications, you'll learn how to overcome obstacles through unwavering faith in God's promises.",
    date: "2025-05-15T00:00:00.000Z",
    scripture: "1 John 5:4",
    image: "https://placehold.co/800x600/1d8348/d5f5e3?text=Faith",
    author: "Caroline Barasa",
    category: "Faith",
    readingTime: "5 min read"
  },
  {
    _id: "default-3",
    title: "The Peace of Christ",
    snippet: "Learn how to experience Christ's peace that surpasses all understanding in difficult times.",
    content: "In a world filled with anxiety and turmoil, Christ offers us a peace that transcends human understanding. This devotional guides you through Scripture to discover how to access and maintain this supernatural peace regardless of your circumstances. Practical applications include prayer techniques and mindset shifts that help anchor your soul in God's peace.",
    date: "2025-05-12T00:00:00.000Z",
    scripture: "Philippians 4:7",
    image: "https://placehold.co/800x600/27ae60/d5f5e3?text=Peace",
    author: "Dennis Otieno",
    category: "Peace",
    readingTime: "6 min read"
  },
  {
    _id: "default-4",
    title: "Abiding in the Vine",
    snippet: "Jesus calls us to remain connected to Him as branches to the vine for spiritual fruitfulness.",
    content: "Jesus said, 'I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit.' This devotional explores what it means to abide in Christ daily. Through practical disciplines and spiritual practices, you'll learn how to maintain a vibrant connection with Jesus and experience true spiritual fruitfulness in your life.",
    date: "2025-05-08T00:00:00.000Z",
    scripture: "John 15:5",
    image: "https://placehold.co/800x600/219653/d5f5e3?text=Abiding",
    author: "Grace Moraa",
    category: "Spiritual Growth",
    readingTime: "7 min read"
  },
  {
    _id: "default-5",
    title: "The Power of Forgiveness",
    snippet: "Discover the transformative freedom that comes from extending and receiving forgiveness.",
    content: "Forgiveness is at the heart of the Christian faith. This devotional examines biblical principles of forgiveness and how practicing it can bring healing to relationships and freedom to our souls. Through real-life examples and scriptural insights, you'll learn practical steps to forgive others as Christ has forgiven us.",
    date: "2025-05-05T00:00:00.000Z",
    scripture: "Colossians 3:13",
    image: "https://placehold.co/800x600/1a7840/d5f5e3?text=Forgiveness",
    author: "Samuel Otieno",
    category: "Relationships",
    readingTime: "5 min read"
  },
  {
    _id: "default-6",
    title: "Cultivating Gratitude",
    snippet: "Develop a thankful heart that sees God's blessings in every season of life.",
    content: "Gratitude transforms our perspective and opens our eyes to God's constant provision. This devotional explores how cultivating a grateful heart impacts our relationship with God and others. Through daily exercises and scriptural meditation, you'll learn how to develop a lifestyle of thankfulness that honors God.",
    date: "2025-05-01T00:00:00.000Z",
    scripture: "1 Thessalonians 5:18",
    image: "https://placehold.co/800x600/0f6c3a/d5f5e3?text=Gratitude",
    author: "Mayaka Moriasi",
    category: "Spiritual Growth",
    readingTime: "4 min read"
  }
];

// Notification Component
const Notification = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";
  const borderColor = type === "success" ? "border-green-400" : "border-red-400";
  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg flex items-center ${bgColor} ${textColor} ${borderColor} border`}
      role="alert"
    >
      <Icon className="w-5 h-5 mr-2" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-current hover:opacity-75">
        <X size={16} />
      </button>
    </motion.div>
  );
};

const Devotionals = () => {
  const [devotionals, setDevotionals] = useState([]);
  const [categories, setCategories] = useState(["All Devotionals"]);
  const [selectedCategory, setSelectedCategory] = useState("All Devotionals");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleDevotionals, setVisibleDevotionals] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type });
    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Toggle dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);

    const handler = e => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Fetch devotionals from API
  const fetchDevotionals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Attempting to fetch devotionals from: ${API_BASE_URL}/devotionals`);
      const response = await fetch(`${API_BASE_URL}/devotionals`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server responded with status ${response.status}:`, errorText);
        throw new Error(`Server error: ${response.status} - ${errorText || response.statusText}`);
      }
      let data = await response.json();

      if (!data || data.length === 0) {
        console.warn("No devotionals found from API, using default devotionals.");
        data = DEFAULT_DEVOTIONALS;
      } else {
        // Ensure _id is mapped to id and date is parsed
        data = data.map(d => ({
          ...d,
          id: d._id,
          date: new Date(d.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) // Format date for display
        }));
      }

      setDevotionals(data);
      const uniqueCategories = [...new Set(data.map(d => d.category))];
      setCategories(["All Devotionals", ...uniqueCategories]);
      showNotification("Devotionals loaded successfully!", "success");
    } catch (err) {
      console.error("Error fetching devotionals:", err);
      let errorMessage = `Failed to load devotionals: ${err.message}. `;
      if (err.message.includes("Failed to fetch")) {
        errorMessage += "This often means the backend server is not running or is inaccessible. Please check your Node.js server and ensure CORS is correctly configured.";
      } else {
        errorMessage += "Please try again later.";
      }
      setError(errorMessage);
      setDevotionals(DEFAULT_DEVOTIONALS.map(d => ({
        ...d,
        id: d._id,
        date: new Date(d.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
      }))); // Fallback with formatted dates
      const defaultCategories = [...new Set(DEFAULT_DEVOTIONALS.map(d => d.category))];
      setCategories(["All Devotionals", ...defaultCategories]);
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchDevotionals();
  }, [fetchDevotionals]);

  const filteredDevotionals = devotionals.filter(devotional => {
    const matchesCategory = selectedCategory === "All Devotionals" ||
                            devotional.category === selectedCategory;
    const matchesSearch = devotional.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          devotional.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          devotional.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const loadMore = () => {
    setVisibleDevotionals(prev => prev + 4);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-[#d5f5e3]"}`}>
        <div className="text-center">
          <Loader2 className="animate-spin text-[#27ae60] h-12 w-12 mx-auto" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-gray-700 dark:text-gray-300"
          >
            Loading devotionals...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-[#d5f5e3]"}`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md mx-auto border border-gray-200 dark:border-gray-700"
        >
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Content</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#27ae60] text-white rounded-lg hover:bg-[#219653] transition"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gradient-to-b from-[#d5f5e3] to-white text-gray-800"}`}>
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      {/* Dark mode toggle */}
      <div className="fixed top-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full ${darkMode ? "bg-gray-700 text-yellow-400" : "bg-[#27ae60] text-white"} shadow-lg`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </motion.button>
      </div>

      {/* Hero Section */}
      <section className={`relative py-28 px-4 sm:px-6 text-center overflow-hidden ${darkMode ? "bg-gray-800" : "bg-gradient-to-r from-[#145a32] to-[#1d8348]"}`}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532626256-3a2c1fa1cfd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center opacity-30"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.span
              className="flex items-center gap-3 mb-3 text-white" // Changed to white for better contrast
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <BookOpen className="text-[#d5f5e3]" size={32} />
              Daily Devotionals
            </motion.span>
            <motion.span
              className="text-[#d5f5e3]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Nourish Your Spirit Daily
            </motion.span>
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Grow in your faith with biblical insights and practical applications for everyday life
          </motion.p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* Main Content Column */}
            <div className="lg:w-2/3">
              {/* Search and Filter */}
              <motion.div
                variants={itemVariants}
                className="mb-12"
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
                  <div className="relative w-full md:w-auto flex-grow"> {/* Added flex-grow */}
                    <div className="absolute left-3 top-3 text-gray-400">
                      <Search size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search devotionals..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 ${darkMode ? "bg-gray-800 border-gray-700 focus:ring-[#27ae60] focus:border-[#27ae60] text-white" : "border-gray-300 focus:ring-[#27ae60] focus:border-[#27ae60] text-gray-800"}`}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {categories.map((category, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          selectedCategory === category
                            ? "bg-[#27ae60] text-white shadow-md"
                            : `${darkMode ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600" : "bg-white text-[#145a32] border border-[#27ae60] hover:bg-[#d5f5e3]"}`
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {selectedCategory}
                    <span className="text-[#27ae60]"> ({filteredDevotionals.length})</span>
                  </h2>
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    Showing {Math.min(visibleDevotionals, filteredDevotionals.length)} of {filteredDevotionals.length} devotionals
                  </p>
                </div>
              </motion.div>

              {/* Devotionals Grid */}
              <div className="grid gap-8">
                {filteredDevotionals.length === 0 ? (
                  <motion.div
                    variants={itemVariants}
                    className={`text-center py-12 rounded-2xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                  >
                    <div className={`border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center ${darkMode ? "border-gray-600 text-gray-500" : "border-gray-300 text-gray-400"}`}>
                      <Search size={32} />
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>No devotionals found</h3>
                    <p className={`max-w-md mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Try adjusting your search or filter criteria. No devotionals match your current selection.
                    </p>
                  </motion.div>
                ) : (
                  filteredDevotionals.slice(0, visibleDevotionals).map((post, index) => {
                    // Determine layout based on index
                    const layoutClass = index % 2 === 0
                      ? "md:flex"
                      : "md:flex md:flex-row-reverse";

                    return (
                      <motion.div
                        key={post.id || post._id} // Use id or _id as key
                        variants={itemVariants}
                        whileHover={{ y: -5, boxShadow: darkMode ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                        className={`rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                      >
                        <motion.div
                          className={layoutClass}
                          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <div className="md:w-2/5">
                            <motion.div
                              className="h-64 md:h-full overflow-hidden"
                              whileHover={{ scale: 1.03 }}
                              transition={{ duration: 0.4 }}
                            >
                              <img
                                src={post.image || "https://placehold.co/800x600/cccccc/333333?text=Devotional"} // Fallback image
                                alt={post.title}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600/cccccc/333333?text=Devotional"; }} // Image error fallback
                              />
                            </motion.div>
                          </div>

                          <div className="p-6 md:w-3/5">
                            <div className="flex flex-wrap gap-3 mb-4">
                              <motion.span
                                className="px-3 py-1 bg-[#d5f5e3] text-[#145a32] rounded-full text-sm font-medium border border-[#27ae60] shadow-sm"
                                whileHover={{ scale: 1.05 }}
                              >
                                {post.category}
                              </motion.span>
                              <span className={`flex items-center text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                <CalendarDays className="w-4 h-4 mr-1 text-[#27ae60]" />
                                {post.date}
                              </span>
                              <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                {post.readingTime}
                              </span>
                            </div>

                            <motion.h3
                              className={`text-xl md:text-2xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
                              whileHover={{ color: "#27ae60" }}
                            >
                              {post.title}
                            </motion.h3>

                            <div className="flex items-center mb-4">
                              <div className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center text-sm font-semibold ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700"}`}>
                                {post.author.split(" ").map(n => n[0]).join("")}
                              </div>
                              <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{post.author}</span>
                            </div>

                            <p className={`mb-4 text-base leading-relaxed line-clamp-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                              {post.snippet} {/* Display snippet here */}
                            </p>

                            <motion.div
                              className="mt-6"
                              whileHover={{ x: 5 }}
                            >
                              <span className="text-lg font-semibold text-[#27ae60]">
                                {post.scripture}
                              </span>
                            </motion.div>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })
                )}

                {visibleDevotionals < filteredDevotionals.length && filteredDevotionals.length > 0 && (
                  <motion.div
                    className="text-center mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: darkMode ? "#1a2d4d" : "#d5f5e3" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={loadMore}
                      className={`px-6 py-3 font-medium rounded-lg transition ${
                        darkMode
                          ? "bg-gray-800 border-2 border-[#27ae60] text-[#27ae60] hover:bg-gray-700"
                          : "bg-white border-2 border-[#27ae60] text-[#27ae60] hover:bg-[#d5f5e3]"
                      } shadow-md`}
                    >
                      Load More Devotionals
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Popular Categories */}
              <motion.div
                variants={itemVariants}
                className={`p-6 rounded-2xl shadow-md border mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              >
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Popular Categories</h3>
                <div className="space-y-3">
                  {categories.slice(1).map((category, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ x: 5 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex justify-between items-center w-full px-4 py-3 rounded-lg transition ${
                        selectedCategory === category
                          ? "bg-[#d5f5e3] text-[#145a32] font-semibold"
                          : `${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-50 text-gray-700 hover:bg-[#d5f5e3]"}`
                      }`}
                    >
                      <span>{category}</span>
                      <span className="bg-[#d5f5e3] text-[#145a32] text-xs font-bold px-2 py-1 rounded-full">
                        {devotionals.filter(d => d.category === category).length}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Recent Devotionals */}
              <motion.div
                variants={itemVariants}
                className={`p-6 rounded-2xl shadow-md border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              >
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Recent Devotionals</h3>
                <div className="space-y-4">
                  {devotionals.slice(0, 3).map((post) => (
                    <motion.div
                      key={post.id || post._id}
                      whileHover={{ x: 5 }}
                      className="flex gap-4 cursor-pointer group"
                      onClick={() => {
                        // Scroll to top and set selected category to 'All Devotionals'
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setSelectedCategory("All Devotionals");
                        setSearchQuery(""); // Clear search query
                        // Optionally, you might want to open a modal with full content here
                        // For now, it just resets filters and scrolls
                      }}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={post.image || "https://placehold.co/800x600/cccccc/333333?text=Devotional"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600/cccccc/333333?text=Devotional"; }}
                        />
                      </div>
                      <div>
                        <h4 className={`font-semibold group-hover:text-[#27ae60] transition ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {post.title}
                        </h4>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{post.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scripture Section */}
      <section className={`py-16 px-4 sm:px-6 ${darkMode ? "bg-gray-800" : "bg-gradient-to-r from-[#145a32] to-[#1d8348]"} text-white`}>
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <BookOpen className="mx-auto mb-6 text-[#d5f5e3]" size={40} />
          </motion.div>
          <motion.blockquote
            className="text-2xl md:text-3xl italic mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            "Your word is a lamp for my feet, a light on my path."
          </motion.blockquote>
          <motion.p
            className="text-xl font-medium"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            - Psalm 119:105
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
};

export default Devotionals;
