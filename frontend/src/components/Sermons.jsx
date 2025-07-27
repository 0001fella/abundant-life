import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Download, Calendar as CalendarIcon, Filter, Loader2, Play, Heart, BookOpen, AlertCircle, CheckCircle, ChevronDown } from "lucide-react";
// Define your backend API base URL here.
// IMPORTANT: Replace this with the actual URL of your Node.js backend.
const API_BASE_URL = "http://localhost:5000/api";
// Hardcoded image URLs for sermon categories (used as fallbacks or if no image from backend)
const HARDCODED_IMAGES = {
  purpose: "https://placehold.co/600x400/0a2a2a/E0F2F1?text=Purpose",
  grace: "https://placehold.co/600x400/1a4a4a/E0F2F1?text=Grace",
  youth: "https://placehold.co/600x400/2a6a6a/E0F2F1?text=Youth",
  healing: "https://placehold.co/600x400/3a8a8a/E0F2F1?text=Healing",
  library: "https://placehold.co/600x400/4a9a9a/E0F2F1?text=Library",
  encouragement: "https://placehold.co/600x400/5aabaa/E0F2F1?text=Encouragement",
  teens: "https://placehold.co/600x400/6ababa/E0F2F1?text=Teens",
  default: "https://placehold.co/600x400/7acaca/E0F2F1?text=Sermon"
};
// Default sermon data that will be shown if no sermons are found from API
const DEFAULT_SERMONS = [
  {
    _id: "default-1", // Use _id for consistency with MongoDB
    title: "Walking in Purpose",
    preacher: "Pastor Grace Mwangi",
    type: "Pastors",
    date: "2025-05-12T00:00:00.000Z", // ISO string for date
    scripture: "Jeremiah 29:11",
    teaching: "God has a plan for your life. Walk boldly in His purpose...",
    tags: ["purpose", "faith", "life"],
    resources: [],
    duration: "42:18",
    views: 1245,
    likes: 89,
    image: HARDCODED_IMAGES.purpose
  },
  {
    _id: "default-2",
    title: "Overflowing Grace",
    preacher: "Bishop James Otieno",
    type: "Pastors",
    date: "2025-05-05T00:00:00.000Z",
    scripture: "2 Corinthians 9:8",
    teaching: "Grace is not just enough, it overflows in every area of your life...",
    tags: ["grace", "hope"],
    resources: [],
    image: HARDCODED_IMAGES.grace,
    duration: "38:42",
    views: 987,
    likes: 76
  },
  {
    _id: "default-3",
    title: "Youth on Fire",
    preacher: "Bro. Mike Kimani",
    type: "Youth",
    date: "2025-04-28T00:00:00.000Z",
    scripture: "1 Timothy 4:12",
    teaching: "Young people can set an example and lead revival...",
    tags: ["youth", "revival"],
    resources: [],
    image: HARDCODED_IMAGES.youth,
    duration: "35:15",
    views: 1562,
    likes: 112
  },
  {
    _id: "default-4",
    title: "Healing & Hope",
    preacher: "Guest Speaker - Jane Akinyi",
    type: "Guests",
    date: "2025-03-15T00:00:00.000Z",
    scripture: "Isaiah 53:5",
    teaching: "By His wounds we are healed – physically, spiritually, emotionally...",
    tags: ["healing", "faith"],
    resources: [],
    image: HARDCODED_IMAGES.healing,
    duration: "45:30",
    views: 2034,
    likes: 145
  },
  {
    _id: "default-5",
    title: "Teen Faith Journey",
    preacher: "Pastor Sarah Johnson",
    type: "Teens",
    date: "2025-04-10T00:00:00.000Z",
    scripture: "Proverbs 3:5-6",
    teaching: "Navigating the teenage years with faith...",
    tags: ["teens", "faith", "guidance"],
    resources: [],
    image: HARDCODED_IMAGES.teens,
    duration: "32:45",
    views: 1340,
    likes: 95
  }
];
// Removed DEFAULT_ENCOURAGEMENTS as it's no longer needed
const filterOptions = ["All", "Pastors", "Guests", "Youth", "Teens"];
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "popular", label: "Most Popular" }
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
const Sermons = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeSermon, setActiveSermon] = useState(null);
  const [selectedDate, setSelectedDate] = useState(""); // Changed to string for input type="date"
  const [sermons, setSermons] = useState([]); // State for fetched/processed sermons
  const [loading, setLoading] = useState(true); // Unified loading state
  const [error, setError] = useState(null); // Unified error state
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [showCalendarInput, setShowCalendarInput] = useState(false); // Renamed to avoid confusion with react-calendar
  // Removed states related to encouragements
  // const [encouragements, setEncouragements] = useState([]);
  // const [loadingEncouragements, setLoadingEncouragements] = useState(true);
  // const [encouragementsError, setEncouragementsError] = useState(null);
  // const [randomEncouragement, setRandomEncouragement] = useState(null);
  const [liking, setLiking] = useState({});
  const [notification, setNotification] = useState(null); // For general notifications
  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type });
    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  // --- API Fetching Functions ---
  // Fetches sermons from the backend or uses fallbacks
  const fetchSermons = useCallback(async () => {
    setLoading(true); // Start loading
    setError(null); // Clear previous errors
    try {
      console.log(`Attempting to fetch sermons from: ${API_BASE_URL}/sermons`);
      const response = await fetch(`${API_BASE_URL}/sermons`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server responded with status ${response.status}:`, errorText);
        throw new Error(`Server error: ${response.status} - ${errorText || response.statusText}`);
      }
      let data = await response.json();
      if (!data || data.length === 0) {
        console.warn("No sermons found from API, using default sermons.");
        data = DEFAULT_SERMONS;
      } else {
        // Ensure dates are Date objects and _id is mapped to id
        data = data.map(s => ({
          ...s,
          id: s._id,
          date: new Date(s.date) // Convert date string to Date object for consistent handling
        }));
      }
      setSermons(data);
      showNotification("Sermons loaded successfully!", "success");
    } catch (err) {
      console.error("Error fetching sermons:", err);
      let errorMessage = `Failed to load sermons: ${err.message}. `;
      if (err.message.includes("Failed to fetch")) {
        errorMessage += "This often means the backend server is not running or is inaccessible. Please check your Node.js server and ensure CORS is correctly configured.";
      } else {
        errorMessage += "Please try again later.";
      }
      setError(errorMessage);
      // Fallback to default sermons on error
      setSermons(DEFAULT_SERMONS.map(s => ({
        ...s,
        id: s._id,
        date: new Date(s.date) // Ensure default dates are also Date objects
      })));
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false); // Stop loading regardless of success or error
    }
  }, [showNotification]);
  // Removed fetchEncouragements as it's no longer needed
  // const fetchEncouragements = useCallback(async () => {
  //   setLoadingEncouragements(true);
  //   setEncouragementsError(null);
  //   try {
  //     console.log(`Fetching encouragements from: ${API_BASE_URL}/encouragements`);
  //     const response = await fetch(`${API_BASE_URL}/encouragements`);
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(`Server error: ${response.status} - ${errorText || response.statusText}`);
  //     }
  //     let data = await response.json();
  //     if (!data || data.length === 0) {
  //       console.warn("No encouragements found from API, using default encouragements.");
  //       data = DEFAULT_ENCOURAGEMENTS;
  //     } else {
  //       // Map _id to id if needed
  //       data = data.map(e => ({ ...e, id: e._id }));
  //     }
  //     setEncouragements(data);
  //     setRandomEncouragement(data[Math.floor(Math.random() * data.length)]);
  //   } catch (error) {
  //     console.error("Error fetching encouragements:", error);
  //     const errorMessage = `Failed to load encouragements: ${error.message}. Using default.`;
  //     setEncouragementsError(errorMessage);
  //     setEncouragements(DEFAULT_ENCOURAGEMENTS); // Always fall back to default on error
  //     setRandomEncouragement(DEFAULT_ENCOURAGEMENTS[0]);
  //     showNotification(errorMessage, "error");
  //   } finally {
  //     setLoadingEncouragements(false);
  //   }
  // }, [showNotification]);
  // Initial data fetch on component mount
  useEffect(() => {
    fetchSermons();
    // Removed call to fetchEncouragements
    // fetchEncouragements();
  }, [fetchSermons]); // Removed fetchEncouragements from dependency array
  // Handle like functionality
  const handleLike = useCallback(async (sermonId) => {
    if (liking[sermonId]) return; // Prevent multiple clicks
    setLiking(prev => ({ ...prev, [sermonId]: true }));
    // Optimistic UI update
    setSermons(prev => prev.map(sermon =>
      sermon.id === sermonId ? { ...sermon, likes: (sermon.likes || 0) + 1 } : sermon
    ));
    if (activeSermon?.id === sermonId) {
      setActiveSermon(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    }
    try {
      console.log(`Liking sermon: ${API_BASE_URL}/sermons/${sermonId}/like`);
      const response = await fetch(`${API_BASE_URL}/sermons/${sermonId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText || response.statusText}`);
      }
      const updatedSermon = await response.json();
      // Update with actual data from server
      setSermons(prev => prev.map(sermon =>
        sermon.id === sermonId ? { ...updatedSermon, id: updatedSermon._id, date: new Date(updatedSermon.date) } : sermon
      ));
      if (activeSermon?.id === sermonId) {
        setActiveSermon({ ...updatedSermon, id: updatedSermon._id, date: new Date(updatedSermon.date) });
      }
      showNotification("Sermon liked!", "success");
    } catch (error) {
      console.error("Error updating like:", error);
      // Revert optimistic update on error
      setSermons(prev => prev.map(sermon =>
        sermon.id === sermonId ? { ...sermon, likes: Math.max(0, (sermon.likes || 0) - 1) } : sermon
      ));
      if (activeSermon?.id === sermonId) {
        setActiveSermon(prev => ({ ...prev, likes: Math.max(0, (prev.likes || 0) - 1) }));
      }
      showNotification(`Failed to like sermon: ${error.message}`, "error");
    } finally {
      setLiking(prev => ({ ...prev, [sermonId]: false }));
    }
  }, [activeSermon, liking, showNotification]);
  // --- Filtering and Sorting Logic ---
  const filteredSermons = sermons.filter((sermon) => {
    const sermonDate = new Date(sermon.date); // Ensure date is a Date object for comparison
    const matchesDate = selectedDate ?
      sermonDate.toISOString().split('T')[0] === selectedDate : true; // Compare ISO date strings
    const matchesGroup = filter === "All" || sermon.type === filter;
    const matchesSearch =
      sermon.title.toLowerCase().includes(search.toLowerCase()) ||
      (sermon.tags && sermon.tags.join(" ").toLowerCase().includes(search.toLowerCase())) ||
      sermon.preacher.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? sermon.tags && sermon.tags.includes(selectedTag) : true;
    return matchesGroup && matchesSearch && matchesTag && matchesDate;
  });
  const sortedSermons = [...filteredSermons].sort((a, b) => {
    // Ensure dates are Date objects for comparison
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (sortBy === "newest") {
      return dateB.getTime() - dateA.getTime();
    } else if (sortBy === "oldest") {
      return dateA.getTime() - dateB.getTime();
    } else if (sortBy === "popular") {
      return (b.likes || 0) - (a.likes || 0); // Handle undefined likes
    }
    return 0;
  });
  // Extract all unique tags for the tag filter
  const allTags = [...new Set(sermons.flatMap(sermon => sermon.tags || []))];
  const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return 'N/A Date'; // Handle invalid dates
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  const handleDownloadAll = (sermon) => {
    console.log("Downloading all resources for:", sermon.title);
    sermon.resources.forEach(resource => {
      // In a real app, you'd trigger a download for each resource.url
      console.log("Simulating download for:", resource.name, resource.url);
    });
    showNotification(`Initiating download for resources from "${sermon.title}". Check console for details.`, "info");
  };
  // Removed handleNewEncouragement as it's no longer needed
  // const handleNewEncouragement = () => {
  //   if (encouragements.length > 0) {
  //     setRandomEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)]);
  //   }
  // };
  // --- Loading and Error UI ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-500 h-12 w-12 mx-auto" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-gray-700"
          >
            Loading sermons...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto border border-gray-200"
        >
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Content</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()} // Reload to trigger fetch again
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-md"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="w-full bg-gray-50 text-gray-800 py-20 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-100 rounded-full opacity-50 blur-xl"></div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold mb-4 text-gray-900 relative z-10"
        >
          Sermons <span className="text-emerald-600">Library</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto relative z-10"
        >
          Explore transformative messages from our pastors and guest ministers
        </motion.p>
      </div>
      {/* Search & Filter Controls (now takes full width as encouragement section is removed) */}
      <div className="max-w-7xl mx-auto mb-16"> {/* Removed grid md:grid-cols-2 gap-8 */}
        {/* Removed Daily Encouragement Section */}
        {/* <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-bl-full opacity-70 blur-lg"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-xl font-bold flex items-center text-gray-900">
              <span className="bg-emerald-500 w-9 h-9 rounded-full flex items-center justify-center text-white text-2xl mr-3 shadow-md">
                ✨
              </span>
              Daily Encouragement
            </h3>
            <button
              onClick={handleNewEncouragement}
              className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors font-medium px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100"
            >
              New Verse
            </button>
          </div>
          {loadingEncouragements ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="animate-spin text-emerald-500" size={28} />
            </div>
          ) : (
            randomEncouragement ? (
              <div className="space-y-4 relative z-10">
                <blockquote className="text-xl font-medium text-gray-800 italic pl-4 border-l-4 border-emerald-500 py-1">
                  "{randomEncouragement.text}"
                </blockquote>
                <p className="text-emerald-600 font-semibold">{randomEncouragement.verse}</p>
                <p className="text-gray-600">
                  {randomEncouragement.teaching}
                </p>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">No encouragement available.</div>
            )
          )}
          {encouragementsError && (
            <div className="text-red-600 text-sm mt-4 flex items-center">
              <AlertCircle size={16} className="mr-2" /> {encouragementsError}
            </div>
          )}
        </motion.div> */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} // Adjusted initial animation for full width
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg"
        >
          <h3 className="text-xl font-bold mb-6 text-gray-900">
            Find a Sermon
          </h3>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-500" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by title, preacher, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition bg-white text-gray-800 shadow-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white text-gray-800 shadow-sm pr-10"
              >
                {filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "All" ? "All Sermons" : option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown size={20} />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center gap-2 text-gray-800 shadow-sm transition-colors"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner"
              >
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <div className="flex gap-2 flex-wrap">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                          sortBy === option.value
                            ? 'bg-emerald-600 text-white font-medium shadow-sm'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Tag</label>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedTag(null)}
                      className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                        !selectedTag
                          ? 'bg-emerald-600 text-white font-medium shadow-sm'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All Tags
                    </button>
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                        className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                          tag === selectedTag
                            ? 'bg-emerald-600 text-white font-medium shadow-sm'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      {/* Sermon Cards */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <h2 className="text-3xl font-bold mb-4 sm:mb-0 text-gray-900">Recent Sermons</h2>
          <button
            onClick={() => setShowCalendarInput(!showCalendarInput)}
            className="flex items-center text-emerald-700 hover:text-emerald-900 transition-colors font-semibold px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
          >
            <span className="mr-2">Filter by Date</span>
            <CalendarIcon size={18} />
          </button>
        </div>
        <AnimatePresence>
          {showCalendarInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Select Sermon Date</h3>
                <button onClick={() => setShowCalendarInput(false)} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate("")}
                  className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
                >
                  Clear Date Filter
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {sortedSermons.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-lg">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Sermons Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              No sermons match your current filters or search. Please adjust your criteria.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {sortedSermons.map((sermon, index) => (
                <motion.div
                  key={sermon.id || sermon._id} // Use id or _id as key
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer group flex flex-col h-full"
                  onClick={() => setActiveSermon(sermon)}
                >
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={sermon.image || HARDCODED_IMAGES.default} // Fallback image
                      alt={sermon.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.onerror = null; e.target.src = HARDCODED_IMAGES.default; }} // Image error fallback
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-emerald-500 p-4 rounded-full text-white shadow-lg">
                        <Play size={28} fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-gray-900/70 text-white text-xs px-3 py-1 rounded-full shadow-md">
                      {sermon.duration || 'N/A'}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition">
                        {sermon.title}
                      </h3>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        sermon.type === "Pastors" ? "bg-emerald-100 text-emerald-800" :
                        sermon.type === "Youth" ? "bg-blue-100 text-blue-800" :
                        sermon.type === "Teens" ? "bg-indigo-100 text-indigo-800" :
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {sermon.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {sermon.preacher}
                    </p>
                    <p className="text-sm text-emerald-600 font-semibold mb-4">
                      {sermon.scripture}
                    </p>
                    <p className="text-base text-gray-700 line-clamp-2 mb-4">
                      {sermon.teaching}
                    </p>
                    <div className="mt-auto flex justify-between items-center text-sm text-gray-500">
                      <span>{formatDate(sermon.date)}</span>
                      <button
                        className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${liking[sermon.id] ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-50 hover:text-red-600'}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent opening modal when liking
                          handleLike(sermon.id);
                        }}
                        disabled={liking[sermon.id]}
                      >
                        {liking[sermon.id] ? (
                          <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                          <Heart size={16} className="text-red-500 fill-red-500" />
                        )}
                        <span className="text-gray-700">{sermon.likes || 0}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      {/* Full Sermon Library CTA */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-10 mb-12 relative overflow-hidden border border-emerald-200 shadow-xl">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="pattern-dots pattern-emerald-200 pattern-opacity-20 pattern-size-4"></div>
          </div>
          <div className="relative z-10">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="text-gray-900">
                <h2 className="text-3xl font-bold mb-4">Full Sermon Library</h2>
                <p className="text-emerald-700 text-lg mb-6">
                  Access our entire collection of sermons, teachings, and resources.
                  Browse by series, topic, or speaker to find exactly what you're looking for.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-full font-semibold transition-colors shadow-md">
                    Browse All Sermons
                  </button>
                  <button className="bg-transparent border border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-800 px-7 py-3 rounded-full font-semibold transition-colors shadow-sm">
                    View Teaching Series
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-emerald-200 shadow-sm flex flex-col items-center text-center">
                  <div className="bg-emerald-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Audio Library</h3>
                  <p className="text-sm text-emerald-700 mt-1">Listen to sermons on the go</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-emerald-200 shadow-sm flex flex-col items-center text-center">
                  <div className="bg-emerald-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-md">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Study Guides</h3>
                  <p className="text-sm text-emerald-700 mt-1">Deeper study resources</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-emerald-200 shadow-sm flex flex-col items-center text-center">
                  <div className="bg-emerald-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Video Messages</h3>
                  <p className="text-sm text-emerald-700 mt-1">Watch full services</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-emerald-200 shadow-sm flex flex-col items-center text-center">
                  <div className="bg-emerald-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Transcripts</h3>
                  <p className="text-sm text-emerald-700 mt-1">Read full sermon texts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for sermon details */}
      <AnimatePresence>
        {activeSermon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setActiveSermon(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <button
                onClick={() => setActiveSermon(null)}
                className="absolute top-4 right-4 z-10 bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-200 transition-colors"
                aria-label="Close sermon details"
              >
                <X size={20} className="text-gray-700" />
              </button>
              <div className="h-72 bg-gray-800 overflow-hidden relative rounded-t-2xl">
                <img
                  src={activeSermon.image || HARDCODED_IMAGES.default}
                  alt={activeSermon.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = HARDCODED_IMAGES.default; }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-6">
                  <h3 className="text-3xl font-bold text-white mb-1">
                    {activeSermon.title}
                  </h3>
                  <p className="text-emerald-400 text-lg">
                    {activeSermon.preacher} • {formatDate(activeSermon.date)}
                  </p>
                </div>
              </div>
              <div className="p-8">
                <div className="flex flex-wrap gap-6 mb-8 items-center">
                  <div className="flex items-center gap-2 text-base text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {activeSermon.duration || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-base text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {(activeSermon.views || 0).toLocaleString()} views
                  </div>
                  <button
                    className="flex items-center gap-2 text-base text-gray-600 hover:text-red-600 transition-colors"
                    onClick={() => handleLike(activeSermon.id)}
                    disabled={liking[activeSermon.id]}
                  >
                    {liking[activeSermon.id] ? (
                      <Loader2 className="animate-spin h-6 w-6" />
                    ) : (
                      <Heart size={20} className="text-red-500 fill-red-500" />
                    )}
                    {(activeSermon.likes || 0).toLocaleString()} likes
                  </button>
                </div>
                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 mb-3 text-xl">
                    Scripture: <span className="font-normal text-gray-700">{activeSermon.scripture}</span>
                  </h4>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {activeSermon.teaching}
                  </p>
                </div>
                {activeSermon.tags && activeSermon.tags.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-bold text-gray-900 mb-3 text-xl">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeSermon.tags.map(tag => (
                        <span key={tag} className="bg-emerald-100 text-emerald-800 text-sm px-3 py-1 rounded-full font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {activeSermon.resources && activeSermon.resources.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 text-xl">Resources:</h4>
                    <div className="space-y-3">
                      {activeSermon.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <span className="flex items-center gap-3 text-gray-800 font-medium">
                            <Download size={20} className="text-emerald-600" />
                            {resource.name}
                          </span>
                          <span className="text-sm text-gray-500">{resource.type}</span>
                        </a>
                      ))}
                    </div>
                    <button
                      onClick={() => handleDownloadAll(activeSermon)}
                      className="mt-6 w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
                    >
                      Download All Resources
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
export default Sermons;