// src/pages/About.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaGlobe, FaBookBible, FaCross, FaDove, FaHandsPraying, FaFire, FaStar, FaBullhorn, FaHandshake, FaArrowRight } from 'react-icons/fa6';
import { BiSolidChurch } from 'react-icons/bi';
import { IoLocationSharp, IoTimeSharp } from 'react-icons/io5';
import { FaEye, FaRocket, FaScroll, FaHeart } from 'react-icons/fa';

const About = () => {
  // Define theme colors as constants (Regal Palette)
  const themeColors = {
    primary: '#5D1C34', // Deep Maroon
    secondary: '#A67D44', // Golden Brown
    accent: '#899481', // Soft Olive Green
    textDark: '#11100F', // Very Dark Gray/Black
    textLight: '#FFFFFF', // White
    backgroundLight: '#EEE9E1', // Light Beige
    backgroundDark: '#CDBCAB', // Olive Green
    border: '#A67D44', // Golden Brown
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
      image: '/ALCC.jpg'
    }
  ];

  const cardHover = {
    hover: {
      y: -8,
      scale: 1.01,
      boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const buttonHover = {
    hover: {
      scale: 1.03,
      // backgroundColor and boxShadow are applied inline in the component
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

  // Helper to generate RGBA from hex (using full opacity if alpha >= 1)
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Ensure alpha is between 0 and 1
    const a = Math.max(0, Math.min(1, alpha));
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  // Wave divider component for smooth section transitions
  const WaveDivider = ({ topColor, bottomColor, flip }) => (
    <div className="relative h-24 w-full overflow-hidden" style={{ backgroundColor: topColor }}>
      <svg
        className={`absolute w-[200%] ${flip ? 'rotate-180 top-0' : 'bottom-0'}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          opacity=".25"
          fill={bottomColor}
        ></path>
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          opacity=".5"
          fill={bottomColor}
        ></path>
        <path
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          fill={bottomColor}
        ></path>
      </svg>
    </div>
  );

  return (
    <div
      className="font-sans overflow-hidden"
      style={{ backgroundColor: themeColors.backgroundLight, color: themeColors.textDark }}
      ref={containerRef}
    >
      {/* Scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 h-1 z-50"
        style={{
          backgroundColor: themeColors.secondary,
          width: `${scrollProgress * 100}%`
        }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress * 100}%` }}
        transition={{ duration: 0.2 }}
      />

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${themeColors.backgroundLight}, ${themeColors.backgroundDark})`
        }}
      >
        {/* Abstract pattern background with parallax */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            y: parallaxY,
            opacity: parallaxOpacity,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%235D1C34' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`
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
            <motion.div
              className="p-6 rounded-full border-4 shadow-xl"
              style={{
                borderColor: themeColors.secondary,
                backgroundColor: themeColors.primary
              }}
              animate={{
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <BiSolidChurch
                className="text-6xl"
                style={{ color: themeColors.secondary }}
              />
            </motion.div>
          </motion.div>
          <motion.h1
            variants={textVariant(0.3)}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            style={{ color: themeColors.primary }}
          >
            Abundant Life <span style={{ color: themeColors.secondary }}>Celebration Center</span>
          </motion.h1>
          <motion.p
            variants={textVariant(0.5)}
            className="text-xl font-medium mb-8 max-w-3xl mx-auto opacity-90"
            style={{ color: themeColors.textDark }}
          >
            A ministry committed to revealing Christ and making disciples for the kingdom.
          </motion.p>
          <motion.div
            variants={textVariant(0.7)}
            className="space-y-4 mb-8"
          >
            <div className="flex justify-center items-center">
              <IoLocationSharp
                className="mr-3 text-xl"
                style={{ color: themeColors.secondary }}
              />
              <p className="font-medium" style={{ color: themeColors.textDark }}>
                Umoja Three, Chockmart Supermarket Digital, Nairobi, Kenya
              </p>
            </div>
            <div className="flex justify-center items-center">
              <IoTimeSharp
                className="mr-3 text-xl"
                style={{ color: themeColors.secondary }}
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
              whileHover={{ ...buttonHover.hover, backgroundColor: themeColors.primary, boxShadow: `0 8px 20px -5px ${hexToRgba(themeColors.primary, 0.3)}` }}
              whileTap="tap"
              animate={{
                boxShadow: [
                  `0 5px 15px ${hexToRgba(themeColors.secondary, 0.3)}`,
                  `0 10px 25px ${hexToRgba(themeColors.secondary, 0.5)}`,
                  `0 5px 15px ${hexToRgba(themeColors.secondary, 0.3)}`
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
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
              whileHover={{ ...buttonHover.hover, backgroundColor: hexToRgba(themeColors.primary, 0.1), boxShadow: `0 8px 20px -5px ${hexToRgba(themeColors.primary, 0.2)}` }}
              whileTap="tap"
              animate={{
                boxShadow: [
                  `0 5px 15px ${hexToRgba(themeColors.primary, 0.2)}`,
                  `0 10px 25px ${hexToRgba(themeColors.primary, 0.4)}`,
                  `0 5px 15px ${hexToRgba(themeColors.primary, 0.2)}`
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <span className="relative z-10 flex items-center justify-center">
                Learn About Our Church
                <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* Wave Divider */}
      <WaveDivider
        topColor={themeColors.backgroundLight}
        bottomColor={themeColors.backgroundDark}
        flip={false}
      />

      {/* HISTORY SECTION */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: themeColors.backgroundDark }}>
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.div
              className="inline-block mb-4 rounded-lg px-4 py-2 text-xs font-medium tracking-wider border"
              style={{
                backgroundColor: hexToRgba(themeColors.primary, 0.1),
                color: themeColors.primary,
                borderColor: hexToRgba(themeColors.primary, 0.2)
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              OUR STORY
            </motion.div>
            <motion.h2
              variants={textVariant(0.2)}
              className="text-4xl font-bold"
              style={{ color: themeColors.textLight }} // Use light text on dark background
            >
              Our <span style={{ color: themeColors.secondary }}>Journey</span>
            </motion.h2>
          </div>
          <div className="relative">
            {/* Vertical timeline line */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 h-full w-1"
              style={{ backgroundColor: themeColors.accent }}
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            ></motion.div>
            <div className="space-y-12 md:space-y-0">
              {historyTimeline.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn(index % 2 === 0 ? "left" : "right", "spring", index * 0.2, 0.8)}
                  className={`flex flex-col md:flex-row items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <div className={`md:w-5/12 p-6 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="inline-block relative">
                      <motion.span
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                        style={{ backgroundColor: themeColors.primary }}
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0, -5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        {item.year}
                      </motion.span>
                      <h3
                        className="text-2xl font-bold mt-6 mb-3"
                        style={{ color: themeColors.textLight }} // Use light text on dark background
                      >
                        {item.title}
                      </h3>
                      <p className="mb-4 opacity-90" style={{ color: themeColors.textLight }}>
                        {item.description}
                      </p>
                      <motion.div
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                        whileHover={{
                          y: -5,
                          boxShadow: `0 10px 25px ${hexToRgba(themeColors.accent, 0.1)}`
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="font-semibold" style={{ color: themeColors.secondary }}>
                          {item.verse}
                        </p>
                        <p className="text-sm italic opacity-90" style={{ color: themeColors.textDark }}> {/* Dark text on light card */}
                          "{item.verseText}"
                        </p>
                      </motion.div>
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="md:w-2/12 flex justify-center relative">
                    <motion.div
                      className="w-6 h-6 rounded-full absolute top-1/2 transform -translate-y-1/2 z-10 shadow-lg"
                      style={{ backgroundColor: themeColors.secondary }}
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          `0 0 0 0 ${hexToRgba(themeColors.secondary, 0.4)}`,
                          `0 0 0 10px ${hexToRgba(themeColors.secondary, 0)}`,
                          `0 0 0 0 ${hexToRgba(themeColors.secondary, 0)}`
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    ></motion.div>
                  </div>
                  <div className="md:w-5/12 p-6">
                    <motion.div
                      className="h-64 rounded-xl overflow-hidden shadow-xl"
                      style={{
                        backgroundImage: `url('${item.image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: "grayscale(30%) brightness(90%)"
                      }}
                      whileHover={{
                        filter: "grayscale(0%) brightness(100%)",
                        scale: 1.03
                      }}
                      transition={{ duration: 0.5 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Wave Divider */}
      <WaveDivider
        topColor={themeColors.backgroundDark}
        bottomColor={themeColors.backgroundLight}
        flip={true}
      />

      {/* FOUNDATIONS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: themeColors.backgroundLight }}>
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.div
              className="inline-block mb-4 rounded-lg px-4 py-2 text-xs font-medium tracking-wider border"
              style={{
                backgroundColor: hexToRgba(themeColors.primary, 0.1),
                color: themeColors.primary,
                borderColor: hexToRgba(themeColors.primary, 0.2)
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              OUR FOUNDATIONS
            </motion.div>
            <motion.h2
              variants={textVariant(0.2)}
              className="text-4xl font-bold"
              style={{ color: themeColors.primary }}
            >
              Our <span style={{ color: themeColors.secondary }}>Core Beliefs</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              variants={fadeIn("up", "spring", 0.2, 0.7)}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-200"
              whileHover={{ y: -10 }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  className="p-4 rounded-full"
                  style={{
                    backgroundColor: hexToRgba(themeColors.primary, 0.1),
                    color: themeColors.primary
                  }}
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <FaEye className="text-3xl" />
                </motion.div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center" style={{ color: themeColors.primary }}>
                Our Vision
              </h3>
              <p className="text-gray-600 text-center">
                To reveal Christ the author of life to the dying world.
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn("up", "spring", 0.4, 0.7)}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-200"
              whileHover={{ y: -10 }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  className="p-4 rounded-full"
                  style={{
                    backgroundColor: hexToRgba(themeColors.primary, 0.1),
                    color: themeColors.primary
                  }}
                  animate={{
                    rotate: [0, 20, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <FaRocket className="text-3xl" />
                </motion.div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center" style={{ color: themeColors.primary }}>
                Our Mission
              </h3>
              <p className="text-gray-600 text-center">
                To make disciples by teaching, training, equipping and establishing the saints.
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn("up", "spring", 0.6, 0.7)}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-200"
              whileHover={{ y: -10 }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  className="p-4 rounded-full"
                  style={{
                    backgroundColor: hexToRgba(themeColors.primary, 0.1),
                    color: themeColors.primary
                  }}
                  animate={{
                    rotate: [0, -10, 0, 10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <FaScroll className="text-3xl" />
                </motion.div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center" style={{ color: themeColors.primary }}>
                Our Mandate
              </h3>
              <p className="text-gray-600 text-center">
                Evangelize the world, train believers, influence society, and love God's people.
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn("up", "spring", 0.8, 0.7)}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-200"
              whileHover={{ y: -10 }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  className="p-4 rounded-full"
                  style={{
                    backgroundColor: hexToRgba(themeColors.primary, 0.1),
                    color: themeColors.primary
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <FaHeart className="text-3xl" />
                </motion.div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center" style={{ color: themeColors.primary }}>
                Our Core Values
              </h3>
              <p className="text-gray-600 text-center">
                Obedience to God, integrity in lifestyle, and prayerfulness in all we do.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* STATEMENT OF FAITH SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: themeColors.backgroundLight }}>
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.div
              className="inline-block mb-4 rounded-lg px-4 py-2 text-xs font-medium tracking-wider border"
              style={{
                backgroundColor: hexToRgba(themeColors.primary, 0.1),
                color: themeColors.primary,
                borderColor: hexToRgba(themeColors.primary, 0.2)
              }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              OUR BELIEFS
            </motion.div>
            <motion.h2
              variants={textVariant(0.2)}
              className="text-4xl font-bold"
              style={{ color: themeColors.primary }}
            >
              Statement of <span style={{ color: themeColors.secondary }}>Faith</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {statementsOfFaith.map((statement) => (
              <motion.div
                key={statement.id}
                variants={fadeIn("up", "spring", statement.id * 0.1, 0.7)}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                whileHover={{ y: -5 }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="p-4 rounded-full"
                    style={{
                      backgroundColor: hexToRgba(themeColors.primary, 0.1),
                      color: themeColors.primary
                    }}
                    animate={{
                      rotate: [0, 15, 0, -15, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    {statement.icon}
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-center" style={{ color: themeColors.primary }}>
                  {statement.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {statement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* LEADERSHIP SECTION */}
      <section id="leadership" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: themeColors.backgroundLight }}>
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.div
              className="inline-block mb-4 rounded-lg px-4 py-2 text-xs font-medium tracking-wider border"
              style={{
                backgroundColor: hexToRgba(themeColors.primary, 0.1),
                color: themeColors.primary,
                borderColor: hexToRgba(themeColors.primary, 0.2)
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              OUR TEAM
            </motion.div>
            <motion.h2
              variants={textVariant(0.2)}
              className="text-4xl font-bold"
              style={{ color: themeColors.primary }}
            >
              Church <span style={{ color: themeColors.secondary }}>Leadership</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
            {people.map((person, index) => (
              <motion.div
                key={index}
                variants={zoomIn(index * 0.1, 0.5)}
                className="text-center w-full"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="relative mb-6 mx-auto">
                  <div className="relative rounded-full overflow-hidden border-4" style={{ borderColor: themeColors.primary, width: '160px', height: '160px' }}>
                    <motion.img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/150x150/${themeColors.backgroundLight.slice(1)}/${themeColors.textDark.slice(1)}?text=Image`;
                      }}
                      animate={{
                        scale: [1, 1.03, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </div>
                </div>
                <motion.h3
                  className="text-xl font-bold mb-2"
                  style={{ color: themeColors.primary }}
                >
                  {person.name}
                </motion.h3>
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
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.div
              className="inline-block mb-4 rounded-lg px-4 py-2 text-xs font-medium tracking-wider border"
              style={{
                backgroundColor: hexToRgba(themeColors.primary, 0.1),
                color: themeColors.primary,
                borderColor: hexToRgba(themeColors.primary, 0.2)
              }}
              initial={{ opacity: 0, rotate: -10 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              JOIN US
            </motion.div>
            <motion.h2
              variants={textVariant(0.2)}
              className="text-4xl font-bold mb-4"
              style={{ color: themeColors.primary }}
            >
              Visit Our <span style={{ color: themeColors.secondary }}>Church</span>
            </motion.h2>
            <motion.p
              variants={textVariant(0.4)}
              className="text-lg max-w-2xl mx-auto opacity-90"
              style={{ color: themeColors.textDark }}
            >
              We'd love to have you join us for a powerful time of worship and a life-changing message from God's Word.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              variants={fadeIn("right", "spring", 0.6, 0.8)}
              className="bg-white rounded-xl shadow-lg p-8 transform hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group border border-gray-200"
              whileHover={cardHover.hover}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to bottom right, ${hexToRgba(themeColors.secondary, 0.05)}, transparent)`
                }}
              />
              <h3 className="text-2xl font-bold mb-6" style={{ color: themeColors.primary }}>
                Our Location
              </h3>
              <p className="text-gray-600 mb-6">
                Find us at Umoja Three, Chockmart Supermarket Digital, Nairobi, Kenya. Our doors are open and we're ready to welcome you.
              </p>
              <div className="flex items-start space-x-4 mb-6">
                <IoLocationSharp style={{ color: themeColors.secondary }} className="text-2xl mt-1" />
                <p className="font-medium">
                  Umoja Three, Chockmart Supermarket Digital, Nairobi, Kenya
                </p>
              </div>
              <motion.a
                href="https://www.google.com/maps/dir/?api=1&destination=Chockmart+Supermarket+Digital,+Umoja+Three,+Nairobi,+Kenya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 text-center font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
                style={{
                  backgroundColor: themeColors.primary,
                  color: themeColors.textLight
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: themeColors.secondary
                }}
                whileTap={{ scale: 0.95 }}
              >
                Get Directions
              </motion.a>
            </motion.div>
            <motion.div
              variants={fadeIn("left", "spring", 0.6, 0.8)}
              className="bg-white rounded-xl shadow-lg p-8 transform hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group border border-gray-200"
              whileHover={cardHover.hover}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to bottom right, ${hexToRgba(themeColors.primary, 0.05)}, transparent)`
                }}
              />
              <h3 className="text-2xl font-bold mb-6" style={{ color: themeColors.primary }}>
                Service Times
              </h3>
              <p className="text-gray-600 mb-6">
                Join us for a spirit-filled service every Sunday.
              </p>
              <div className="flex items-start space-x-4 mb-4">
                <IoTimeSharp style={{ color: themeColors.secondary }} className="text-2xl mt-1" />
                <div>
                  <p className="font-bold">First Service</p>
                  <p className="font-medium">9:00 AM - 11:00 AM</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <IoTimeSharp style={{ color: themeColors.secondary }} className="text-2xl mt-1" />
                <div>
                  <p className="font-bold">Second Service</p>
                  <p className="font-medium">11:30 AM - 1:30 PM</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;