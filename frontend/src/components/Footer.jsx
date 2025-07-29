import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Importing Lucide React icons for a more professional look
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Updated color palette for the black background and blue/white/green theme
  const primaryAccentBlue = '#3B82F6'; // A vibrant blue for accents and highlights
  const primaryAccentGreen = '#10B981'; // A vibrant green for accents and highlights
  const mainTextColor = '#FFFFFF'; // Pure white for primary text on dark background
  const secondaryTextColor = '#E0E0E0'; // Light gray for subtle text
  const blackBg = '#000000'; // Explicit black background
  const glassBg = 'rgba(0, 0, 0, 0.4)'; // More transparent black for glass effect
  const glassBorder = 'rgba(255, 255, 255, 0.15)'; // Slightly more visible white border for glass effect
  const glassShadow = 'rgba(0, 0, 0, 0.6)'; // Stronger dark shadow for depth

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <motion.footer
      className="relative pt-24 pb-8 overflow-hidden z-10 font-inter"
      style={{
        backgroundColor: blackBg,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderTop: `1px solid ${glassBorder}`,
        boxShadow: `0 8px 32px 0 ${glassShadow}`,
        color: mainTextColor,
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Glowing Blue and Green Curved Wave Animation Background */}
      <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden pointer-events-none z-0">
        {/* Blue Wave */}
        <div
          className="absolute w-[150%] h-[300px] rounded-[50%] opacity-0"
          style={{
            background: `radial-gradient(circle at center, ${primaryAccentBlue}40 0%, transparent 70%)`,
            animation: 'glowingWaveBlue 20s linear infinite alternate',
            bottom: '-150px',
            left: '-25%',
          }}
        ></div>
        {/* Green Wave */}
        <div
          className="absolute w-[150%] h-[300px] rounded-[50%] opacity-0"
          style={{
            background: `radial-gradient(circle at center, ${primaryAccentGreen}40 0%, transparent 70%)`,
            animation: 'glowingWaveGreen 25s linear infinite alternate-reverse',
            bottom: '-100px',
            left: '-75%',
            animationDelay: '2s',
          }}
        ></div>
      </div>

      {/* Custom CSS for Glowing Wave Animations */}
      <style>
        {`
        @keyframes glowingWaveBlue {
          0% {
            transform: translateX(-10%) scale(0.9) rotate(5deg);
            opacity: 0.15;
          }
          50% {
            transform: translateX(10%) scale(1.1) rotate(-5deg);
            opacity: 0.3;
          }
          100% {
            transform: translateX(-10%) scale(0.9) rotate(5deg);
            opacity: 0.15;
          }
        }
        @keyframes glowingWaveGreen {
          0% {
            transform: translateX(10%) scale(0.95) rotate(-3deg);
            opacity: 0.1;
          }
          50% {
            transform: translateX(-10%) scale(1.05) rotate(3deg);
            opacity: 0.25;
          }
          100% {
            transform: translateX(10%) scale(0.95) rotate(-3deg);
            opacity: 0.1;
          }
        }
        `}
      </style>

      {/* Decorative pattern at top - now subtle dark gradient */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-0"></div>
      
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
                className="p-2 rounded-lg mr-3"
                style={{ backgroundColor: primaryAccentBlue, color: blackBg }}
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <span className="text-xl">⛪</span>
              </motion.div>
              <span className="text-2xl font-bold font-serif" style={{ color: primaryAccentBlue }}>Abundant Life Celebration Center</span>
            </div>
            <p className="leading-relaxed" style={{ color: secondaryTextColor }}>
              A place of worship, fellowship, and spiritual growth. 
              We're dedicated to serving God and serving people.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Facebook size={20} />, name: 'Facebook', color: '#3b5998' },
                { icon: <Twitter size={20} />, name: 'Twitter', color: '#1da1f2' },
                { icon: <Instagram size={20} />, name: 'Instagram', color: '#e1306c' },
                { icon: <Youtube size={20} />, name: 'YouTube', color: '#ff0000' }
              ].map((social, index) => (
                <motion.a 
                  key={index}
                  href="#"
                  className="p-3 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: `${social.color}30`, border: `1px solid ${social.color}50` }}
                  whileHover={{ 
                    backgroundColor: social.color,
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.5, ease: "easeInOut" }
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
            <h3 className="text-lg font-bold font-serif mb-6 pb-2 border-b-2 inline-block" style={{ borderColor: primaryAccentGreen, color: primaryAccentGreen }}>Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: 'About Us', icon: '❤️' },
                { name: 'Our Beliefs', icon: '📖' },
                { name: 'Ministries', icon: '👥' },
                { name: 'Sermons', icon: '🙏' },
                { name: 'Events', icon: '📅' },
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 8 }}
                >
                  <a href="#" className="flex items-center transition-colors group" style={{ color: secondaryTextColor }}>
                    <span className="mr-3 group-hover:scale-125 transition-transform" style={{ color: primaryAccentGreen }}>
                      {item.icon}
                    </span>
                    <span className="group-hover:font-semibold" style={{ color: mainTextColor }}>{item.name}</span>
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
            <h3 className="text-lg font-bold font-serif mb-6 pb-2 border-b-2 inline-block" style={{ borderColor: primaryAccentBlue, color: primaryAccentBlue }}>Ministries</h3>
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
                  whileHover={{ x: 8 }}
                >
                  <a href="#" className="transition-colors flex items-center group" style={{ color: secondaryTextColor }}>
                    <motion.span 
                      className="w-2.5 h-2.5 rounded-full mr-3"
                      style={{ backgroundColor: primaryAccentBlue }}
                      whileHover={{ scale: 1.8 }}
                    ></motion.span>
                    <span className="group-hover:font-semibold" style={{ color: mainTextColor }}>{ministry}</span>
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
            <h3 className="text-lg font-bold font-serif mb-6 pb-2 border-b-2 inline-block" style={{ borderColor: primaryAccentGreen, color: primaryAccentGreen }}>Contact Us</h3>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start"
                whileHover={{ x: 8 }}
              >
                <span className="mt-1 mr-3" style={{ color: primaryAccentGreen }}>📍</span>
                <span style={{ color: secondaryTextColor }}>Umoja Three, Chockmart</span>
              </motion.li>
              <motion.li 
                className="flex items-center"
                whileHover={{ x: 8 }}
              >
                <span className="mr-3" style={{ color: primaryAccentGreen }}>📞</span>
                <span style={{ color: secondaryTextColor }}>(555) 123-4567</span>
              </motion.li>
              <motion.li 
                className="flex items-center"
                whileHover={{ x: 8 }}
              >
                <span className="mr-3" style={{ color: primaryAccentGreen }}>✉️</span>
                <span style={{ color: secondaryTextColor }}>info@abundantlife.com</span>
              </motion.li>
            </ul>
            
            <motion.div 
              className="mt-8 rounded-xl p-6 border shadow-lg"
              style={{ 
                backgroundColor: glassBg,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderColor: glassBorder,
                boxShadow: `0 6px 20px ${glassShadow}`
              }}
              whileHover={{ 
                y: -8,
                boxShadow: `0 15px 35px -5px ${primaryAccentGreen}30` // Use green for hover shadow
              }}
            >
              <h4 className="font-bold font-serif mb-3" style={{ color: primaryAccentGreen }}>Service Times</h4>
              <ul className="space-y-2" style={{ color: secondaryTextColor }}>
                <motion.li 
                  className="flex justify-between"
                  whileHover={{ x: 5 }}
                >
                  <span>Sunday Worship</span>
                  <span className="font-medium" style={{ color: primaryAccentGreen }}>10:00 AM</span>
                </motion.li>
                <motion.li 
                  className="flex justify-between"
                  whileHover={{ x: 5 }}
                >
                  <span>Wednesday Bible Study</span>
                  <span className="font-medium" style={{ color: primaryAccentBlue }}>7:00 PM</span>
                </motion.li>
                <motion.li 
                  className="flex justify-between"
                  whileHover={{ x: 5 }}
                >
                  <span>Friday Prayer</span>
                  <span className="font-medium" style={{ color: primaryAccentGreen }}>6:30 PM</span>
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Divider */}
        <motion.div 
          className="my-8"
          style={{ borderTop: `1px solid ${glassBorder}` }}
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
          <p className="text-sm mb-4 md:mb-0" style={{ color: secondaryTextColor }}>
            © {currentYear} Abundant Life Celebration Center. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((item, index) => (
              <motion.a 
                key={index}
                href="#"
                className="text-sm transition-colors"
                style={{ color: secondaryTextColor }}
                whileHover={{ 
                  y: -5,
                  fontWeight: 700,
                  color: primaryAccentBlue // Hover accent color
                }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Floating decorative elements - now blue and green for glass effect */}
      <motion.div 
        className="absolute bottom-10 right-10 w-8 h-8 rounded-full"
        style={{ backgroundColor: `${primaryAccentBlue}1A`, border: `1px solid ${primaryAccentBlue}30` }}
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.1, 0.3],
          rotate: [0, 90, 0] // Added rotation
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      ></motion.div>
      <motion.div 
        className="absolute bottom-20 left-16 w-6 h-6 rounded-full"
        style={{ backgroundColor: `${primaryAccentGreen}1A`, border: `1px solid ${primaryAccentGreen}30` }}
        animate={{ 
          scale: [1, 1.8, 1],
          opacity: [0.2, 0.05, 0.2],
          rotate: [0, -90, 0] // Added rotation
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
