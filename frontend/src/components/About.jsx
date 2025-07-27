import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaGlobe, FaBookBible, FaCross, FaDove, FaHandsPraying, FaFire, FaStar, FaBullhorn, FaHandshake, FaArrowRight } from 'react-icons/fa6';
import { BiSolidChurch } from 'react-icons/bi';
import { IoLocationSharp, IoTimeSharp } from 'react-icons/io5';
import { FaEye, FaRocket, FaScroll, FaHeart } from 'react-icons/fa';

const About = () => {
  // Define theme colors as constants
  const themeColors = {
    primary: '#0D3B66', // Deep Navy Blue
    secondary: '#1C6E6E', // Forest Green
    accent: '#C8A870', // Classic Gold
    textDark: '#2C3E50', // Dark Charcoal
    textLight: '#FFFFFF', // White
    backgroundLight: '#F8F9FA', // Off-White
    backgroundDark: '#0D1B2A', // Very Dark Blue
    border: '#E0E0E0',
  };

  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollY = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(scrollY / scrollHeight, 1);
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const people = [
    { name: "Ps. Elkanah", title: "Senior Pastor", image: '/pstElkana.jpg' },
    { name: "Dennis", title: "Pastor", image: '/Dennise.jpg' },
    { name: "Justine Mayaka", title: "Pastor", image: '/mayaka.jpg' },
    { name: "Samwel Masika", title: "Youth Pastor", image: '/Sam.jpg' },
    { name: "Caroline Baraza", title: "Pastress", image: '/mum.jpg' },
  ];

  const statementsOfFaith = [
    { id: 1, title: "God the Creator", description: "We declare our belief in God the creator and preserver of all things, who created man, male and female in his own image and gave them dominion over the earthly creation.", icon: <FaGlobe /> },
    { id: 2, title: "The Holy Scriptures", description: "We believe the Bible to be the inspired, the only infallible, authoritative Word of God.", icon: <FaBookBible /> },
    { id: 3, title: "The Trinity", description: "We believe that there is one God, eternally existent in three persons: Father, Son, and the Holy Spirit- the Trinity.", icon: <FaCross /> },
    { id: 4, title: "Jesus Christ", description: "We believe in the deity of our Lord Jesus Christ, in His virgin birth, in His sinless life, in His miracles, in His vicarious and atoning death through His shed blood, in His bodily resurrection, in His ascension to the right hand of the Father, and in His personal return in power and glory.", icon: <FaDove /> },
    { id: 5, title: "Salvation", description: "We believe that for the salvation of lost and sinful man, regeneration of the Holy Spirit is absolutely essential.", icon: <FaHandsPraying /> },
    { id: 6, title: "Ministry of the Holy Spirit", description: "We believe in the present ministry of the Holy Spirit by whose indwelling the Christian is enabled to live a godly life.", icon: <FaFire /> },
    { id: 7, title: "Resurrection", description: "We believe in the resurrection of both the saved and the lost; they that are saved unto the resurrection of life and they that are lost unto the resurrection of damnation.", icon: <FaStar /> },
    { id: 8, title: "The Great Commission", description: "We believe in the great commission, the call to evangelize the world and bring many lives to Christ by the conviction of the Holy Spirit.", icon: <FaBullhorn /> },
    { id: 9, title: "Spiritual Unity", description: "We believe in the spiritual unity of believers in our Lord Jesus Christ.", icon: <FaHandshake /> }
  ];

  const cardHover = {
    hover: {
      y: -8,
      scale: 1.01,
      boxShadow: "0 15px 20px -5px rgba(0, 0, 0, 0.1), 0 8px 8px -5px rgba(0, 0, 0, 0.03)",
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const buttonHover = {
    hover: {
      scale: 1.03,
      backgroundColor: themeColors.accent,
      boxShadow: `0 8px 12px -3px ${themeColors.primary}66`,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { scale: 0.97 }
  };

  const fadeIn = (direction, type, delay, duration) => ({
    hidden: {
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { type, delay, duration, ease: "easeOut" },
    },
  });

  const staggerContainer = (staggerChildren, delayChildren) => ({
    hidden: {},
    show: {
      transition: { staggerChildren, delayChildren },
    },
  });

  const textVariant = (delay) => ({
    hidden: { y: 50, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", duration: 1, delay },
    },
  });

  const zoomIn = (delay, duration) => ({
    hidden: { scale: 0, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: { type: "tween", delay, duration, ease: "easeOut" },
    },
  });

  // Updated history section with image property
  const historyTimeline = [
    {
      year: "2011",
      title: "Humble Beginnings",
      description: "Abundant Life Celebration Centers began in Eastland areas of Nairobi around Light Industries, Kariobangi South.",
      verse: "John 10:10",
      verseText: "The thief comes to steal kill and destroy but I have come that they may have life and have it more abundantly.",
      image: '/history1.jpg'
    },
    {
      year: "2015",
      title: "Settling in Umoja (iii)",
      description: "We moved to Umoja (iii) and have passionately served the body of Christ, witnessing God transform lives.",
      verse: "Proverbs 14:28",
      verseText: "A large population is the King's glory, but without subjects a prince is ruined.",
      image: '/history2.jpg'
    },
    {
      year: "Present",
      title: "Continued Growth & Impact",
      description: "We provide robust platforms for kingdom work, continuously impacting lives and influencing society for Christ.",
      verse: "Ephesians 3:20",
      verseText: "Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us.",
      image: '/ALCC.jpg' // Added ALCC.jpg here
    }
  ];

  // Helper to generate RGBA from hex
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div 
      className="bg-[#F8F9FA] text-[#2C3E50] font-sans overflow-hidden" 
      style={{ backgroundColor: themeColors.backgroundLight, color: themeColors.textDark }}
      ref={containerRef}
    >
      {/* Scroll progress indicator */}
      <motion.div 
        className="fixed top-0 left-0 h-1 z-50"
        style={{ 
          backgroundColor: themeColors.accent,
          width: `${scrollProgress * 100}%` 
        }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress * 100}%` }}
        transition={{ duration: 0.2 }}
      />
      
      {/* HERO SECTION - Text sizes reduced */}
      <section 
        ref={heroRef} 
        className="relative min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ 
          background: `linear-gradient(to bottom right, ${themeColors.backgroundLight}, white)`
        }}
      >
        {/* Abstract pattern background with parallax */}
        <motion.div 
          className="absolute inset-0 opacity-15" 
          style={{ 
            y: parallaxY, 
            opacity: parallaxOpacity,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C8A870' fill-opacity='0.1'%3E%3Cpath d='M36 34.5L34.5 36 29 41.5 23.5 36 22 34.5 27.5 29 22 23.5 23.5 22 29 27.5 34.5 22 36 23.5 30.5 29zM18 18c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM0 31c1.105 0 2-.895 2-2s-.895-2-0-2-2 .895-2 2 .895 2 2 2zM6 10c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM21 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 49c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM33 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM45 42c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM45 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM21 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM3 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM18 42c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM0 13c1.105 0 2-.895 2-2s-.895-2-0-2-2 .895-2 2 .895 2 2 2zM60 13c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23C8A870' fill-opacity='0.1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-7xl mx-auto w-full text-center py-16"
        >
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <div 
              className="p-6 rounded-full border-4 shadow-xl"
              style={{ 
                borderColor: themeColors.accent,
                backgroundColor: themeColors.primary 
              }}
            >
              <BiSolidChurch 
                className="text-6xl" 
                style={{ color: themeColors.accent }} 
              />
            </div>
          </motion.div>
          
          <motion.h1 
            variants={textVariant(0.3)}
            className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-4"
            style={{ color: themeColors.primary }}
          >
            Abundant Life <span style={{ color: themeColors.secondary }}>Celebration Center</span>
          </motion.h1>
          
          <motion.p 
            variants={textVariant(0.5)}
            className="text-xl font-medium mb-8 max-w-3xl mx-auto"
            style={{ color: themeColors.textDark }}
          >
            A ministry committed to revealing Christ and making disciples for the kingdom.
          </motion.p>

          <motion.div 
            variants={textVariant(0.7)}
            className="space-y-2 mb-8"
          >
            <div className="flex justify-center items-center">
              <IoLocationSharp 
                className="mr-3 text-2xl" 
                style={{ color: themeColors.primary }} 
              />
              <p className="font-medium" style={{ color: themeColors.textDark }}>
                Umoja Three, Chockmart Supermarket Digital, Nairobi, Kenya
              </p>
            </div>
            <div className="flex justify-center items-center">
              <IoTimeSharp 
                className="mr-3 text-2xl" 
                style={{ color: themeColors.primary }} 
              />
              <p className="font-medium" style={{ color: themeColors.textDark }}>
                Sundays at 9:00 AM & 11:30 AM
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            variants={textVariant(0.7)}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.a 
              href="#visit" 
              className="px-8 py-4 font-semibold rounded-full shadow-lg relative overflow-hidden group border-2"
              style={{ 
                backgroundColor: themeColors.secondary,
                color: themeColors.textLight,
                borderColor: themeColors.secondary
              }}
              variants={buttonHover}
              whileHover="hover"
              whileTap="tap"
            >
              <span className="relative z-10 flex items-center justify-center">
                Join Us This Sunday
                <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </motion.a>
            
            <motion.a 
              href="#leadership" 
              className="px-8 py-4 font-semibold rounded-full shadow-lg relative overflow-hidden group border-2"
              style={{ 
                backgroundColor: 'transparent',
                color: themeColors.primary,
                borderColor: themeColors.primary
              }}
              variants={buttonHover}
              whileHover="hover"
              whileTap="tap"
            >
              <span className="relative z-10 flex items-center justify-center">
                Learn About Our Church
                <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </motion.a>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Shaped Divider */}
      <div className="relative h-24" style={{ backgroundColor: themeColors.backgroundLight }}>
        <div 
          className="absolute bottom-0 left-0 w-full h-full origin-bottom-right transform -skew-y-3" 
          style={{ backgroundColor: themeColors.backgroundDark }}
        />
      </div>

      {/* REDESIGNED HISTORY SECTION - Modern timeline design */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: themeColors.backgroundDark }}>
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-7xl mx-auto"
        >
          <motion.h2 
            variants={textVariant(0.2)} 
            className="text-4xl md:text-5xl font-serif font-bold text-center mb-12"
            style={{ color: themeColors.textLight }}
          >
            Our <span style={{ color: themeColors.accent }}>Journey</span>
          </motion.h2>

          <div className="relative">
            {/* Vertical timeline line */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 h-full w-1" 
              style={{ backgroundColor: themeColors.accent }}
            ></div>
            
            <div className="space-y-12 md:space-y-0">
              {historyTimeline.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn(index % 2 === 0 ? "left" : "right", "spring", index * 0.2, 0.8)}
                  className={`flex flex-col md:flex-row items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`md:w-5/12 p-6 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="inline-block relative">
                      <span 
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        {item.year}
                      </span>
                      <h3 
                        className="text-2xl font-serif font-bold mt-6 mb-3" 
                        style={{ color: themeColors.accent }}
                      >
                        {item.title}
                      </h3>
                      <p className="mb-4" style={{ color: themeColors.textLight }}>
                        {item.description}
                      </p>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="font-semibold" style={{ color: themeColors.accent }}>
                          {item.verse}
                        </p>
                        <p className="text-sm italic" style={{ color: themeColors.textLight }}>
                          "{item.verseText}"
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="md:w-2/12 flex justify-center relative">
                    <div 
                      className="w-6 h-6 rounded-full absolute top-1/2 transform -translate-y-1/2 z-10" 
                      style={{ backgroundColor: themeColors.accent }}
                    ></div>
                  </div>
                  
                  <div className="md:w-5/12 p-6">
                    <div 
                      className="h-64 rounded-xl overflow-hidden shadow-xl"
                      style={{ 
                        backgroundImage: `url('${item.image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: "grayscale(50%) brightness(70%)"
                      }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Shaped Divider */}
      <div className="relative h-24" style={{ backgroundColor: themeColors.backgroundDark }}>
        <div 
          className="absolute top-0 left-0 w-full h-full origin-top-left transform -skew-y-3" 
          style={{ backgroundColor: themeColors.backgroundLight }}
        />
      </div>

      {/* FOUNDATIONS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: themeColors.backgroundLight }}>
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-7xl mx-auto"
        >
          <motion.h2 
            variants={textVariant(0.2)} 
            className="text-4xl md:text-5xl font-serif font-bold text-center mb-12"
            style={{ color: themeColors.textDark }}
          >
            Our <span style={{ color: themeColors.secondary }}>Foundations</span>
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div 
              variants={fadeIn("right", "spring", 0.2, 0.8)} 
              className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 relative overflow-hidden group border"
              style={{ 
                borderColor: themeColors.border,
                '&:hover': { borderColor: themeColors.secondary }
              }}
              whileHover={cardHover.hover}
            >
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: `linear-gradient(to bottom right, ${hexToRgba(themeColors.secondary, 0.05)}, transparent)` 
                }}
              />
              <h3 className="text-3xl font-serif font-bold mb-4 flex items-center" style={{ color: themeColors.primary }}>
                <FaEye className="text-4xl mr-3" style={{ color: themeColors.accent }} /> Our Vision
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: themeColors.textDark }}>
                To reveal Christ the author of life to the dying world.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeIn("left", "spring", 0.2, 0.8)} 
              className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 relative overflow-hidden group border"
              style={{ borderColor: themeColors.border }}
              whileHover={cardHover.hover}
            >
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: `linear-gradient(to bottom right, ${hexToRgba(themeColors.primary, 0.05)}, transparent)` 
                }}
              />
              <h3 className="text-3xl font-serif font-bold mb-4 flex items-center" style={{ color: themeColors.primary }}>
                <FaRocket className="text-4xl mr-3" style={{ color: themeColors.accent }} /> Our Mission
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: themeColors.textDark }}>
                To make disciples by teaching, training, equipping and establishing the saints into a personal relationship with God which unleashes them to their full potential to live in the liberty of God and heal the oppressed world by demonstrating the power of the Holy Spirit.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeIn("up", "spring", 0.4, 0.8)} 
              className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 relative overflow-hidden group border"
              style={{ borderColor: themeColors.border }}
              whileHover={cardHover.hover}
            >
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: `linear-gradient(to bottom right, ${hexToRgba(themeColors.secondary, 0.05)}, transparent)` 
                }}
              />
              <h3 className="text-3xl font-serif font-bold mb-4 flex items-center" style={{ color: themeColors.primary }}>
                <FaScroll className="text-4xl mr-3" style={{ color: themeColors.accent }} /> Our Mandate
              </h3>
              <ul className="list-disc list-inside text-lg leading-relaxed space-y-2 pl-4" style={{ color: themeColors.textDark }}>
                <li>Evangelize the world</li>
                <li>Train, nurture, develop and equip the born again</li>
                <li>Influence society for the kingdom</li>
                <li>Love God's people</li>
              </ul>
            </motion.div>

            <motion.div 
              variants={fadeIn("up", "spring", 0.6, 0.8)} 
              className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 relative overflow-hidden group border"
              style={{ borderColor: themeColors.border }}
              whileHover={cardHover.hover}
            >
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: `linear-gradient(to bottom right, ${hexToRgba(themeColors.primary, 0.05)}, transparent)` 
                }}
              />
              <h3 className="text-3xl font-serif font-bold mb-4 flex items-center" style={{ color: themeColors.primary }}>
                <FaHeart className="text-4xl mr-3" style={{ color: themeColors.accent }} /> Our Core Values
              </h3>
              <ul className="list-disc list-inside text-lg leading-relaxed space-y-2 pl-4" style={{ color: themeColors.textDark }}>
                <li>Obedience - to God</li>
                <li>Integrity - Lifestyle</li>
                <li>Prayerfulness - In life</li>
              </ul>
              <p className="text-lg leading-relaxed mt-4 font-semibold" style={{ color: themeColors.textDark }}>
                In everything we do, everyone we meet, everywhere we go: We are Christ's hand and feet on earth.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* STATEMENT OF FAITH SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: themeColors.backgroundDark, color: themeColors.textLight }}>
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-7xl mx-auto text-center"
        >
          <motion.h2 
            variants={textVariant(0.2)} 
            className="text-4xl md:text-5xl font-serif font-bold mb-12"
            style={{ color: themeColors.textLight }}
          >
            Our Statement of <span style={{ color: themeColors.accent }}>Faith</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {statementsOfFaith.map((statement) => (
              <motion.div
                key={statement.id}
                variants={fadeIn("up", "spring", statement.id * 0.1, 0.7)}
                className="rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 relative overflow-hidden group border border-transparent"
                style={{ backgroundColor: themeColors.primary }}
                whileHover={cardHover.hover}
              >
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    background: `linear-gradient(to bottom right, ${hexToRgba(themeColors.secondary, 0.05)}, transparent)` 
                  }}
                />
                <div 
                  className="p-4 rounded-full mb-6 text-4xl"
                  style={{ 
                    backgroundColor: themeColors.accent,
                    color: themeColors.primary
                  }}
                >
                  {statement.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold mb-3" style={{ color: themeColors.textLight }}>
                  {statement.title}
                </h3>
                <p className="leading-relaxed" style={{ color: `${themeColors.textLight}90` }}>
                  {statement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* LEADERSHIP SECTION - Removed white backgrounds */}
      <section id="leadership" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: themeColors.backgroundLight }}>
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-7xl mx-auto"
        >
          <motion.h2 
            variants={textVariant(0.2)} 
            className="text-4xl md:text-5xl font-serif font-bold text-center mb-12"
            style={{ color: themeColors.textDark }}
          >
            Meet Our <span style={{ color: themeColors.secondary }}>Pastors</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-12 justify-items-center">
            {people.map((person, index) => (
              <motion.div
                key={index}
                variants={zoomIn(index * 0.1, 0.5)}
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative mb-6">
                  {/* Circular image container without background */}
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-48 h-48 rounded-full mx-auto object-cover border-4 transition-transform duration-300 hover:scale-105"
                    style={{ borderColor: themeColors.primary }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/150x150/${themeColors.backgroundLight.slice(1)}/${themeColors.textDark.slice(1)}?text=Image`;
                    }}
                  />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-1" style={{ color: themeColors.primary }}>
                  {person.name}
                </h3>
                <p className="text-sm uppercase font-semibold tracking-wider" style={{ color: themeColors.secondary }}>
                  {person.title}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* VISIT US SECTION */}
      <section id="visit" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: themeColors.backgroundLight }}>
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-7xl mx-auto text-center"
        >
          <motion.h2 
            variants={textVariant(0.2)} 
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
            style={{ color: themeColors.textDark }}
          >
            Come Worship With <span style={{ color: themeColors.primary }}>Us</span>
          </motion.h2>
          <motion.p 
            variants={textVariant(0.4)} 
            className="text-lg md:text-xl max-w-2xl mx-auto mb-8"
            style={{ color: `${themeColors.textDark}80` }}
          >
            We'd love to have you join us for a powerful time of worship and a life-changing message from God's Word.
          </motion.p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
            <motion.div 
              variants={fadeIn("right", "spring", 0.6, 0.8)} 
              className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 relative overflow-hidden group border"
              style={{ borderColor: themeColors.border }}
              whileHover={cardHover.hover}
            >
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: `linear-gradient(to bottom right, ${hexToRgba(themeColors.secondary, 0.05)}, transparent)` 
                }}
              />
              <h3 className="text-3xl font-serif font-bold mb-4" style={{ color: themeColors.primary }}>
                Our Location
              </h3>
              <p className="text-lg leading-relaxed mb-4" style={{ color: themeColors.textDark }}>
                Find us at Umoja Three, Chockmart Supermarket Digital, Nairobi, Kenya. Our doors are open and we're ready to welcome you.
              </p>
              <div className="flex items-center space-x-2 mb-2">
                <IoLocationSharp style={{ color: themeColors.accent }} className="text-2xl" />
                <p className="font-semibold" style={{ color: themeColors.textDark }}>
                  Umoja Three, Chockmart Supermarket Digital, Nairobi, Kenya
                </p>
              </div>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=Chockmart+Supermarket+Digital,+Umoja+Three,+Nairobi,+Kenya" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 mt-4 text-center font-semibold rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                style={{ 
                  backgroundColor: themeColors.secondary,
                  color: themeColors.textLight
                }}
              >
                Get Directions
              </a>
            </motion.div>

            <motion.div 
              variants={fadeIn("left", "spring", 0.6, 0.8)} 
              className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 relative overflow-hidden group border"
              style={{ borderColor: themeColors.border }}
              whileHover={cardHover.hover}
            >
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: `linear-gradient(to bottom right, ${hexToRgba(themeColors.primary, 0.05)}, transparent)` 
                }}
              />
              <h3 className="text-3xl font-serif font-bold mb-4" style={{ color: themeColors.primary }}>
                Service Times
              </h3>
              <p className="text-lg leading-relaxed mb-4" style={{ color: themeColors.textDark }}>
                Join us for a spirit-filled service every Sunday.
              </p>
              <div className="flex items-center space-x-2 mb-2">
                <IoTimeSharp style={{ color: themeColors.accent }} className="text-2xl" />
                <p className="font-semibold" style={{ color: themeColors.textDark }}>
                  First Service: 9:00 AM - 11:00 AM
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <IoTimeSharp style={{ color: themeColors.accent }} className="text-2xl" />
                <p className="font-semibold" style={{ color: themeColors.textDark }}>
                  Second Service: 11:30 AM - 1:30 PM
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;