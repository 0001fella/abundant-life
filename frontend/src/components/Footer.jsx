import React, { useState, useEffect } from 'react';
// Removed FaChurch, FaPrayingHands, FaHeart, FaUsers, FaCalendarAlt, FaBookOpen, FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaYoutube imports
import { motion } from 'framer-motion';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const primaryBlue = '#3498db'; // A nice shade of blue
  const lightBlue = '#eaf6fa'; // A very light blue for subtle backgrounds

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <motion.footer
      className="bg-white text-gray-800 relative pt-24 pb-8 overflow-hidden border-t border-gray-100"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Blue Wave Animation Background */}
      <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden pointer-events-none z-0">
        <div className="wave-container absolute bottom-0 left-0 w-full h-full">
          {/* Wave 1 */}
          <div
            className="wave absolute w-[200%] h-[200px] bg-gradient-to-r from-blue-300 to-blue-500 opacity-30"
            style={{
              animation: 'wave 15s linear infinite',
              borderRadius: '50%',
              transform: 'translate3d(0, 0, 0) rotate(0deg) scale(2, 1)',
              bottom: '-50px', // Adjust position
              left: '-50%',
            }}
          ></div>
          {/* Wave 2 */}
          <div
            className="wave absolute w-[200%] h-[200px] bg-gradient-to-r from-blue-400 to-blue-600 opacity-20"
            style={{
              animation: 'wave 20s linear infinite reverse',
              borderRadius: '50%',
              transform: 'translate3d(0, 0, 0) rotate(0deg) scale(2, 1)',
              bottom: '-80px', // Adjust position
              left: '-50%',
            }}
          ></div>
          {/* Wave 3 */}
          <div
            className="wave absolute w-[200%] h-[200px] bg-gradient-to-r from-blue-500 to-blue-700 opacity-10"
            style={{
              animation: 'wave 25s linear infinite',
              borderRadius: '50%',
              transform: 'translate3d(0, 0, 0) rotate(0deg) scale(2, 1)',
              bottom: '-110px', // Adjust position
              left: '-50%',
            }}
          ></div>
        </div>
      </div>

      {/* Custom CSS for Wave Animation - moved to standard style tag */}
      <style>
        {`
        @keyframes wave {
          0% {
            transform: translate3d(-50%, 0, 0) rotate(0deg) scale(2, 1);
          }
          100% {
            transform: translate3d(50%, 0, 0) rotate(0deg) scale(2, 1);
          }
        }
        `}
      </style>

      {/* Decorative pattern at top - now white/transparent */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/50 to-transparent z-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Church Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center">
              <motion.div 
                className="p-2 text-white rounded-lg mr-3"
                style={{ backgroundColor: primaryBlue }}
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                {/* Replaced FaChurch with emoji */}
                <span className="text-xl">⛪</span>
              </motion.div>
              <span className="text-2xl font-bold font-serif text-gray-900">Abundant Life Celebration Center</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              A place of worship, fellowship, and spiritual growth. 
              We're dedicated to serving God and serving people.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: 'FB', color: '#3b5998' }, // Replaced FaFacebookF with text
                { icon: 'X', color: '#1da1f2' },   // Replaced FaTwitter with text
                { icon: 'IG', color: '#e1306c' },  // Replaced FaInstagram with text
                { icon: 'YT', color: '#ff0000' }   // Replaced FaYoutube with text
              ].map((social, index) => (
                <motion.a 
                  key={index}
                  href="#"
                  className="p-3 bg-gray-100 text-gray-600 rounded-full hover:text-white transition-colors flex items-center justify-center" // Added flex for centering
                  style={{ backgroundColor: social.color + '0d' }}
                  whileHover={{ 
                    backgroundColor: social.color,
                    scale: 1.1,
                    rotate: 10
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold font-serif mb-6 pb-2 border-b-2 inline-block text-gray-900" style={{ borderColor: primaryBlue }}>Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: 'About Us', icon: '❤️' }, // Replaced FaHeart with emoji
                { name: 'Our Beliefs', icon: '📖' }, // Replaced FaBookOpen with emoji
                { name: 'Ministries', icon: '👥' }, // Replaced FaUsers with emoji
                { name: 'Sermons', icon: '🙏' }, // Replaced FaPrayingHands with emoji
                { name: 'Events', icon: '📅' }, // Replaced FaCalendarAlt with emoji
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                >
                  <a href="#" className="flex items-center text-gray-600 transition-colors group" style={{ '--tw-text-opacity': 1, color: `rgba(var(--tw-text-opacity), ${primaryBlue})` }}>
                    <span className="mr-3 group-hover:scale-110 transition-transform" style={{ color: primaryBlue }}>
                      {item.icon}
                    </span>
                    <span className="group-hover:font-medium">{item.name}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Ministries */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-bold font-serif mb-6 pb-2 border-b-2 inline-block text-gray-900" style={{ borderColor: primaryBlue }}>Ministries</h3>
            <ul className="space-y-3">
              {[
                'Children Ministry',
                'Youth Group',
                'Men\'s Fellowship',
                'Women\'s Circle',
                'Prayer Ministry',
                'Mission Outreach'
              ].map((ministry, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                >
                  <a href="#" className="text-gray-600 transition-colors flex items-center group" style={{ '--tw-text-opacity': 1, color: `rgba(var(--tw-text-opacity), ${primaryBlue})` }}>
                    <motion.span 
                      className="w-2 h-2 rounded-full mr-3"
                      style={{ backgroundColor: primaryBlue }}
                      whileHover={{ scale: 1.5 }}
                    ></motion.span>
                    <span className="group-hover:font-medium">{ministry}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-bold font-serif mb-6 pb-2 border-b-2 inline-block text-gray-900" style={{ borderColor: primaryBlue }}>Contact Us</h3>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                {/* Replaced FaMapMarkerAlt with emoji */}
                <span className="mt-1 mr-3" style={{ color: primaryBlue }}>📍</span>
                <span className="text-gray-600">Umoja Three, Chockmart</span>
              </motion.li>
              <motion.li 
                className="flex items-center"
                whileHover={{ x: 5 }}
              >
                {/* Replaced FaPhone with emoji */}
                <span className="mr-3" style={{ color: primaryBlue }}>📞</span>
                <span className="text-gray-600">(555) 123-4567</span>
              </motion.li>
              <motion.li 
                className="flex items-center"
                whileHover={{ x: 5 }}
              >
                {/* Replaced FaEnvelope with emoji */}
                <span className="mr-3" style={{ color: primaryBlue }}>✉️</span>
                <span className="text-gray-600">info@abundantlife.com</span>
              </motion.li>
            </ul>
            
            <motion.div 
              className="mt-8 rounded-xl p-6 border shadow-sm"
              style={{ backgroundColor: lightBlue, borderColor: `${primaryBlue}30` }}
              whileHover={{ 
                y: -5,
                boxShadow: `0 10px 25px -5px ${primaryBlue}1A` // Subtle blue shadow
              }}
            >
              <h4 className="font-bold font-serif mb-3 text-gray-900">Service Times</h4>
              <ul className="space-y-2 text-gray-600">
                <motion.li 
                  className="flex justify-between"
                  whileHover={{ x: 5 }}
                >
                  <span>Sunday Worship</span>
                  <span className="font-medium" style={{ color: primaryBlue }}>10:00 AM</span>
                </motion.li>
                <motion.li 
                  className="flex justify-between"
                  whileHover={{ x: 5 }}
                >
                  <span>Wednesday Bible Study</span>
                  <span className="font-medium" style={{ color: primaryBlue }}>7:00 PM</span>
                </motion.li>
                <motion.li 
                  className="flex justify-between"
                  whileHover={{ x: 5 }}
                >
                  <span>Friday Prayer</span>
                  <span className="font-medium" style={{ color: primaryBlue }}>6:30 PM</span>
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Divider */}
        <motion.div 
          className="border-t border-gray-200 my-8"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8 }}
        ></motion.div>
        
        {/* Copyright */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} Abundant Life Celebration Center. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((item, index) => (
              <motion.a 
                key={index}
                href="#"
                className="text-gray-500 hover:text-blue-500 text-sm transition-colors"
                whileHover={{ 
                  y: -3,
                  fontWeight: 600
                }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Floating decorative elements - now blue */}
      <motion.div 
        className="absolute bottom-10 right-10 w-8 h-8 rounded-full bg-blue-500/10"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.1, 0.3]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      ></motion.div>
      <motion.div 
        className="absolute bottom-20 left-16 w-6 h-6 rounded-full bg-blue-500/10"
        animate={{ 
          scale: [1, 1.8, 1],
          opacity: [0.2, 0.05, 0.2]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      ></motion.div>
    </motion.footer>
  );
};

export default Footer;
