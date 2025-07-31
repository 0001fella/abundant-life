import React, { useState, useEffect, useCallback } from "react";
import { FaPlay, FaBookOpen, FaUsers, FaPrayingHands, FaCalendarAlt, FaChurch, FaHandshake, FaMusic, FaChild, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// --- Constants and Configuration ---
const HERO_IMAGE = '/ALCC.jpg';
const PASTOR_IMAGE = '/pstElkana.jpg';

const HARDCODED_WEEKLY_EVENTS = [
    {
        id: 1,
        title: "Evening Fellowships",
        date: "Every Tuesday",
        time: "6:30 PM",
        location: "Main Sanctuary, ALCC",
        type: "General Church Events",
        image:'/homechurch.jpg',
        description: "Join us for an intimate time of worship, prayer, and biblical teaching every Tuesday evening."
    },
    {
        id: 2,
        title: "Kesha",
        date: "Every Friday",
        time: "8:00 PM",
        location: "ALCC Church",
        type: "Youths",
        image: '/kesha.jpg',
        description: "A powerful night of prayer and worship designed specifically for our youth community."
    },
    {
        id: 3,
        title: "Home Bible Churches",
        date: "Every Wednesday",
        time: "6:30 PM",
        location: "House Holds",
        type: "General Church Events",
        image: '/bible.jpg',
        description: "Experience fellowship and Bible study in small group settings throughout our community."
    }
];

const QUICK_ACTIONS = [
    {
        id: 1,
        icon: <FaPrayingHands className="w-8 h-8 mx-auto text-[#006d7e] mb-4" />,
        title: "Prayer Wall",
        description: "Share your prayer requests and pray for others.",
        link: "/prayer-wall"
    },
    {
        id: 2,
        icon: <FaUsers className="w-8 h-8 mx-auto text-[#006d7e] mb-4" />,
        title: "Testimonials",
        description: "Read inspiring stories of faith and transformation.",
        link: "/testimonials"
    },
    {
        id: 3,
        icon: <FaBookOpen className="w-8 h-8 mx-auto text-[#006d7e] mb-4" />,
        title: "Daily Devotionals",
        description: "Start your day with spiritual insights from God's Word.",
        link: "/devotionals"
    },
    {
        id: 4,
        icon: <FaCalendarAlt className="w-8 h-8 mx-auto text-[#006d7e] mb-4" />,
        title: "Events Calendar",
        description: "Discover all upcoming services, gatherings, and special events.",
        link: "/events"
    }
];

const WHAT_TO_EXPECT_ITEMS = [
    {
        icon: <FaChurch className="w-10 h-10 text-[#006d7e] mb-3" />,
        title: "Welcoming Atmosphere",
        description: "Feel at home from the moment you step through our doors. Our friendly ushers are here to guide you."
    },
    {
        icon: <FaMusic className="w-10 h-10 text-[#006d7e] mb-3" />,
        title: "Inspiring Worship",
        description: "Experience dynamic praise and worship led by our vibrant team, preparing your heart for God's Word."
    },
    {
        icon: <FaBookOpen className="w-10 h-10 text-[#006d7e] mb-3" />,
        title: "Powerful Messages",
        description: "Hear relevant and transformative messages from Pastor Elkana, rooted in biblical truth."
    },
    {
        icon: <FaChild className="w-10 h-10 text-[#006d7e] mb-3" />,
        title: "Children's Programs",
        description: "Safe and engaging Sunday School programs for kids of all ages, so parents can enjoy the service."
    },
    {
        icon: <FaHandshake className="w-10 h-10 text-[#006d7e] mb-3" />,
        title: "Community & Connection",
        description: "Connect with fellow believers, find a small group, and build lasting friendships."
    },
    {
        icon: <FaPrayingHands className="w-10 h-10 text-[#006d7e] mb-3" />,
        title: "Prayer & Support",
        description: "Our prayer teams are available to minister to you and offer support whenever you need it."
    }
];

// Updated classes for cleaner, modern look
const BUTTON_CLASSES = "bg-[#006d7e] text-white hover:bg-[#004e57] font-bold rounded-lg text-base px-6 py-2 shadow-md hover:shadow-lg transition-all";
const OUTLINE_BUTTON_CLASSES = "border-2 border-[#006d7e] text-[#006d7e] hover:bg-[#006d7e]/10 font-bold rounded-lg text-base px-6 py-2 flex items-center justify-center shadow-sm transition-all";
const SECTION_BADGE_CLASSES = "inline-block mb-4 bg-[#006d7e]/10 text-[#006d7e] rounded-lg px-4 py-2 text-xs font-medium tracking-wider border border-[#006d7e]/20";

const Hero = () => {
    const [timeLeft, setTimeLeft] = useState({});
    const [selectedEvent, setSelectedEvent] = useState(null);
    const navigate = useNavigate();

    const getNextSundayServiceTime = useCallback(() => {
        const now = new Date();
        const result = new Date(now);
        const daysUntilSunday = (7 - now.getDay()) % 7;
        result.setDate(now.getDate() + daysUntilSunday);
        result.setHours(10, 0, 0, 0);
        if (daysUntilSunday === 0 && now.getTime() > result.getTime()) {
            result.setDate(now.getDate() + 7);
        }
        return result;
    }, []);

    useEffect(() => {
        const target = getNextSundayServiceTime();
        const interval = setInterval(() => {
            const now = new Date();
            const diff = target - now;
            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [getNextSundayServiceTime]);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (selectedEvent && e.target.classList.contains('modal-backdrop')) {
                setSelectedEvent(null);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [selectedEvent]);

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans scroll-smooth">
            {/* Image Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 modal-backdrop bg-black/90 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl w-full max-h-[90vh]">
                        <button 
                            className="absolute -top-10 right-0 text-white z-50"
                            onClick={() => setSelectedEvent(null)}
                            aria-label="Close image"
                        >
                            <FaTimes className="w-8 h-8" />
                        </button>
                        <img 
                            src={selectedEvent.image} 
                            alt={selectedEvent.title}
                            className="w-full h-full object-contain max-h-[80vh]"
                        />
                        <div className="text-white text-center mt-4">
                            <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                            <p className="text-gray-300">{selectedEvent.description}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section - Modernized */}
            <section className="relative overflow-hidden border-t-0 -mt-[1px]">
                <div className="absolute inset-0">
                    <img
                        src={HERO_IMAGE}
                        alt="Bright church interior with beautiful stained glass windows"
                        className="w-full h-full object-cover"
                        loading="eager"
                    />
                    {/* Cleaner overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/20"></div>
                </div>
                <div className="relative z-20 container mx-auto px-4 py-32 lg:py-40 text-center">
                    <motion.div
                        className={SECTION_BADGE_CLASSES}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Preaching Christ To The World
                    </motion.div>
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold mb-2 text-white"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        Welcome to Abundant
                        <span className="block text-[#43b9c7] mt-2 font-light"> Life Celebration Center</span>
                    </motion.h1>
                    {/* Added Bible Verse - John 10:10 */}
                    <motion.div
                        className="max-w-2xl mx-auto mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                    >
                        <p className="text-[#f3d17a] italic font-serif text-lg md:text-xl">
                            "The thief comes only to steal and kill and destroy; I have come that they may have life,
                            and have it to the full." - John 10:10
                        </p>
                    </motion.div>
                    <motion.div
                        className="mt-12 bg-white/20 backdrop-blur-lg rounded-xl p-4 max-w-3xl mx-auto border border-white/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        role="timer"
                        aria-label="Countdown to next service"
                    >
                        <h3 className="text-base font-semibold text-[#43b9c7] mb-3">Next Service Starts In:</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {Object.entries(timeLeft).map(([unit, value]) => (
                                <div key={unit} className="text-center">
                                    <div className="text-xl md:text-2xl font-bold text-white">{value}</div>
                                    <div className="text-[#43b9c7] uppercase text-xs">{unit}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section - Minimalist */}
            <section className="py-12 bg-white border-b border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-6 text-center">
                        {[
                            { value: "500+", label: "Active Members" },
                            { value: "200+", label: "Sermons Available" },
                            { value: "50+", label: "Lives Transformed" },
                            { value: "15", label: "Years of Ministry" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="space-y-1 p-4 rounded-xl bg-white shadow-sm border border-gray-100"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="text-3xl font-bold text-[#006d7e]">{stat.value}</div>
                                <div className="text-gray-600 text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pastor's Welcome - Modern Design */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <motion.div
                            className={SECTION_BADGE_CLASSES}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                        >
                            A WARM WELCOME
                        </motion.div>
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">From Our Senior Pastor</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                            A personal message to you and your family.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="md:col-span-2 h-full">
                            <motion.div
                                className="relative h-full"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.7 }}
                            >
                                <img
                                    src={PASTOR_IMAGE}
                                    alt="Senior Pastor Elkana from Abundant Life Celebration Center"
                                    className="w-full h-full object-cover max-h-[500px]"
                                    loading="lazy"
                                />
                            </motion.div>
                        </div>
                        <div className="md:col-span-3 p-8">
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ delay: 0.2, duration: 0.7 }}
                            >
                                <motion.h3
                                    className="text-2xl font-bold mb-6 text-gray-800 relative flex items-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    <span className="mr-2 text-[#006d7e]">❤️</span>
                                    Dear Friend,
                                </motion.h3>
                                <motion.p
                                    className="text-gray-600 mb-4 leading-relaxed text-lg relative pl-4 border-l-2 border-[#84d9e6]"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                >
                                    It is with great joy that I welcome you to Abundant Life Celebration Center.
                                    We are a family of believers committed to sharing the love of Christ and making
                                    disciples who impact the world.
                                </motion.p>
                                <motion.p
                                    className="text-gray-600 mb-4 leading-relaxed text-lg relative pl-4 border-l-2 border-[#84d9e6]"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                >
                                    Whether you are seeking spiritual growth, meaningful relationships, or a place
                                    to serve, you are at home here. Our doors are open wide to you and your family.
                                </motion.p>
                                <motion.p
                                    className="text-gray-600 mb-6 leading-relaxed text-lg relative pl-4 border-l-2 border-[#84d9e6]"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ delay: 1.0, duration: 0.5 }}
                                >
                                    I invite you to join us this Sunday for a life-changing encounter with God.
                                </motion.p>
                                <motion.div
                                    className="mt-8"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ delay: 1.2, duration: 0.7 }}
                                >
                                    <motion.div
                                        className="h-0.5 bg-gradient-to-r from-[#006d7e] to-transparent w-1/3 mb-4"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '33%' }}
                                        viewport={{ once: true, amount: 0.5 }}
                                        transition={{ delay: 1.4, duration: 1 }}
                                    />
                                    <p className="font-bold text-gray-800 text-lg">Blessings,</p>
                                    <p className="font-semibold text-[#006d7e]">Pastor Elkana</p>
                                    <p className="text-gray-600 text-sm mt-1">Senior Pastor</p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Weekly Events Section with Gallery Effect */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <motion.div
                            className={SECTION_BADGE_CLASSES}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                        >
                            REGULAR GATHERINGS
                        </motion.div>
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">Weekly Events</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                            Our regular weekly gatherings you can always join.
                        </p>
                    </div>
                    
                    <div className="space-y-24">
                        {HARDCODED_WEEKLY_EVENTS.map((event, index) => (
                            <motion.div
                                key={event.id}
                                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {/* Event Image with Gallery Effect */}
                                <div 
                                    className="w-full md:w-1/2 h-96 overflow-hidden cursor-pointer relative"
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <img
                                        src={event.image}
                                        alt={`Event: ${event.title}`}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <span className="text-white font-bold text-lg bg-black/50 px-4 py-2 rounded-lg">
                                            View Full Image
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Event Details */}
                                <div className="w-full md:w-1/2">
                                    <div className="text-[#006d7e] font-medium mb-3">{event.type}</div>
                                    <h3 className="text-2xl font-bold mb-4 text-gray-800">{event.title}</h3>
                                    
                                    <div className="space-y-3 mb-5">
                                        <div className="flex items-center text-gray-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#006d7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {event.date}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#006d7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {event.time}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#006d7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {event.location}
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>
                                    
                                    <div className="inline-block bg-[#e6f7f9] text-[#006d7e] rounded-full px-4 py-2 text-sm font-medium">
                                        Weekly Event
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/events')}
                            aria-label="View All Events"
                            className={BUTTON_CLASSES}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ delay: 0.2 }}
                        >
                            View All Events
                        </motion.button>
                    </div>
                </div>
            </section>

            {/* Quick Actions - Clean Cards */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <motion.div
                            className={SECTION_BADGE_CLASSES}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                        >
                            CONNECT & GROW
                        </motion.div>
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">Quick Actions & Resources</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                            Explore key areas of our ministry and quickly find what you need.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {QUICK_ACTIONS.map((action, index) => (
                            <motion.div
                                key={action.id}
                                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all border border-gray-200"
                                whileHover={{ y: -5 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <a href={action.link} className="block group">
                                    {action.icon}
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#006d7e] transition-colors">{action.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What to Expect Section - Reverted to original format */}
            <section className="py-16 bg-gray-50 border-t border-b border-gray-200">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <motion.div
                            className="inline-block mb-4 bg-[#006d7e]/10 text-[#006d7e] rounded-lg px-4 py-2 text-xs font-medium tracking-wider border border-[#006d7e]/20"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                        >
                            PLAN YOUR VISIT
                        </motion.div>
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">What to Expect on Sunday</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                            We're excited to have you! Here's a glimpse of what your first visit will be like.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {WHAT_TO_EXPECT_ITEMS.map((item, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: index * 0.15, duration: 0.5 }}
                            >
                                <div className="flex justify-center items-center mb-4">
                                    <div className="bg-[#006d7e]/10 p-3 rounded-full text-[#006d7e]">
                                        {item.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#006d7e]">{item.title}</h3>
                                <p className="text-gray-600 text-base">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/plan-your-visit')}
                            aria-label="Learn More About Your Visit"
                            className={BUTTON_CLASSES}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ delay: 0.3 }}
                        >
                            Plan Your Visit
                        </motion.button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Hero;