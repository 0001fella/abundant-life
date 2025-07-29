import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Search, ChevronRight, Lock, LogOut, RefreshCw, BookOpen, XCircle } from 'lucide-react';

// --- Updated API Configuration ---
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
  const [selectedEvent, setSelectedEvent] = useState(null); // State for clicked event

  // Updated categories
  const categories = ['All', 'General', 'Youths', 'Teens', 'Children', 'Women', 'Men'];
  
  // Nested fallback images by category and type
  const fallbackImages = {
    "General": {
      "Meeting": '/mission.jpg',
      "Service": '/service.jpg',
      "Conference": '/conference.jpg',
      "Workshop": '/workshop.jpg',
      "default": '/mission.jpg'
    },
    "Youths": {
      "Meeting": '/youth-meeting.jpg',
      "Service": '/youth-service.jpg',
      "Conference": '/youth-conference.jpg',
      "Workshop": '/youth-workshop.jpg',
      "default": "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
    },
    "Teens": {
      "Meeting": '/teens-meeting.jpg',
      "Service": '/teens-service.jpg',
      "Conference": '/teens-conference.jpg',
      "Workshop": '/teens-workshop.jpg',
      "default": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
    },
    "Women": {
      "Meeting": '/women-meeting.jpg',
      "Service": '/women-service.jpg',
      "Conference": '/women-conference.jpg',
      "Workshop": '/women-workshop.jpg',
      "default": '/women.jpg'
    },
    "Men": {
      "Meeting": '/men-meeting.jpg',
      "Service": '/men-service.jpg',
      "Conference": '/men-conference.jpg',
      "Workshop": '/men-workshop.jpg',
      "default": '/vissionary.jpg'
    },
    "Children": {
      "Meeting": '/children-meeting.jpg',
      "Service": '/children-service.jpg',
      "Conference": '/children-conference.jpg',
      "Workshop": '/children-workshop.jpg',
      "default": '/child.jpg'
    },
    "default": '/ALCC.jpg'
  };

  // Helper functions for date/time formatting
  const formatEventDate = (dateStr) => {
    if (!dateStr) return 'Date TBD'; // Handle missing date
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatEventTime = (dateStr) => {
    if (!dateStr) return 'To be discussed'; // Changed: "To be discussed" for missing time
    const date = new Date(dateStr);
    // Check if the date is valid and not a default empty date
    if (isNaN(date.getTime()) || date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
        return 'To be discussed';
    }
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

  // Helper function to get the full image URL from backend
  const getFullImageUrl = useCallback((imagePath) => {
    if (!imagePath) return null; // No image path provided
    if (imagePath.startsWith('http')) {
      return imagePath; // Already a full URL (e.g., Unsplash)
    }
    // Ensure imagePath doesn't have a leading slash if API_BASE_URL already ends with one
    const normalizedImagePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${API_BASE_URL}/${normalizedImagePath}`;
  }, [API_BASE_URL]);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const apiUrl = `${API_BASE_URL}/api/events`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with status ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      const formattedEvents = data.map(event => {
        const dateObj = parseEventDate(event.date);
        return {
          ...event,
          displayDate: formatEventDate(event.date),
          displayTime: formatEventTime(event.date) // Use original event.date for time formatting
        };
      });

      setEvents(formattedEvents);
      setFetchError(null);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error fetching events:', err);
      if (err.message.includes("Failed to fetch")) {
        setFetchError("Could not connect to the backend server. Please ensure your Node.js backend is running and accessible.");
      } else {
        setFetchError('Failed to load events. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]); // Dependency added for useCallback

  useEffect(() => {
    fetchEvents();
    const savedLogin = localStorage.getItem('churchAdmin');
    if (savedLogin) {
      setIsAdmin(true);
    }
  }, [fetchEvents]);

  // Get event image with fallback - UPDATED with nested category/type structure
  const getEventImage = useCallback((event) => {
    // 1. Check if event has backend image
    if (event.image) {
      const fullUrl = getFullImageUrl(event.image);
      if (fullUrl) return fullUrl;
    }
    
    // 2. Get the category-specific fallbacks
    const categoryFallbacks = fallbackImages[event.category] || fallbackImages.default;
    
    // 3. Check if we have a specific fallback for this event type
    if (event.type && categoryFallbacks[event.type]) {
      return categoryFallbacks[event.type];
    }
    
    // 4. Fallback to category default
    return categoryFallbacks.default || fallbackImages.default;
  }, [getFullImageUrl]);

  // Check if event is upcoming
  const isUpcoming = (eventDateStr) => {
    const eventDate = new Date(eventDateStr);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      // Category filtering logic
      if (selectedCategory !== 'All') {
        const normalizedCategory = event.category?.trim().toLowerCase();
        const officialCategory = categories.find(cat =>
          cat.toLowerCase() === normalizedCategory
        );
        if (!officialCategory) return false; // Filter out if category doesn't match a known category
      }

      // Search term filtering logic
      const matchesSearch = searchTerm === '' ||
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    })
    .sort((a, b) => {
      // Sort upcoming events first (most recent first), then past events (most recent first)
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      const aUpcoming = isUpcoming(a.date);
      const bUpcoming = isUpcoming(b.date);

      if (aUpcoming && !bUpcoming) return -1;
      if (!aUpcoming && bUpcoming) return 1;
      return bDate - aDate; // Sort both upcoming and past by most recent first
    })
    .slice(0, visibleEvents);

  const handleRefresh = () => {
    fetchEvents();
  };

  const handleLogout = () => {
    localStorage.removeItem('churchAdmin');
    setIsAdmin(false);
  };

  // Function to handle opening the modal/zoom view
  const handleCardClick = (event) => {
    setSelectedEvent(event);
  };

  // Function to handle closing the modal/zoom view
  const handleCloseModal = () => {
    setSelectedEvent(null);
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
                  className={`px-6 py-2 rounded-full text-base font-medium transition-all duration-300 ${
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-1"> {/* Changed to 1 column for alternating layout */}
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
                  className={`rounded-2xl overflow-hidden shadow-xl border border-emerald-500/20 bg-[#0c1b33] transition-all duration-300 hover:border-emerald-500/50 hover:shadow-2xl cursor-pointer
                      ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex flex-col md:flex`} // Alternating layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => handleCardClick(event)}
                >
                  {/* Image Section */}
                  <div className="md:w-1/2 w-full relative">
                    <img
                      src={getEventImage(event)}
                      alt={event.title}
                      className="w-full h-64 object-cover md:h-full" // Adjusted height for alternating layout
                      onError={(e) => {
                        e.target.onerror = null;
                        const categoryFallbacks = fallbackImages[event.category] || fallbackImages.default;
                        e.target.src = categoryFallbacks.default || fallbackImages.default;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1b33] to-transparent md:bg-gradient-to-r"></div> {/* Adjusted gradient direction */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isUpcoming(event.date) ? 'bg-emerald-500 text-[#0c1b33]' : 'bg-gray-700 text-gray-300'
                      }`}>
                        {isUpcoming(event.date) ? 'Upcoming' : 'Past Event'}
                      </span>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="md:w-1/2 w-full p-6 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3> {/* Adjusted margin-bottom */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-gray-300 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-emerald-500" />
                        <span>{event.displayDate}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                        <span>{event.displayTime}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-6 line-clamp-3">{event.description}</p>
                    <div className="flex justify-start flex-wrap gap-2"> {/* Changed to justify-start and added flex-wrap */}
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-medium border border-emerald-500/30">
                        {event.category}
                      </span>
                      {event.type && (
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm font-medium border border-blue-500/30">
                          {event.type}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {events.length > visibleEvents && (
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setVisibleEvents(prev => prev + 6)}
                className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition flex items-center mx-auto"
              >
                Load More Events <ChevronRight className="w-5 h-5 ml-2" />
              </motion.button>
            </div>
          )}
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

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal} // Close on backdrop click
          >
            <motion.div
              className="bg-[#0c1b33] rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl w-full relative border border-emerald-500/30 grid md:grid-cols-2 gap-6" // Modified for 2-column layout
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10" // Added z-10 to ensure button is clickable
                aria-label="Close"
              >
                <XCircle className="w-8 h-8" />
              </button>
              
              {/* Image Side */}
              <div className="md:col-span-1 flex flex-col justify-center"> {/* Centering image vertically */}
                <img
                  src={getEventImage(selectedEvent)}
                  alt={selectedEvent.title}
                  className="w-full h-auto object-cover rounded-xl shadow-lg max-h-96 md:max-h-full" // Adjusted height for responsiveness
                  onError={(e) => {
                    e.target.onerror = null;
                    const categoryFallbacks = fallbackImages[selectedEvent.category] || fallbackImages.default;
                    e.target.src = categoryFallbacks.default || fallbackImages.default;
                  }}
                />
              </div>

              {/* Details Side */}
              <div className="md:col-span-1 flex flex-col justify-center"> {/* Centering content vertically */}
                <h3 className="text-3xl font-bold text-white mb-4 leading-tight">{selectedEvent.title}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-300 text-base mb-4"> {/* Increased text size */}
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-emerald-500" /> {/* Increased icon size */}
                    <span>{selectedEvent.displayDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-emerald-500" />
                    <span>{selectedEvent.displayTime}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-emerald-500" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">{selectedEvent.description}</p> {/* Enhanced readability */}
                {selectedEvent.organizer && (
                  <p className="text-gray-400 text-sm mb-1">
                    <span className="font-semibold text-emerald-300">Organized by:</span> {selectedEvent.organizer}
                  </p>
                )}
                {selectedEvent.contact && (
                  <p className="text-gray-400 text-sm">
                    <span className="font-semibold text-emerald-300">Contact:</span> {selectedEvent.contact}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-medium border border-emerald-500/30">
                    {selectedEvent.category}
                  </span>
                  {selectedEvent.type && (
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm font-medium border border-blue-500/30">
                      {selectedEvent.type}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;