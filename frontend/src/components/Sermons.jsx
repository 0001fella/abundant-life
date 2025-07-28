import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Heart, Loader2, Play, Clock, Eye, BookOpen, Calendar, User, ChevronDown, X } from 'lucide-react';

// --- Updated API Configuration ---
// Use the deployed backend URL for production, localhost for development
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api' // Adjust this if your local backend port is different
  : 'https://abundant-life.onrender.com/api'; // *** IMPORTANT: Using your Render backend URL ***
// --- End of Updated API Configuration ---

// Hardcoded images mapping (kept as is)
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

// Default sermons data (kept as is)
const DEFAULT_SERMONS = [
  {
    _id: "default-1",
    title: "Walking in Purpose",
    preacher: "Pastor Grace Moraa",
    type: "Pastors",
    date: "2025-05-12T00:00:00.000Z",
    scripture: "Jeremiah 29:11",
    teaching: "God has a specific plan and purpose for each of our lives...",
    tags: ["purpose", "hope"],
    resources: [],
    image: HARDCODED_IMAGES.purpose,
    duration: "42:18",
    views: 1250,
    likes: 89
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
    views: 720,
    likes: 65
  },
  {
    _id: "default-4",
    title: "Healing is Here",
    preacher: "Pastor Caroline Barasa",
    type: "Pastors",
    date: "2025-04-21T00:00:00.000Z",
    scripture: "Isaiah 53:5",
    teaching: "Jesus bore our sickness and by His stripes we are healed...",
    tags: ["healing", "faith"],
    resources: [],
    image: HARDCODED_IMAGES.healing,
    duration: "45:30",
    views: 1100,
    likes: 92
  },
  {
    _id: "default-5",
    title: "Building Your Library",
    preacher: "Dr. Dennis Otieno",
    type: "Guests",
    date: "2025-04-14T00:00:00.000Z",
    scripture: "Joshua 1:8",
    teaching: "Meditating on God's Word day and night leads to prosperity...",
    tags: ["library", "meditation"],
    resources: [],
    image: HARDCODED_IMAGES.library,
    duration: "40:22",
    views: 850,
    likes: 58
  },
  {
    _id: "default-6",
    title: "Words of Encouragement",
    preacher: "Sis. Mayaka Moriasi",
    type: "Guests",
    date: "2025-04-07T00:00:00.000Z",
    scripture: "Isaiah 41:10",
    teaching: "Fear not, for I am with you; be not dismayed...",
    tags: ["encouragement", "strength"],
    resources: [],
    image: HARDCODED_IMAGES.encouragement,
    duration: "32:45",
    views: 680,
    likes: 51
  }
];

const Sermons = () => {
  const [sermons, setSermons] = useState([]);
  const [filteredSermons, setFilteredSermons] = useState([]);
  const [activeSermon, setActiveSermon] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [liking, setLiking] = useState({});
  const [error, setError] = useState(null); // State for API errors

  // Fetch sermons from your Node.js/MongoDB backend
  const fetchSermons = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      console.log(`Attempting to fetch sermons from: ${API_BASE_URL}/sermons`);
      const response = await fetch(`${API_BASE_URL}/sermons`);
      if (!response.ok) {
        // If the response is not OK, it means the server responded but with an error status
        const errorText = await response.text(); // Get raw text to help debug
        throw new Error(`Server responded with status ${response.status}: ${errorText || response.statusText}`);
      }
      const data = await response.json();
      // Map the fetched data, using hardcoded images based on type/tag as fallback
      const formattedSermons = data.map(sermon => {
        // Determine image based on type or first tag, fallback to default
        let imageUrl = HARDCODED_IMAGES.default;
        if (sermon.type && HARDCODED_IMAGES[sermon.type.toLowerCase()]) {
          imageUrl = HARDCODED_IMAGES[sermon.type.toLowerCase()];
        } else if (Array.isArray(sermon.tags) && sermon.tags.length > 0) {
          const firstTag = sermon.tags[0].toLowerCase();
          if (HARDCODED_IMAGES[firstTag]) {
             imageUrl = HARDCODED_IMAGES[firstTag];
          }
        }
        return {
          ...sermon,
          id: sermon._id, // Ensure consistent ID
          image: imageUrl, // Use hardcoded image
          // Ensure likes/views are numbers
          likes: sermon.likes ? Number(sermon.likes) : 0,
          views: sermon.views ? Number(sermon.views) : 0,
        };
      });
      setSermons(formattedSermons);
    } catch (err) {
      console.error("Error fetching sermons:", err);
      // Provide more specific error message for network issues
      if (err.message.includes("Failed to fetch")) {
        setError("Could not connect to the backend server. Please ensure your Node.js backend is running and accessible, and check your API_BASE_URL and CORS settings.");
        // Fallback to default sermons on network error
        const formattedDefaults = DEFAULT_SERMONS.map(s => ({ ...s, id: s._id, likes: Number(s.likes), views: Number(s.views) }));
        setSermons(formattedDefaults);
      } else {
        setError(`Failed to load sermons: ${err.message}. Please try again later.`);
        // Fallback to default sermons on other errors
        const formattedDefaults = DEFAULT_SERMONS.map(s => ({ ...s, id: s._id, likes: Number(s.likes), views: Number(s.views) }));
        setSermons(formattedDefaults);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  // Filter and sort sermons
  useEffect(() => {
    let result = [...sermons];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(sermon =>
        sermon.title.toLowerCase().includes(query) ||
        sermon.preacher.toLowerCase().includes(query) ||
        sermon.scripture.toLowerCase().includes(query) ||
        (Array.isArray(sermon.tags) && sermon.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Type filter
    if (selectedType !== 'All') {
      result = result.filter(sermon => sermon.type === selectedType);
    }

    // Tag filter
    if (selectedTag) {
      result = result.filter(sermon =>
        Array.isArray(sermon.tags) && sermon.tags.includes(selectedTag)
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'liked':
          return (b.likes || 0) - (a.likes || 0);
        case 'newest':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    setFilteredSermons(result);
  }, [sermons, searchQuery, selectedType, selectedTag, sortOption]);

  const allTags = [...new Set(sermons.flatMap(sermon =>
    Array.isArray(sermon.tags) ? sermon.tags : []
  ))];

  const handleLike = async (sermonId) => {
    if (liking[sermonId]) return;
    setLiking(prev => ({ ...prev, [sermonId]: true }));

    try {
      // Update local state immediately for UI feedback
      setSermons(prevSermons =>
        prevSermons.map(sermon =>
          sermon.id === sermonId
            ? { ...sermon, likes: (sermon.likes || 0) + 1 }
            : sermon
        )
      );

      // Send like request to backend
      const response = await fetch(`${API_BASE_URL}/sermons/${sermonId}/like`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to like sermon: ${response.status}`);
      }

      const updatedSermon = await response.json();
      // Update state with the actual value from backend
      setSermons(prevSermons =>
        prevSermons.map(sermon =>
          sermon.id === sermonId
            ? { ...sermon, likes: updatedSermon.likes }
            : sermon
        )
      );
    } catch (err) {
      console.error('Error liking sermon:', err);
      // Revert local state change on error
      setSermons(prevSermons =>
        prevSermons.map(sermon =>
          sermon.id === sermonId
            ? { ...sermon, likes: Math.max(0, (sermon.likes || 0) - 1) }
            : sermon
        )
      );
    } finally {
      setLiking(prev => ({ ...prev, [sermonId]: false }));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-600 h-12 w-12 mx-auto mb-4" />
          <p className="text-gray-700 text-xl">Loading sermons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-emerald-200 text-center"
        >
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Sermons</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchSermons}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center mx-auto"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden bg-gradient-to-r from-emerald-700 to-teal-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509059852496-f3822ae057bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center opacity-20"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto"
        >
          <motion.div
            className="inline-block mb-4 bg-emerald-500/20 text-emerald-200 rounded-full px-4 py-1 text-sm font-medium tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            SERMON LIBRARY
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Dive Deep Into <span className="text-emerald-200">God's Word</span>
          </motion.h1>
          <motion.p
            className="text-xl text-emerald-100 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Explore our collection of powerful sermons and teachings to grow in your faith
          </motion.p>
        </motion.div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-6 max-w-2xl mx-auto">
              <div className="absolute left-3 top-3 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search sermons by title, preacher, scripture, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-lg"
              />
            </div>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <div className="flex items-center gap-2">
                <Filter className="text-emerald-600" size={20} />
                <span className="font-medium text-gray-700">Filter:</span>
              </div>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none bg-white border border-emerald-200 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="Pastors">Pastors</option>
                  <option value="Guests">Guests</option>
                  <option value="Youth">Youth</option>
                  <option value="Teens">Teens</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-white border border-emerald-200 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="liked">Most Liked</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
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
          </motion.div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Sermons <span className="text-emerald-600">({filteredSermons.length})</span>
            </h2>
            <p className="text-gray-600">
              Showing {filteredSermons.length} of {sermons.length} sermons
            </p>
          </div>

          {/* Sermons Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredSermons.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Sermons Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We couldn't find any sermons matching your search. Try different keywords or filters.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredSermons.map((sermon, index) => (
                  <motion.div
                    key={sermon.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-emerald-100 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => setActiveSermon(sermon)}
                  >
                    <div className="relative">
                      <img
                        src={sermon.image} // *** KEY CHANGE: Use the hardcoded image URL ***
                        alt={sermon.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-100 rounded-full text-sm font-medium border border-emerald-500/30">
                          {sermon.type}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white line-clamp-1">{sermon.title}</h3>
                        <p className="text-emerald-200 text-sm">{sermon.preacher}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-4 mb-4 text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-emerald-500" />
                          <span className="text-sm">{formatDate(sermon.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-emerald-500" />
                          <span className="text-sm">{sermon.duration || 'N/A'}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-6 line-clamp-2">{sermon.teaching}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-emerald-500" />
                            <span>{(sermon.views || 0).toLocaleString()}</span>
                          </div>
                          <button
                            className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
                              liking[sermon.id]
                                ? 'opacity-70 cursor-not-allowed'
                                : 'hover:bg-red-50 hover:text-red-600'
                            }`}
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
                        <motion.button
                          className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors font-medium"
                          whileHover={{ x: 5 }}
                        >
                          Watch <Play className="w-5 h-5 ml-1" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>

      {/* Full Sermon Library CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white/10 p-10 rounded-2xl border border-white/20 inline-block">
              <BookOpen className="mx-auto mb-4 text-white" size={40} />
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                Explore Our Complete Sermon Library
              </h3>
              <p className="text-lg text-emerald-100 max-w-xl mx-auto mb-8">
                Dive deeper into God's Word with our extensive collection of teachings and messages
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-emerald-700 font-bold rounded-full shadow-lg hover:bg-emerald-50 transition-all"
              >
                View All Sermons
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-emerald-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span className="text-emerald-300">ALCC</span> Sermons
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

      {/* Sermon Detail Modal */}
      <AnimatePresence>
        {activeSermon && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveSermon(null)}
          >
            <motion.div
              className="relative rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={activeSermon.image} // *** KEY CHANGE: Use the hardcoded image URL ***
                  alt={activeSermon.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <button
                  onClick={() => setActiveSermon(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition"
                >
                  <X size={24} />
                </button>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{activeSermon.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>{activeSermon.preacher}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(activeSermon.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{activeSermon.duration || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                      {activeSermon.type}
                    </span>
                    {Array.isArray(activeSermon.tags) && activeSermon.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-base text-gray-600">
                      <Eye className="w-5 h-5 text-emerald-500" />
                      <span>{(activeSermon.views || 0).toLocaleString()} views</span>
                    </div>
                    <button
                      className="flex items-center gap-2 text-base text-gray-600 hover:text-red-600 transition-colors"
                      onClick={() => handleLike(activeSermon.id)}
                      disabled={liking[activeSermon.id]}
                    >
                      {liking[activeSermon.id] ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        <Heart size={20} className="text-red-500 fill-red-500" />
                      )}
                      <span>{(activeSermon.likes || 0).toLocaleString()} likes</span>
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 mb-3 text-xl">
                    Scripture: <span className="font-normal text-gray-700">{activeSermon.scripture}</span>
                  </h4>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {activeSermon.teaching}
                  </p>
                </div>

                {activeSermon.resources && activeSermon.resources.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-xl">Related Resources</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {activeSermon.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200"
                        >
                          <BookOpen className="w-6 h-6 text-emerald-600 mr-3 flex-shrink-0" />
                          <div>
                            <h5 className="font-medium text-gray-900">{resource.title}</h5>
                            <p className="text-sm text-gray-600">{resource.type}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sermons;