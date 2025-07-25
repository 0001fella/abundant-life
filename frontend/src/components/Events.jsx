import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Search, ChevronRight, Lock, LogOut, RefreshCw, BookOpen } from "lucide-react";

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
  
  // Get backend URL from environment variables
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  const categories = [
    'All', 
    'General Church Events', 
    'Youths', 
    'Teens', 
    'Sunday School', 
    'Women of Faith', 
    'Visionaries'
  ];

  const fallbackImages = {
    "General Church Events": '/ALCC.jpg',
    "Youths": "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "Teens": "https://images.unsplash.com/photo-1603383928958-c8c3f1db1d5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "Sunday School": '/child.jpg',
    "Women of Faith": '/women.jpg',
    "Visionaries": '/vissionary.jpg'
  };

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

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/events?t=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      const formattedEvents = data.map(event => {
        const dateObj = parseEventDate(event.date);
        return {
          ...event,
          displayDate: formatEventDate(event.date),
          displayTime: formatEventTime(dateObj.toISOString())
        };
      });
      
      setEvents(formattedEvents);
      setFetchError(null);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error fetching events:', err);
      setFetchError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);
  
  useEffect(() => {
    fetchEvents();
    
    const savedLogin = localStorage.getItem('churchAdmin');
    if (savedLogin) {
      setIsAdmin(true);
    }
    
    const intervalId = setInterval(fetchEvents, 30000);
    return () => clearInterval(intervalId);
  }, [fetchEvents]);

  const filteredEvents = events.filter(event => {
    if (selectedCategory !== 'All') {
      const normalizedCategory = event.category?.trim().toLowerCase();
      const officialCategory = categories.find(cat => 
        cat.toLowerCase() === normalizedCategory
      );
      if (!officialCategory || officialCategory !== selectedCategory) {
        return false;
      }
    }
    
    if (searchTerm) {
      return (
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return true;
  });

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('churchAdmin');
  };

  const loadMore = () => {
    setVisibleEvents(prev => prev + 6);
  };

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
    <div className="min-h-screen bg-gradient-to-b from-[#0c1b33] to-[#0a1427] text-gray-200">
      {/* Hero Section - Dark Blue/Green Theme */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-[#0c1b33] to-[#0a1427]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/45-degree-fabric-dark.png')]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            className="inline-flex items-center justify-center gap-3 mb-6 bg-[#27ae60] text-white rounded-full px-6 py-2 text-sm font-medium tracking-wider shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BookOpen size={18} />
            CHURCH EVENTS
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Connect Through <span className="text-[#27ae60]">Meaningful</span> Gatherings
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Join our community events to grow in faith and build lasting relationships
          </motion.p>
          
          <motion.div 
            className="mt-10 flex justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.a 
              href="#events"
              className="px-8 py-4 bg-[#27ae60] hover:bg-[#219653] text-white rounded-lg font-bold text-lg transition flex items-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Events <ChevronRight className="ml-2 h-5 w-5" />
            </motion.a>
            
            {isAdmin ? (
              <>
                <motion.a 
                  href="/admin-dashboard" 
                  className="px-8 py-4 bg-[#0a1427] hover:bg-[#121f3d] text-white rounded-lg font-bold text-lg transition flex items-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Admin Dashboard <ChevronRight className="ml-2 h-5 w-5" />
                </motion.a>
                <motion.button 
                  onClick={fetchEvents}
                  className="px-8 py-4 bg-[#0a1427] hover:bg-[#121f3d] text-white rounded-lg font-bold text-lg transition flex items-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Refresh Events <RefreshCw className="ml-2 h-5 w-5" />
                </motion.button>
                <motion.button 
                  onClick={handleLogout}
                  className="px-8 py-4 bg-transparent border-2 border-[#27ae60] text-[#27ae60] hover:bg-[#27ae60] hover:text-white rounded-lg font-bold text-lg transition flex items-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Logout <LogOut className="ml-2 h-5 w-5" />
                </motion.button>
              </>
            ) : (
              <motion.a 
                href="/login"
                className="px-8 py-4 bg-transparent border-2 border-[#27ae60] text-[#27ae60] hover:bg-[#27ae60] hover:text-white rounded-lg font-bold text-lg transition flex items-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Admin Login <Lock className="ml-2 h-5 w-5" />
              </motion.a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Events Section - Dark Theme */}
      <section id="events" className="py-20 bg-gradient-to-b from-[#0c1b33] to-[#0a1427]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Column - Wider */}
            <div className="lg:w-8/12">
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
                    placeholder="Search events by title or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#1a2d4d] bg-[#0a1427] text-white focus:ring-2 focus:ring-[#27ae60] focus:border-[#27ae60] outline-none transition text-lg"
                  />
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Church Events 
                    <span className="text-[#27ae60]"> ({filteredEvents.length})</span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          selectedCategory === category
                            ? "bg-[#27ae60] text-white"
                            : "bg-[#0a1427] text-gray-300 border border-[#1a2d4d] hover:bg-[#121f3d]"
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Events Grid - Larger Cards */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#27ae60]"></div>
                  <p className="mt-4 text-gray-400 text-xl">Loading events...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-[#0a1427] rounded-xl border border-[#1a2d4d]">
                  <p className="text-red-400 text-xl">{error}</p>
                  <button 
                    onClick={fetchEvents}
                    className="mt-4 px-6 py-2 bg-[#27ae60] text-white rounded-lg"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredEvents.length === 0 ? (
                <motion.div 
                  className="text-center py-16 rounded-xl border border-[#1a2d4d] bg-[#0a1427]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 border-[#1a2d4d]" />
                  <h3 className="text-xl font-semibold mb-2 text-white">No events found</h3>
                  <p className="max-w-md mx-auto text-gray-400">
                    Try adjusting your search or filter criteria.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  className="grid gap-10"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredEvents.slice(0, visibleEvents).map((event, index) => {
                    // Construct image URL with backend prefix
                    let imageUrl = fallbackImages[event.category] || fallbackImages["General Church Events"];
                    if (event.image) {
                      if (event.image.startsWith('http')) {
                        imageUrl = event.image;
                      } else {
                        imageUrl = `${backendUrl}${event.image}`;
                      }
                    }
                    
                    const eventDate = parseEventDate(event.date);
                    const isPastEvent = eventDate < today;
                    
                    return (
                      <motion.div
                        key={event.id}
                        variants={itemVariants}
                        whileHover={{ y: -10 }}
                        className="rounded-2xl shadow-xl transition-all overflow-hidden border border-[#1a2d4d] bg-[#0a1427]"
                      >
                        <div className="md:flex">
                          <div className="md:w-5/12">
                            <motion.div 
                              className="h-64 md:h-full overflow-hidden"
                              whileHover={{ scale: 1.03 }}
                              transition={{ duration: 0.4 }}
                            >
                              <img 
                                src={imageUrl} 
                                alt={event.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = fallbackImages[event.category] || fallbackImages["General Church Events"];
                                }}
                              />
                            </motion.div>
                          </div>
                          
                          <div className="p-8 md:w-7/12">
                            <div className="flex flex-wrap gap-3 mb-4">
                              <motion.span 
                                className="px-3 py-1 bg-[#1a2d4d] text-[#27ae60] rounded-full text-sm font-medium"
                                whileHover={{ scale: 1.05 }}
                              >
                                {event.category || "Church Event"}
                              </motion.span>
                              {isPastEvent && (
                                <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm font-medium">
                                  Past Event
                                </span>
                              )}
                              <span className="flex items-center text-sm text-gray-400">
                                <Calendar className="w-4 h-4 mr-1 text-[#27ae60]" />
                                {event.displayDate}
                              </span>
                            </div>
                            
                            <motion.h3 
                              className="text-2xl font-bold mb-3 text-white"
                              whileHover={{ color: "#27ae60" }}
                            >
                              {event.title}
                            </motion.h3>
                            
                            <p className="mb-6 text-gray-400">
                              {event.description}
                            </p>
                            
                            <div className="space-y-4 mb-4">
                              <div className="flex items-center text-gray-300">
                                <Clock className="w-5 h-5 mr-3 text-[#27ae60] flex-shrink-0" />
                                <div>
                                  <div className="text-white font-medium">Time</div>
                                  <div>{event.displayTime}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center text-gray-300">
                                <MapPin className="w-5 h-5 mr-3 text-[#27ae60] flex-shrink-0" />
                                <div>
                                  <div className="text-white font-medium">Location</div>
                                  <div>{event.location}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  {visibleEvents < filteredEvents.length && filteredEvents.length > 0 && (
                    <motion.div 
                      className="text-center mt-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.button 
                        whileHover={{ scale: 1.05, backgroundColor: "#219653" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={loadMore}
                        className="px-8 py-4 font-medium rounded-lg transition bg-[#27ae60] text-white hover:bg-[#219653] shadow-lg"
                      >
                        Load More Events
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
            
            {/* Sidebar - Dark Theme */}
            <div className="lg:w-4/12">
              {/* Categories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl shadow-xl border border-[#1a2d4d] bg-[#0a1427] mb-8"
              >
                <h3 className="text-xl font-bold mb-4 text-white">Event Categories</h3>
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ x: 5 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex justify-between items-center w-full px-4 py-3 rounded-lg transition ${
                        selectedCategory === category
                          ? "bg-[#1a2d4d] text-[#27ae60]"
                          : "bg-[#0c1b33] text-gray-300 hover:bg-[#121f3d]"
                      }`}
                    >
                      <span>{category}</span>
                      <span className="bg-[#1a2d4d] text-[#27ae60] text-xs font-bold px-2 py-1 rounded-full">
                        {events.filter(e => e.category === category).length}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
              
              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl shadow-xl border border-[#1a2d4d] bg-[#0a1427]"
              >
                <h3 className="text-xl font-bold mb-4 text-white">Upcoming Events</h3>
                <div className="space-y-5">
                  {events
                    .filter(event => parseEventDate(event.date) >= today)
                    .sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date))
                    .slice(0, 4)
                    .map((event) => (
                      <motion.div 
                        key={event.id}
                        whileHover={{ x: 5 }}
                        className="flex gap-4 cursor-pointer group items-start"
                      >
                        <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden">
                          <img 
                            src={
                              event.image && event.image.startsWith('http') 
                                ? event.image 
                                : fallbackImages[event.category] || fallbackImages["General Church Events"]
                            } 
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold group-hover:text-[#27ae60] transition text-white">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-400">{event.displayDate}</p>
                          <p className="text-sm text-gray-500 mt-1">{event.displayTime}</p>
                        </div>
                      </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark Green/Blue Theme */}
      <section className="py-24 bg-gradient-to-r from-[#0c352d] to-[#0c1b33]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            className="inline-block mb-6 bg-[#27ae60] text-white rounded-full px-6 py-2 text-sm font-medium tracking-wider shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            GET INVOLVED
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Host Your Event With Us
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-10 max-w-4xl mx-auto text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            We'd love to help you organize and promote your church event. Our facilities and community are here to support your ministry.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.button 
              className="px-10 py-5 bg-[#27ae60] hover:bg-[#219653] text-white rounded-lg font-bold text-lg transition shadow-lg"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(39, 174, 96, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              Submit Event Request
            </motion.button>
            <motion.button 
              className="px-10 py-5 bg-transparent hover:bg-[#27ae60]/10 border-2 border-[#27ae60] text-white rounded-lg font-bold text-lg transition shadow-lg"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(39, 174, 96, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              View Facilities
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#0a1427] border-t border-[#1a2d4d]">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Church Events. All rights reserved.</p>
          <p className="mt-2">Building community through faith and fellowship</p>
        </div>
      </footer>
    </div>
  );
};

export default Events;