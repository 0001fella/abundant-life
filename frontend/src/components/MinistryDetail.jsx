// src/components/MinistryDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import ministries from "../data/ministriesData";
import { motion } from "framer-motion";

const MinistryDetail = () => {
  const { slug } = useParams();
  const ministry = ministries.find((m) => m.slug === slug);

  if (!ministry) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <h2 className="text-2xl text-gray-700">Ministry not found.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-purple-100 via-white to-blue-100">
      {/* Decorative Gradient Blob */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-30 blur-2xl z-0" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-5xl mx-auto px-6 py-24"
      >
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden">
          <img
            src={ministry.image}
            alt={ministry.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            <h1 className="text-4xl font-bold text-indigo-800 mb-3">
              {ministry.title}
            </h1>
            <p className="text-gray-800 text-lg mb-6">{ministry.description}</p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-gray-700 leading-relaxed">{ministry.story}</p>
            </motion.div>

            {/* Cool Add-ons */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-200 to-indigo-100 p-4 rounded-xl shadow-inner text-sm text-gray-700">
                🙌 Weekly gatherings
              </div>
              <div className="bg-gradient-to-br from-blue-200 to-pink-100 p-4 rounded-xl shadow-inner text-sm text-gray-700">
                🎤 Guest speakers & testimonies
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-green-100 p-4 rounded-xl shadow-inner text-sm text-gray-700">
                📸 Community outreach & events
              </div>
              <div className="bg-gradient-to-br from-red-100 to-orange-100 p-4 rounded-xl shadow-inner text-sm text-gray-700">
                🤝 Volunteer & serve opportunities
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full transition">
                Join This Ministry
              </button>
            </div>

            <Link
              to="/ministries"
              className="mt-6 block text-indigo-500 hover:underline text-sm"
            >
              ← Back to Ministries
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MinistryDetail;
