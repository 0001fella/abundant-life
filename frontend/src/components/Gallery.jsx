// src/components/Gallery.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const images = [
  "/images/gallery1.jpg",
  "/images/gallery2.jpg",
  "/images/gallery3.jpg",
  "/images/gallery4.jpg",
  "/images/gallery5.jpg",
  "/images/gallery6.jpg",
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section
      className="min-h-screen px-6 py-16 bg-gradient-to-br from-black via-slate-900 to-blue-900 text-white"
      id="gallery"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Church Gallery
        </motion.h2>
        <p className="mb-10 text-lg text-gray-300">
          A glimpse of our moments, ministries, and memories.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <motion.div
              key={index}
              className="overflow-hidden rounded-2xl shadow-lg cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedImage(src)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <img
                src={src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-60 object-cover hover:brightness-75 transition"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged"
              className="rounded-lg shadow-2xl w-full max-h-[80vh] object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Gallery;
