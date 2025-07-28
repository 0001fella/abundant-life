import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Search, ChevronRight, Lock, LogOut, RefreshCw, BookOpen } from 'lucide-react';

// --- Updated API Configuration ---
// Use the deployed backend URL for production, localhost for development
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000' // Adjust this if your local backend port is different, but keep the base URL without /api
  : 'https://abundant-life.onrender.com'; // *** IMPORTANT: Using your Render backend URL base ***
// --- End of Updated API Configuration ---

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setFetchError] = useState(null);
  const [today] = useState(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  });
  const [lastRefresh, setLastRefresh] = useState(null);
  const [visibleEvents, setVisibleEvents] = useState(6);

  // Categories and fallback images (kept as is)
  const categories = ['All', 'General Church Events', 'Youths', 'Teens', 'Sunday School', 'Women of Faith', 'Visionaries'];
  const fallbackImages = {
    "General Church Events": '/ALCC.jpg',
    "Youths": "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    "Teens": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    "Sunday School": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    "Women of Faith": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    "Visionaries": "https://images.unsplash.com/photo-1517486808906-6ca8b3f99846?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    "default": "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
  };

  // Helper functions for date/time formatting (kept as is)
  const formatEventDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatEventTime = (dateStr) => {
    const date = new Date(dateStr);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const parseEventDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) {
      return new Date(dateStr.replace(/-/g, '/'));
    }
    return date;
  };

  // --- Updated Fetch Events Function ---
  // Fetch events using the new API_BASE_URL logic
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setFetchError(null); // Clear previous errors
    try {
      // Construct the full API endpoint URL
      const apiUrl = `${API_BASE_URL}/api/events`;
      console.log(`Attempting to fetch events from: ${apiUrl}`);

      const response = await fetch(apiUrl);
      if (!response.ok) {
        // If the response is not OK, it means the server responded but with an error status
        const errorText = await response.text(); // Get raw text to help debug
        throw new Error(`Server responded with status ${response.status}: ${errorText || response.statusText}`);
      }
      const data = await response.json();

      // Format the data as before
      const formattedEvents = data.map(event => {
        const dateObj = parseEventDate(event.date);
        return {
          ...event,
          displayDate: formatEventDate(event.date),
          displayTime: formatEventTime(dateObj.toISOString())
        };
      });

      setEvents(formattedEvents);
      setFetchError(null); // Clear any previous errors on success
      setLastRefresh(new Date()); // Update last refresh time
    } catch (err) {
      console.error('Error fetching events:', err);
      // Provide more specific error message for network issues
      if (err.message.includes("Failed to fetch")) {
        setFetchError("Could not connect to the backend server. Please ensure your Node.js backend is running and accessible, and check your API_BASE_URL and CORS settings.");
      } else {
        setFetchError('Failed to load events. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]); // Add API_BASE_URL as a dependency
  // --- End of Updated Fetch Events Function ---

  useEffect(() => {
    fetchEvents();
    const savedLogin = localStorage.getItem('churchAdmin');
    if (savedLogin) {
      setIsAdmin(true);
    }
    // Removed the interval for simplicity, can be added back if needed
    // const intervalId = setInterval(fetchEvents, 30000);
    // return () => clearInterval(intervalId);
  }, [fetchEvents]);

  const filteredEvents = events.filter(event => {
    if (selectedCategory !== 'All') {
      const normalizedCategory = event.category?.trim().toLowerCase();
      const officialCategory = categories.find(cat =>
        cat.toLowerCase() === normalizedCategory
      );
      if (!officialCategory) return false;
    }
    const matchesSearch = searchTerm === '' ||
      (event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       event.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  }).slice(0, visibleEvents);

  const handleRefresh = () => {
    fetchEvents();
  };

  const handleLogout = () => {
    localStorage.removeItem('churchAdmin');
    setIsAdmin(false);
  };

  const getEventImage = (category) => {
    return fallbackImages[category] || fallbackImages['default'];
  };

  const isUpcoming = (eventDateStr) => {
    const eventDate = new Date(eventDateStr);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1427] to-[#1a2d4d] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin text-emerald-500 h-12 w-12 mx-auto mb-4" />
          <p className="text-white text-xl">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1427] to-[#1a2d4d] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#0c1b33] p-8 rounded-2xl shadow-xl max-w-md w-full border border-emerald-500/30 text-center"
        >
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Events</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a1427] to-[#1a2d4d] text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509059852496-f3822ae057bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center opacity-20"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto"
        >
          <motion.div
            className="inline-block mb-4 bg-emerald-500/20 text-emerald-400 rounded-full px-4 py-1 text-sm font-medium tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            UPCOMING EVENTS
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Join Us for <span className="text-emerald-400">Worship & Fellowship</span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Experience the power of community through our upcoming events and gatherings
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isAdmin ? (
              <>
                <motion.button
                  onClick={handleRefresh}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-bold text-lg hover:bg-emerald-700 transition flex items-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Refresh Events <RefreshCw className="ml-2 h-5 w-5" />
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  className="px-8 py-4 bg-transparent border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg font-bold text-lg transition flex items-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Logout <LogOut className="ml-2 h-5 w-5" />
                </motion.button>
              </>
            ) : (
              <motion.a
                href="/login"
                className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-bold text-lg hover:bg-emerald-700 transition flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Admin Login <Lock className="ml-2 h-5 w-5" />
              </motion.a>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-6">
              <div className="absolute left-3 top-3 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#1a2d4d] bg-[#0a1427] text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-lg"
              />
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-base font-medium transition ${
                    selectedCategory === category
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-[#0c1b33] text-gray-300 border border-emerald-500/30 hover:bg-emerald-500/10'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {selectedCategory} <span className="text-emerald-500">({filteredEvents.length})</span>
            </h2>
            <p className="text-gray-400">
              Showing {filteredEvents.length} of {events.length} events
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="bg-[#0c1b33]/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                  <Search className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  We couldn't find any events matching your search. Try different keywords or check back later.
                </p>
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  className="rounded-2xl overflow-hidden shadow-xl border border-emerald-500/20 bg-[#0c1b33]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="relative">
                    <img
                      src={getEventImage(event.category)}
                      alt={event.title}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1b33] to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isUpcoming(event.date) ? 'bg-emerald-500 text-[#0c1b33]' : 'bg-gray-700 text-gray-300'
                      }`}>
                        {isUpcoming(event.date) ? 'Upcoming' : 'Past Event'}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                      <div className="flex items-center text-gray-300 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{event.displayDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-4 mb-4 text-gray-300">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-emerald-500" />
                        <span>{event.displayTime}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-emerald-500" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-6 line-clamp-3">{event.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-medium border border-emerald-500/30">
                        {event.category}
                      </span>
                      <motion.button
                        className="flex items-center text-emerald-500 hover:text-white transition-colors font-medium"
                        whileHover={{ x: 5 }}
                      >
                        View Details <ChevronRight className="w-5 h-5 ml-1" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0c1b33]/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="bg-[#0a1427] p-6 rounded-2xl shadow-lg border border-emerald-500/20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-emerald-500 mb-2">
                {events.filter(e => isUpcoming(e.date)).length}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Upcoming Events</h3>
              <p className="text-gray-400">Mark your calendars</p>
            </motion.div>
            <motion.div
              className="bg-[#0a1427] p-6 rounded-2xl shadow-lg border border-emerald-500/20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-emerald-500 mb-2">
                {events.filter(e => !isUpcoming(e.date)).length}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Past Events</h3>
              <p className="text-gray-400">Relive the moments</p>
            </motion.div>
            <motion.div
              className="bg-[#0a1427] p-6 rounded-2xl shadow-lg border border-emerald-500/20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl font-bold text-emerald-500 mb-2">
                {new Set(events.map(e => e.category)).size}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Event Categories</h3>
              <p className="text-gray-400">Worship, Bible Study & More</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Encouragement Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#0c1b33] to-[#1a2d4d]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="bg-emerald-500/10 p-10 rounded-2xl border border-emerald-500/20 inline-block">
              <BookOpen className="mx-auto mb-4 text-emerald-500" size={40} />
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                "Let us not give up meeting together, as some are in the habit of doing, but let us encourage one another—and all the more as you see the Day approaching."
              </h3>
              <p className="text-lg text-emerald-500 max-w-xl mx-auto">
                Hebrews 10:25
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-[#0a1427] border-t border-emerald-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span className="text-emerald-500">ALCC</span> Events
              </div>
              <p className="text-gray-400">Abundant Life Celebration Center</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">Nairobi, Kenya</p>
              <p className="text-gray-400">© {new Date().getFullYear()} ALCC Ministries. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Events;