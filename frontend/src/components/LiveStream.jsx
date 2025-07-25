import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Youtube, Facebook, Share2, MessageSquare, Calendar, Clock } from "lucide-react";

const LiveStream = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Set next livestream time (example: Sunday 10:30 AM)
  const getNextStreamTime = () => {
    const now = new Date();
    const day = now.getDay();
    let next = new Date();
    next.setDate(now.getDate() + ((7 - day + 0) % 7)); // Next Sunday
    next.setHours(10, 30, 0, 0);
    if (next < now) next.setDate(next.getDate() + 7);
    return next;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = getNextStreamTime() - now;
      const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleGive = () => navigate("/donate");

  return (
    <section className="w-full bg-white text-gray-800 py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900 flex items-center justify-center gap-3">
            <Youtube className="text-red-600" size={32} />
            Live Stream Service
            <Youtube className="text-red-600" size={32} />
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join us for worship and the Word from anywhere in the world
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <div className="bg-blue-50 p-4 rounded-lg text-center text-lg font-medium text-blue-800 flex items-center justify-center gap-2">
          <Clock className="text-blue-600" size={20} />
          Next Live Stream in:{" "}
          <span className="font-bold">
            {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </span>
        </div>

        {/* Video Embed */}
        <motion.div
          className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-gray-200"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID"
            title="Live Stream"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </motion.div>

        {/* YouTube Chat */}
        <div className="aspect-[3/1] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <iframe
            src="https://www.youtube.com/live_chat?v=YOUR_VIDEO_ID&embed_domain=yourdomain.com"
            title="Live Chat"
            className="w-full h-full"
          ></iframe>
        </div>

        {/* Stream Info */}
        <div className="bg-blue-50 p-6 rounded-xl space-y-4 border border-blue-100">
          <h2 className="text-2xl font-semibold text-blue-900 flex items-center gap-2">
            <MessageSquare className="text-blue-600" size={20} />
            Current Series: Kingdom Living
          </h2>
          <p className="text-gray-700">
            Join us as we dive deep into the Word — worship, teaching, and
            real-time ministry every Sunday at 10:30 AM and Wednesdays at 7:00
            PM.
          </p>
        </div>

        {/* Upcoming Services */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} />
            Upcoming Streams
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 p-1 rounded-full">
                <Calendar size={16} />
              </span>
              Sunday Service - May 26, 10:30 AM
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 p-1 rounded-full">
                <Calendar size={16} />
              </span>
              Bible Study - May 29, 7:00 PM
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 p-1 rounded-full">
                <Calendar size={16} />
              </span>
              Prayer Night - May 31, 8:00 PM
            </li>
          </ul>
        </motion.div>

        {/* Give Now Button */}
        <div className="text-center">
          <motion.button
            onClick={handleGive}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-md"
          >
            Give Now
          </motion.button>
        </div>

        {/* Social + Share */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-2xl mt-8">
          <a
            href="https://youtube.com/@YOUR_CHANNEL"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 transition"
            title="YouTube"
          >
            <Youtube size={24} />
          </a>
          <a
            href="https://facebook.com/YOUR_PAGE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 transition"
            title="Facebook"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://api.whatsapp.com/send?text=Join%20us%20LIVE%20now%20at%20https://yourdomain.com/livestream"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-600 transition"
            title="WhatsApp"
          >
            <MessageSquare size={24} />
          </a>
          <button
            onClick={() => alert("Share link copied to clipboard")}
            className="text-blue-800 hover:text-blue-900 transition"
            title="Share"
          >
            <Share2 size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LiveStream;