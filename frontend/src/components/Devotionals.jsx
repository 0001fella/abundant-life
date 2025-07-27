import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CalendarDays, Search, X, Loader2, AlertCircle, CheckCircle, Clock } from "lucide-react";

// --- Updated API Configuration ---
// Use the deployed backend URL for production, localhost for development
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api' // Adjust this if your local backend port is different
  : 'https://your-deployed-backend-url.onrender.com/api'; // *** IMPORTANT: Replace with your actual Render backend URL ***
// --- End of Updated API Configuration ---

// Default devotional data that will be shown if no devotionals are found from API
const DEFAULT_DEVOTIONALS = [
  {
    _id: "default-1",
    title: "Walking in Grace",
    snippet: "Discover the daily power of God's grace in your life and how to walk in it each day.",
    content: "God's grace is sufficient for us, for His power is made perfect in weakness. When we recognize our dependence on Him, we position ourselves to receive His abundant grace. This devotional explores practical ways to walk in God's grace daily, even in challenging circumstances. Grace is not just a theological concept; it's a lived reality. It empowers us to forgive, to love unconditionally, and to persevere when our own strength fails. As we meditate on God's grace, we find that it transforms our perspective, turning our struggles into opportunities for growth and our fears into faith.",
    date: "2025-05-19T00:00:00.000Z",
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
    content: "Faith is the assurance of things hoped for, the conviction of things not seen. In this devotional, we explore how to maintain strong faith during trials and uncertainties. Through biblical examples and practical applications, you'll learn how to overcome obstacles through unwavering faith in God's promises. Remember the story of David and Goliath? It wasn't David's size or strength that won the battle, but his unwavering faith in the power of the Lord. When we face our own giants, whether they be fear, doubt, or seemingly insurmountable challenges, we must anchor our hearts in the unchanging character of God. His promises are yes and amen, providing a solid foundation for our faith journey.",
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
    content: "In a world filled with anxiety and turmoil, Christ offers us a peace that transcends human understanding. This devotional guides you through Scripture to discover how to access and maintain this supernatural peace regardless of your circumstances. Practical applications include prayer techniques and mindset shifts that help anchor your soul in God's peace. True peace is not the absence of trouble, but the presence of the Prince of Peace. It's a peace that guards our hearts and minds, a peace that enables us to rest even in the midst of storms. As we cultivate intimacy with Christ through prayer, meditation on His Word, and worship, we tap into this wellspring of peace that the world cannot give or take away.",
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
    content: "Jesus said, 'I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit.' This devotional explores what it means to abide in Christ daily. Through practical disciplines and spiritual practices, you'll learn how to maintain a vibrant connection with Jesus and experience true spiritual fruitfulness in your life. Abiding is not a one-time event but a continuous, moment-by-moment dependence on Christ. It involves staying plugged into the source of all life and power. Just as a branch cannot bear fruit by itself unless it abides in the vine, neither can we bear spiritual fruit without remaining deeply connected to Jesus. This connection is nurtured through regular times of prayer, reading Scripture, fellowship with other believers, and obedience to His commands.",
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
    content: "Forgiveness is at the heart of the Christian faith. This devotional examines biblical principles of forgiveness and how practicing it can bring healing to relationships and freedom to our souls. Through real-life examples and scriptural insights, you'll learn practical steps to forgive others as Christ has forgiven us. Forgiveness is not about excusing someone's behavior or pretending the hurt didn't happen. It's a choice we make to release the burden of resentment and bitterness that only hurts us in the end. When we forgive, we reflect the image of our Heavenly Father, who forgave us while we were still sinners. It's an act of obedience and a pathway to inner healing and wholeness.",
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
    content: "Gratitude transforms our perspective and opens our eyes to God's constant provision. This devotional explores how cultivating a grateful heart impacts our relationship with God and others. Through daily exercises and scriptural meditation, you'll learn how to develop a lifestyle of thankfulness that honors God. A grateful heart is a magnet for blessings. It shifts our focus from what we lack to the abundance we already possess. When we practice gratitude, we acknowledge God's goodness and sovereignty over our lives. This recognition breeds contentment, joy, and a deeper trust in His plan, even when we don't understand the circumstances. Gratitude is a powerful weapon against anxiety and a key to experiencing the peace that surpasses understanding.",
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

// Devotional Detail Modal Component
const DevotionalModal = ({ devotional, isOpen, onClose, darkMode }) => {
  if (!isOpen || !devotional) return null;

  // Format the date for display inside the modal
  const formattedDate = new Date(devotional.date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close modal if backdrop is clicked
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 sm:p-8 overflow-y-auto" // Increased backdrop opacity and padding
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            className={`relative w-full max-w-4xl my-8 rounded-2xl shadow-2xl overflow-hidden ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}
          >
            {/* Modal Header with Image */}
            <div className="relative h-64 sm:h-80 w-full"> {/* Adjusted height for better image display */}
              <img
                src={devotional.image || "https://placehold.co/800x600/cccccc/333333?text=Devotional"}
                alt={devotional.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600/cccccc/333333?text=Devotional"; }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? "from-gray-900/80 to-transparent" : "from-black/60 to-transparent"}`}></div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">{devotional.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {devotional.readingTime}
                  </span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                    {devotional.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[70vh]"> {/* Adjusted padding and max-height for scrolling */}
              <div className="flex items-center mb-6">
                <div className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center text-sm font-semibold ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700"}`}>
                  {devotional.author && typeof devotional.author === 'string' ? devotional.author.split(" ").map(n => n[0]).join("") : '?'}
                </div>
                <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{devotional.author}</span>
              </div>

              <div className="mb-6">
                <p className={`text-lg sm:text-xl italic ${darkMode ? "text-amber-300" : "text-amber-600"}`}>
                  "{devotional.scripture}"
                </p>
              </div>

              <div className="prose max-w-none dark:prose-invert">
                <p className={`text-base sm:text-lg leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {devotional.content}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
  // State for the modal
  const [selectedDevotional, setSelectedDevotional] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        // Ensure _id is mapped to id and date is parsed consistently
        data = data.map(d => ({
          ...d,
          id: d._id,
          // Keep the original date string for sorting/filtering, format it only for display
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
        // Keep the original date string for sorting/filtering, format it only for display
      })));
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

  // Function to open the modal with a specific devotional
  const openDevotionalModal = (devotional) => {
    setSelectedDevotional(devotional);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    // Optional: Clear selected devotional after a delay for smoother closing animation
    setTimeout(() => setSelectedDevotional(null), 300);
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

      {/* Devotional Detail Modal */}
      <DevotionalModal
        devotional={selectedDevotional}
        isOpen={isModalOpen}
        onClose={closeModal}
        darkMode={darkMode}
      />

      {/* Dark mode toggle */}
      <div className="fixed top-4 right-4 z-40">
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
          className="relative max-w-7xl mx-auto w-full px-4" // Increased max-width and added padding
        >
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.span
              className="flex items-center gap-3 mb-3 text-white"
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
            className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 mb-8" // Increased max-width
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Grow in your faith with biblical insights and practical applications for everyday life
          </motion.p>
        </motion.div>
      </section>

      {/* Main Content - Adjusted for full width and better responsiveness */}
      <section className="py-16 px-0 sm:px-0"> {/* Removed padding here */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6"> {/* Added padding here and full width container */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col lg:flex-row gap-8 w-full" // Ensure full width
          >
            {/* Main Content Column */}
            <div className="lg:w-2/3 w-full"> {/* Ensure full width on smaller screens */}
              {/* Search and Filter */}
              <motion.div
                variants={itemVariants}
                className="mb-12"
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
                  <div className="relative w-full md:w-2/5 flex-grow"> {/* Adjusted width for search */}
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
                  <div className="flex flex-wrap gap-2 w-full md:w-3/5 justify-end"> {/* Adjusted width and alignment for filters */}
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
                    const layoutClass = index % 2 === 0
                      ? "md:flex"
                      : "md:flex md:flex-row-reverse";
                    return (
                      <motion.div
                        key={post.id || post._id}
                        variants={itemVariants}
                        whileHover={{ y: -5, boxShadow: darkMode ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                        className={`rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} cursor-pointer`} // Added cursor-pointer
                        onClick={() => openDevotionalModal(post)} // *** KEY CHANGE: Open modal on click ***
                      >
                        <motion.div
                          className={layoutClass}
                          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          {/* Changed from md:w-2/5 to md:w-1/2 */}
                          <div className="md:w-1/2">
                            <motion.div
                              className="h-64 md:h-full overflow-hidden"
                              whileHover={{ scale: 1.03 }}
                              transition={{ duration: 0.4 }}
                            >
                              <img
                                src={post.image || "https://placehold.co/800x600/cccccc/333333?text=Devotional"}
                                alt={post.title}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600/cccccc/333333?text=Devotional"; }}
                              />
                            </motion.div>
                          </div>
                          {/* Changed from md:w-3/5 to md:w-1/2 */}
                          <div className="p-6 md:w-1/2">
                            <div className="flex flex-wrap gap-3 mb-4">
                              <motion.span
                                className="px-3 py-1 bg-[#d5f5e3] text-[#145a32] rounded-full text-sm font-medium border border-[#27ae60] shadow-sm"
                                whileHover={{ scale: 1.05 }}
                              >
                                {post.category}
                              </motion.span>
                              <span className={`flex items-center text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                <CalendarDays className="w-4 h-4 mr-1 text-[#27ae60]" />
                                {/* Format date for display on the card */}
                                {new Date(post.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
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
                                {post.author && typeof post.author === 'string' ? post.author.split(" ").map(n => n[0]).join("") : '?'}
                              </div>
                              <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{post.author}</span>
                            </div>
                            <p className={`mb-4 text-base leading-relaxed line-clamp-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                              {post.snippet}
                            </p>
                            <motion.div
                              className="mt-6"
                              whileHover={{ x: 5 }}
                            >
                              {/* Removed explicit "Read More" button as the whole card is now clickable */}
                            </motion.div>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {visibleDevotionals < filteredDevotionals.length && (
                <div className="text-center mt-12">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadMore}
                    className={`px-8 py-3 rounded-full font-semibold transition shadow-lg ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-[#27ae60] text-white hover:bg-[#219653]"}`}
                  >
                    Load More
                  </motion.button>
                </div>
              )}
            </div>

            {/* Side Content/About Section - Stays the same, utilizing remaining 1/3 width */}
            <motion.div
              variants={itemVariants}
              className={`lg:w-1/3 w-full p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"} h-fit sticky top-8`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>About Daily Devotionals</h2>
              <p className={`mb-4 leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Welcome to our curated collection of daily devotionals, designed to inspire, encourage, and deepen your walk with God. Each devotional offers fresh insights into scripture, practical wisdom for everyday living, and a moment of reflection to connect with your faith.
              </p>
              <p className={`mb-6 leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Whether you're looking for guidance, comfort, or simply a moment of spiritual nourishment, you'll find a message here to uplift your spirit.
              </p>
              <ul className={`list-disc list-inside space-y-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <li>Diverse topics from faith to forgiveness.</li>
                <li>Insights from various authors.</li>
                <li>Daily spiritual nourishment at your fingertips.</li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`mt-8 w-full py-3 rounded-lg font-semibold transition ${darkMode ? "bg-[#219653] text-white hover:bg-[#1d8348]" : "bg-[#27ae60] text-white hover:bg-[#219653]"} shadow-md`}
              >
                Start Your Daily Devotion <BookOpen className="inline-block ml-2" size={18} />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 text-center border-t ${darkMode ? "bg-gray-900 border-gray-700 text-gray-400" : "bg-white border-gray-200 text-gray-600"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p>&copy; {new Date().getFullYear()} Daily Devotionals. All rights reserved.</p>
          <p className="mt-2 text-sm">Powered by Faith, Hope, and Love</p>
        </div>
      </footer>
    </div>
  );
};

export default Devotionals;