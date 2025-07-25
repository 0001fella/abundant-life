import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Removed: import { LazyLoadImage } from "react-lazy-load-image-component";
// Removed: import 'react-lazy-load-image-component/src/effects/blur.css';

const leaders = [
  {
    id: 1,
    name: "Rev. Elkana Wanyonyi",
    role: "Senior Pastor",
    image: '/pstElkana.jpg',
    bio: "A visionary leader passionate about revival, purpose, and Kingdom living. With over 15 years of ministry experience, Pastor Elkana has a heart for discipleship and community transformation.",
    email: "pastor@alcc.org",
    phone: "+254 700 123 456",
    social: {
      twitter: "https://twitter.com/pastormark",
      facebook: "https://facebook.com/pastormark.alcc"
    },
    ministryInvolvement: [
      "Sunday Services",
      "Leadership Development",
      "Community Outreach",
      "Pastoral Counseling"
    ],
    testimony: "I've witnessed God's faithfulness as we've grown from a small home fellowship to a thriving church impacting our community."
  },
  {
    id: 2,
    name: "Caroline Barasa",
    role: "Leader of the Ladies Ministry - Women of Faith",
    image: '/mum.jpg',
    bio: "Tasked with organizing and running the Women's Ministry, Caroline facilitates regular women's services and checks on the individual growth and development of women in the church. She proposes calendar events, identifies growth opportunities, and nurtures young ladies transitioning from the youth ministry. Caroline cultivates warmth and unity, advises leadership on ministry development, maintains clear records, attends to cases requiring attention, and provides monthly progress reports to the Pastor.",
    email: "women@alcc.org",
    phone: "+254 711 234 567",
    social: {
      instagram: "https://instagram.com/caroline.alcc"
    },
    ministryInvolvement: [
      "Organizing & Running Women's Ministry",
      "Facilitating Regular Women's Services",
      "Checking Individual Growth & Development",
      "Proposing Women's Calendar of Events",
      "Nurturing Youth Ladies to Womanhood",
      "Cultivating Warmth & Unity",
      "Advising Leadership on Ministry Growth",
      "Maintaining Member Records & Contacts",
      "Generating Event Budgets",
      "Monthly Progress Reports"
    ],
    testimony: "Seeing women discover their identity in Christ and step into their God-given purpose is my greatest joy."
  },
  {
    id: 3,
    name: "Samuel Masika",
    role: "The Youth Leader",
    image: '/Sam.jpg',
    bio: "Samuel is tasked with organizing and running the youth Ministry, facilitating regular youth services, and checking on the individual growth and development of the youth. He provides a platform for growing youth ministers, nurtures gifts and talents, and receives graduating teenagers into the youth team. Samuel also shares information on relationships with the Youth Patron/Pastor, plans outreach and missions, proposes ministry growth plans and calendars, works on youth budgets, ensures coordination with parents, establishes clear coordination with Sunday school, advises on discipline, maintains member records, and gives monthly progress reports.",
    email: "youth@alcc.org",
    phone: "+254 722 345 678",
    social: {
      twitter: "https://twitter.com/samuelkiptoo",
      youtube: "https://youtube.com/samuelkiptoo"
    },
    ministryInvolvement: [
      "Organizing & Running Youth Ministry",
      "Facilitating Regular Youth Services",
      "Checking Individual Youth Growth",
      "Providing Platform for Youth Ministers",
      "Nurturing Gifts & Talents",
      "Receiving Graduating Teenagers",
      "Sharing Relationship Information with Pastor/Patron",
      "Planning Outreach & Youth Missions",
      "Proposing Youth Ministry Growth & Calendar",
      "Working on Youth Budgets & Estimates",
      "Ensuring Coordination with Parents",
      "Coordinating with Sunday School",
      "Receiving New Youths",
      "Advising Pastor/Leadership on Discipline",
      "Maintaining Member Records & Contacts",
      "Monthly Progress Reports"
    ],
    testimony: "My passion is to see this generation encounter Jesus and live out their faith with boldness."
  },
  {
    id: 4,
    name: "Esther Mugo",
    role: "Worship Director",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
    bio: "Hearts are lifted when she leads — anointed in voice and spirit. Esther creates an atmosphere where people can encounter God through worship.",
    email: "worship@alcc.org",
    phone: "+254 733 456 789",
    social: {
      instagram: "https://instagram.com/esthermugo.worship"
    },
    ministryInvolvement: [
      "Worship Team",
      "Creative Arts",
      "Songwriting",
      "Musician Training"
    ],
    testimony: "Worship is more than music—it's creating space for God's presence to transform lives."
  },
  {
    id: 5,
    name: "Joel Mwangi",
    role: "IT & Media Director",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    bio: "Manages all tech and stream setups — making the gospel digital. Joel ensures our message reaches beyond our walls through technology.",
    email: "media@alcc.org",
    phone: "+254 744 567 890",
    social: {
      linkedin: "https://linkedin.com/in/joelmwangi",
      github: "https://github.com/joelmwangi"
    },
    ministryInvolvement: [
      "Live Streaming",
      "Website Management",
      "Social Media",
      "Technical Support"
    ],
    testimony: "Using technology to spread the Gospel is my way of serving God in the digital age."
  },
  {
    id: 6,
    name: "Grace Moraa",
    role: "The Leader of Sunday school",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    bio: "Grace is responsible for receiving young kids, organizing and running the Sunday school Ministry, and facilitating regular, consistent meetings. She ensures the security and safety of children during services, maintains them in their classes to prevent loitering, and facilitates a clean learning environment. Grace also designs and initiates programs that stimulate the growth of the Sunday school Ministry.",
    email: "children@alcc.org",
    phone: "+254 755 678 901",
    social: {
      instagram: "https://instagram.com/gracechildren"
    },
    ministryInvolvement: [
      "Receiving Young Kids",
      "Organizing & Running Sunday School Ministry",
      "Facilitating Regular Meetings",
      "Checking Children's Security & Safety",
      "Maintaining Children in Classes",
      "Facilitating Clean Learning Environment",
      "Designing Growth Programs for Sunday School"
    ],
    testimony: "Investing in children is investing in the future of the Church."
  },
  {
    id: 7,
    name: "David Kimani", // Placeholder name
    role: "Leader of Men’s Ministry - Visionaries’",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80", // Placeholder image
    bio: "David is dedicated to organizing and running the Men's Ministry, facilitating regular men's meetings, and checking on the individual growth of all men in the church. He focuses on growing and expanding the Men's Ministry by coming up with activities, events, and ideas as led by the spirit to foster spiritual development among the men.",
    email: "men@alcc.org",
    phone: "+254 766 789 012",
    social: {},
    ministryInvolvement: [
      "Organizing & Running Men's Ministry",
      "Facilitating Regular Men's Meetings",
      "Checking Individual Growth of Men",
      "Proposing Ministry Expansion Plans",
      "Developing Spirit-Led Activities & Events"
    ],
    testimony: "It's a privilege to see men of all ages come together to pursue God's vision for their lives and families."
  }
];

// Floating cross component for background
const FloatingCross = ({ top, left, size, delay }) => (
  <motion.div
    className="absolute text-green-700 opacity-10 pointer-events-none"
    style={{ top: `${top}%`, left: `${left}%`, fontSize: `${size}px` }}
    initial={{ y: 0 }}
    animate={{ 
      y: [0, -15, 0],
      rotate: [0, 5, 0]
    }}
    transition={{ 
      duration: 8 + Math.random() * 4, 
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  >
    ✝
  </motion.div>
);

const Leadership = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredLeaders = activeFilter === "all" 
    ? leaders 
    : leaders.filter(leader => 
        leader.role.toLowerCase().includes(activeFilter) ||
        leader.ministryInvolvement.some(item => item.toLowerCase().includes(activeFilter))
      );

  const openModal = (leader) => {
    setSelectedLeader(leader);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedLeader(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="bg-white text-gray-800 relative overflow-hidden">
      {/* Floating crosses in background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <FloatingCross top={5} left={10} size={24} delay={0} />
        <FloatingCross top={15} left={90} size={32} delay={1} />
        <FloatingCross top={25} left={30} size={20} delay={2} />
        <FloatingCross top={40} left={75} size={28} delay={0.5} />
        <FloatingCross top={55} left={15} size={18} delay={1.5} />
        <FloatingCross top={65} left={85} size={22} delay={3} />
        <FloatingCross top={80} left={40} size={26} delay={2.5} />
      </div>
      
      {/* Hero Section */}
      <section className="relative py-28 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img 
            src="https://images.unsplash.com/photo-1542401886-65d6c61db217?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
            alt="Church background"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 to-transparent"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-4xl mx-auto"
        >
          <motion.div 
            className="inline-block mb-4 bg-green-700 text-white rounded-full px-4 py-1 text-xs font-medium tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            ABUNDANT LIFE CELEBRATION CENTER
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-white"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Meet Our <span className="text-green-400">Leadership</span> Team
          </motion.h1>
          
          <motion.p 
            className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 font-light mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            The dedicated servants guiding our church with wisdom, compassion, and a heart for God's people
          </motion.p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Filter Section */}
          <motion.div 
            className="mb-12 bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Leadership Team</h2>
                <p className="text-gray-700">
                  Filter by ministry area or role
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeFilter === "all" 
                      ? "bg-green-700 text-white" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  All Leaders
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter("pastor")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeFilter === "pastor" 
                      ? "bg-green-700 text-white" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Pastoral Team
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter("ministry")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeFilter === "ministry" 
                      ? "bg-green-700 text-white" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Ministry Leads
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter("director")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeFilter === "director" 
                      ? "bg-green-700 text-white" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Directors
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Leadership Grid - UPDATED with circular containers */}
          <div className="flex flex-wrap justify-center gap-12">
            {filteredLeaders.map((leader, index) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -10 }}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => openModal(leader)}
              >
                {/* Circular image container */}
                <div className="relative mb-4">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10">
                    {/* Replaced LazyLoadImage with native img tag */}
                    <img
                      src={leader.image}
                      alt={leader.name}
                      loading="lazy" // Native lazy loading
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      width="100%"
                      height="100%"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                </div>
                
                {/* Name and title */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">
                    {leader.name}
                  </h3>
                  <p className="text-green-700 font-medium mt-1">
                    {leader.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FACILITATING DEPARTMENTS SECTION (MOVED FROM ABOUT) */}
          <section className="py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-7xl mx-auto"
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-serif font-bold text-gray-900 text-center mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Facilitating <span className="text-green-700">Departments</span>
              </motion.h2>
              
              <p className="text-gray-700 text-lg leading-relaxed text-center mb-10 max-w-3xl mx-auto">
                These departments provide essential support, ensuring the smooth operation and continued growth of all our ministries and church activities.
              </p>

              <div className="flex flex-col gap-16">
                {[
                  { title: "Hospitality and Ushering", icon: "👋", description: "In a church setting, the Hospitality and Ushering department plays a vital role in creating a welcoming and organized environment for worshippers. This department, often combined, is responsible for both the practical aspects of service management and fostering a warm, inclusive atmosphere. The Ushering Department in a church plays a vital role in creating a welcoming and organized environment for worship services and other events. They are responsible for greeting attendees, directing them to seats, collecting offerings, and ensuring the smooth flow of activities. Essentially, they are the first point of contact for many and help maintain order and reverence during services." },
                  { title: "Finance", icon: "💰", description: "A church's finance department, often organized as a committee or team, is responsible for managing the church's financial resources, ensuring transparency and accountability, and supporting the church's overall mission. This involves tasks like budgeting, financial reporting, fundraising, and managing church assets." },
                  { title: "Development", icon: "🏗️", description: "A church's development department, often called the 'Development Committee' or 'Church Development Department,' is responsible for overseeing the physical development and maintenance of the church property, as well as managing fundraising for church projects. This department works to ensure the church facilities are well-maintained and suitable for worship and other activities. They also play a crucial role in identifying areas needing improvement and organizing fundraising initiatives to support church projects, including construction and renovations." },
                  { title: "Equipment/Media", icon: "🎥", description: "This department, also known as a media ministry or tech team, is responsible for managing and operating the technical aspects of church services and events, including audio, video, lighting, and online streaming. This department ensures that the church's message is effectively communicated through various media channels, both within the physical building and online." },
                ].map((department, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                  >
                    {/* Icon/Graphic Section */}
                    <div className="w-full md:w-1/3 flex justify-center">
                      <div className="text-9xl text-green-700">
                        {department.icon}
                      </div>
                    </div>

                    {/* Text Section */}
                    <div className="w-full md:w-2/3">
                      <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                        {department.title}
                      </h3>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {department.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Empty State */}
          {filteredLeaders.length === 0 && (
            <motion.div 
              className="max-w-2xl mx-auto text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-6">🙏</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No leaders match this filter</h3>
              <p className="text-gray-700 mb-6">Try selecting a different category or view all our leaders</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter("all")}
                className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition"
              >
                View All Leaders
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Leader Modal */}
      <AnimatePresence>
        {selectedLeader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button 
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="h-64 md:h-80 w-full overflow-hidden">
                  {/* Replaced LazyLoadImage with native img tag */}
                  <img
                    src={selectedLeader.image}
                    alt={selectedLeader.name}
                    loading="lazy" // Native lazy loading
                    className="w-full h-full object-cover"
                    width="100%"
                    height="100%"
                  />
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                      {selectedLeader.name}
                    </h3>
                    <p className="text-green-700 text-lg font-medium">
                      {selectedLeader.role}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {selectedLeader.social?.twitter && (
                      <a 
                        href={selectedLeader.social.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 transition"
                        aria-label="Twitter profile"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    )}
                    {selectedLeader.social?.facebook && (
                      <a 
                        href={selectedLeader.social.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 transition"
                        aria-label="Facebook profile"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                      </a>
                    )}
                    {selectedLeader.social?.instagram && (
                      <a 
                        href={selectedLeader.social.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 transition"
                        aria-label="Instagram profile"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </a>
                    )}
                    {selectedLeader.social?.linkedin && (
                      <a 
                        href={selectedLeader.social.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 transition"
                        aria-label="LinkedIn profile"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="mb-8">
                  <p className="text-lg leading-relaxed text-gray-700">{selectedLeader.bio}</p>
                </div>
                
                <div className="mb-8 bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3">Personal Testimony</h4>
                  <p className="text-gray-700 italic">"{selectedLeader.testimony}"</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Contact Information</h4>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 mt-0.5 text-green-700 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-700">Email</p>
                          <a href={`mailto:${selectedLeader.email}`} className="text-gray-900 hover:underline font-medium">
                            {selectedLeader.email}
                          </a>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 mt-0.5 text-green-700 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-700">Phone</p>
                          <a href={`tel:${selectedLeader.phone}`} className="text-gray-900 hover:underline font-medium">
                            {selectedLeader.phone}
                          </a>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Ministry Involvement</h4>
                    <ul className="space-y-3">
                      {selectedLeader.ministryInvolvement.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-700 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leadership;
