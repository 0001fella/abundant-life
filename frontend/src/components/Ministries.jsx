import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Clock, MapPin, PlusCircle, BookOpen, ArrowRight } from "lucide-react"; // Import Lucide icons, including ArrowRight

const Ministries = () => {
  // Define theme colors as constants from the Contact/Footer components
  const primaryAccentBlue = '#3B82F6'; // A vibrant blue for accents and highlights
  const primaryAccentGreen = '#10B981'; // A vibrant green for accents and highlights
  const mainTextColor = '#FFFFFF'; // Pure white for primary text on dark background
  const secondaryTextColor = '#E0E0E0'; // Light gray for subtle text
  const blackBg = '#000000'; // Explicit black background
  const glassBg = 'rgba(0, 0, 0, 0.4)'; // More transparent black for glass effect
  const glassBorder = 'rgba(255, 255, 255, 0.15)'; // Slightly more visible white border for glass effect
  const glassShadow = 'rgba(0, 0, 0, 0.6)'; // Stronger dark shadow for depth
  const inputBg = 'rgba(255, 255, 255, 0.1)'; // Light transparent background for inputs
  const inputBorder = 'rgba(255, 255, 255, 0.2)'; // Light transparent border for inputs

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const ministries = [
    {
      id: 1,
      title: "Sunday School",
      leader: "Sister Joan",
      meeting: "Sundays 9-11AM",
      location: "Education Wing",
      description: "A rich place where we develop children in the knowledge of God. With passionate and well-equipped teachers, we teach the Bible, grow their memory of God's word, and provide opportunities to minister in main services. Children enjoy singing, fun trips, and swimming - all pointing them toward knowing and accepting God's love in Christ.",
      category: "Children",
      image: '/child.jpg', // Placeholder for /child.jpg
    },
    {
      id: 2,
      title: "Youth and Teens",
      leader: "Pastor Samuel Masika",
      meeting: "Fridays 4-6PM",
      location: "Youth Hall",
      description: "We expose youth to the Holy Spirit to shape, equip, and develop them for today's life and challenges. Armed with God's word and practical tools, they confront the spirit of the age and stand for their faith through deliberate forums for interaction, knowledge sharing, and personal experience exchange.",
      category: "Youth",
      image: 'https://placehold.co/600x400/000000/FFFFFF?text=Youth+Ministry' // Placeholder for /Sam.jpg
    },
    {
      id: 3,
      title: "Adult Youth",
      leader: "Pastor Samwel",
      meeting: "Sundays 2-4PM",
      location: "Fellowship Hall",
      description: "Focused on 20-35 year olds, this ministry helps navigate life's challenges while developing a personal relationship with God. We encourage godly relationships and family-oriented discussions, helping young adults find their place in the church community with marriage in perspective.",
      category: "Young Adults",
      image: 'https://placehold.co/600x400/000000/FFFFFF?text=Adult+Youth' // Placeholder for /adult_youth.jpg
    },
    {
      id: 4,
      title: "Visionaries (Men)",
      leader: "Amphore",
      meeting: "Wednesdays 5-7PM",
      location: "Leadership Room",
      description: "Equipping and empowering men to live out their faith, build strong relationships, and lead families/communities by Christian principles. Provides fellowship, accountability, and spiritual growth space addressing unique challenges men face.",
      category: "Men",
      image: 'vissionary.jpg', // Placeholder for /vissionary.jpg
    },
    {
      id: 5,
      title: "Women of Faith",
      leader: "Caroline Barasa",
      meeting: "Thursdays 10AM-12PM",
      location: "Prayer Room",
      description: "A supportive environment for women to grow in faith, build community, and address spiritual, emotional, and practical needs. Women connect, study the Bible, pray together, and find encouragement and empowerment.",
      category: "Women",
      image: '/women.jpg', // Placeholder for /women.jpg
    },
    {
      id: 6,
      title: "Home Bible Churches",
      leader: "",
      meeting: "Tuesdays 6-8PM",
      location: "Ushindi, Imani, Ebenezer",
      description: "Essential small groups fostering spiritual growth through intimate discipleship and fellowship. Currently operating three home churches (Ushindi, Imani, Ebenezer) that supplement larger gatherings and enable closer accessibility and outreach.",
      category: "Home Church",
      image: 'https://placehold.co/600x400/000000/FFFFFF?text=Home+Church' // Placeholder for /home_church.jpg
    },
    {
      id: 7,
      title: "Evangelism, Outreach and Discipleship",
      leader: "Pastor Dennise",
      meeting: "Saturdays 10AM",
      location: "Community Park",
      description: "Shares the Christian message through verbal proclamation and practical service. Plans/organizes evangelism (one-on-one, crusades) and outreach (community service). Runs discipleship classes to ground new believers in God's word.",
      category: "Outreach",
      image: 'https://placehold.co/600x400/000000/FFFFFF?text=Outreach+Ministry' // Placeholder for /outreach.jpg
    },
    {
      id: 8,
      title: "Couples Ministry",
      leader: "",
      meeting: "1st Saturday monthly",
      location: "Fellowship Hall",
      description: "Strengthens marriages through support, education, counseling and fellowship. Offers premarital counseling, marriage enrichment programs, and connection opportunities to build healthy, God-centered relationships.",
      category: "Fellowship",
      image:'https://placehold.co/600x400/000000/FFFFFF?text=Couples+Ministry' // Placeholder for /couples.jpg
    },
    {
      id: 9,
      title: "Prayer and Intercession",
      leader: "",
      meeting: "Daily 6AM & Wednesdays 7PM",
      location: "Prayer Room",
      description: "Dedicated to continuous, fervent prayer for the church, leaders, and community. Plans/coordinates all prayer ventures, focuses on intercessory prayer, and trains members to cultivate a prayer culture.",
      category: "Prayer",
      image: 'https://placehold.co/600x400/000000/FFFFFF?text=Prayer+Ministry' // Placeholder for /prayer.jpg
    },
    {
      id: 10,
      title: "Praise and Worship",
      leader: "",
      meeting: "Sundays 8-10AM & Wednesdays 5-7PM",
      location: "Sanctuary",
      description: "Leads congregational worship through music and expressions of faith. Creates atmosphere for connecting with God while training others in musical instrument skills.",
      category: "Worship",
      image: 'https://placehold.co/600x400/000000/FFFFFF?text=Worship+Ministry' // Placeholder for /worship.jpg
    },
    {
      id: 11,
      title: "School of Ministry",
      leader: "Senior Pastor",
      meeting: "Starting Q1 2024",
      location: "Church Campus",
      description: "Equipping servants of God through structured programs to become effective global ministers of the Gospel (Launching soon).",
      category: "Training",
      image: 'https://placehold.co/600x400/000000/FFFFFF?text=Training+Ministry' // Placeholder for /training.jpg
    },
    {
      id: 12,
      title: "Hospitality and Ushering",
      leader: "",
      meeting: "Sundays 7:30AM & Special Events",
      location: "Main Lobby",
      description: "Creates welcoming environments and assists attendees during services. Responsible for greeting, seating, offerings, and service flow - serving as the first point of contact while maintaining order and reverence.",
      category: "Service",
      image: 'https://placehold.co/600x400/000000/FFFFFF?text=Hospitality+Ministry' // Placeholder for /ushers.jpg
    },
    {
      id: 13,
      title: "Finance Department",
      leader: "Church Treasurer",
      meeting: "Monthly meetings",
      location: "Church Office",
      description: "Manages financial resources with transparency and accountability. Handles budgeting, financial reporting, fundraising, and asset management to support the church's mission.",
      category: "Administration",
      image: 'https://placehold.co/600x400/000000/FFFFFF?text=Finance+Ministry' // Placeholder for /finance.jpg
    },
    {
      id: 14,
      title: "Development Department",
      leader: "",
      meeting: "Monthly meetings",
      location: "Church Office",
      description: "Oversees physical development, property maintenance, and fundraising for projects. Ensures facilities are suitable for worship and activities while identifying improvement areas.",
      category: "Administration",
      image: 'https://placehold.co/600x400/000000/FFFFFF?text=Development+Ministry' // Placeholder for /development.jpg
    },
    {
      id: 15,
      title: "Equipment/Media",
      leader: "",
      meeting: "Sundays before service & as needed",
      location: "Media Booth",
      description: "Manages technical aspects of services/events (audio, video, lighting, streaming). Ensures effective message communication through various media channels both onsite and online.",
      category: "Service",
      image: 'https://placehold.co/600x400/000000/FFFFFF?text=Media+Ministry' // Placeholder for /media.jpg
    }
  ];

  const filteredMinistries = ministries.filter(ministry => {
    const matchesSearch = ministry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || ministry.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(ministries.map(ministry => ministry.category))];

  return (
    <div
      className="min-h-screen font-inter" // Apply Inter font globally
      style={{
        background: `linear-gradient(to bottom right, ${blackBg}, #1a202c, ${primaryAccentBlue}20)`, // Blue and black gradient background
        color: mainTextColor, // Default text color for the page
      }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-cover bg-center py-20 px-4 sm:px-6">
        {/* Overlay for the hero section, using blue with transparency */}
        <div className="absolute inset-0" style={{ backgroundColor: `${primaryAccentBlue}CC` }}></div>
        <div className="relative container mx-auto text-center z-10">
          <motion.div
            className="inline-block mb-6 px-6 py-2 rounded-full text-sm font-bold tracking-wider"
            style={{ backgroundColor: primaryAccentGreen, color: blackBg }} // Green tag on black background
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            SERVING TOGETHER
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 font-serif"
            style={{ color: mainTextColor }} // White text
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Discover Our Ministries
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            style={{ color: secondaryTextColor }} // Light gray text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Find your place to serve, grow, and connect with others in our church community
          </motion.p>
          
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.button 
              className="px-8 py-4 rounded-lg font-bold text-lg transition flex items-center mx-auto group"
              style={{ backgroundColor: primaryAccentGreen, color: blackBg }} // Green button with black text
              whileHover={{ scale: 1.05, boxShadow: `0 5px 15px ${primaryAccentGreen}40` }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Ministries 
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 font-serif" style={{ color: mainTextColor }}>
              Find Your Ministry
            </h2>
            
            <div 
              className="rounded-2xl shadow-lg p-6 border"
              style={{ 
                backgroundColor: glassBg, 
                borderColor: glassBorder,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: `0 8px 30px ${glassShadow}`,
              }}
            >
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5" style={{ color: primaryAccentGreen }} />
                </div>
                <input
                  type="text"
                  placeholder="Search ministries by name, category, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 outline-none transition text-lg"
                  style={{ 
                    backgroundColor: inputBg, 
                    borderColor: inputBorder, 
                    color: mainTextColor,
                    '--tw-ring-color': primaryAccentBlue,
                    '--tw-focus-border-color': primaryAccentBlue,
                  }}
                />
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl transition text-sm font-medium ${
                      selectedCategory === category
                        ? 'text-white' 
                        : 'text-white' // All category buttons text will be white
                    }`}
                    style={{
                      backgroundColor: selectedCategory === category 
                        ? primaryAccentBlue // Selected category is blue
                        : glassBg, // Unselected is glass
                      border: `1px solid ${selectedCategory === category ? primaryAccentBlue : glassBorder}`,
                      boxShadow: selectedCategory === category ? `0 2px 8px ${primaryAccentBlue}40` : 'none',
                    }}
                    whileHover={{ scale: 1.05, boxShadow: `0 2px 10px ${primaryAccentBlue}40` }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ministries List */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-serif" style={{ color: mainTextColor }}>
              Our Ministries
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: secondaryTextColor }}>
              Join one of our vibrant ministries to serve, grow, and connect with others
            </p>
          </div>
          
          {filteredMinistries.length === 0 ? (
            <div className="text-center py-12 rounded-xl shadow-lg border" 
                 style={{ 
                   backgroundColor: glassBg, 
                   borderColor: glassBorder,
                   backdropFilter: 'blur(8px)',
                   WebkitBackdropFilter: 'blur(8px)',
                   boxShadow: `0 8px 30px ${glassShadow}`,
                 }}>
              <p className="text-xl" style={{ color: mainTextColor }}>No ministries found matching your search</p>
            </div>
          ) : (
            <div className="space-y-16">
              {filteredMinistries.map((ministry, index) => (
                <motion.div
                  key={ministry.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 border`}
                  style={{ 
                    backgroundColor: glassBg, 
                    borderColor: glassBorder,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    boxShadow: `0 8px 30px ${glassShadow}`,
                  }}
                  whileHover={{ boxShadow: `0 12px 40px ${primaryAccentBlue}40` }} // Stronger blue shadow on hover
                >
                  <div className="w-full md:w-1/2">
                    <div className="relative h-full">
                      <img 
                        src={ministry.image} 
                        alt={ministry.title}
                        className="w-full h-full min-h-[350px] object-cover rounded-t-2xl md:rounded-tr-none md:rounded-bl-2xl" // Apply rounded corners
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/000000/FFFFFF?text=Image+Not+Found" }} // Fallback image
                      />
                      <div className="absolute top-4 left-4">
                        <span className="text-sm font-bold px-4 py-2 rounded-xl" style={{ 
                          backgroundColor: primaryAccentGreen, // Green tag
                          color: blackBg
                        }}>
                          {ministry.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 font-serif" style={{ color: primaryAccentBlue }}>
                      {ministry.title}
                    </h2>
                    
                    <p className="mb-6 text-lg" style={{ color: secondaryTextColor }}>
                      {ministry.description}
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-3" style={{ color: primaryAccentGreen }} />
                        <div>
                          <div className="font-medium" style={{ color: mainTextColor }}>Leader</div>
                          <div className="font-semibold" style={{ color: secondaryTextColor }}>{ministry.leader}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-3" style={{ color: primaryAccentBlue }} />
                        <div>
                          <div className="font-medium" style={{ color: mainTextColor }}>Meeting Time</div>
                          <div className="font-semibold" style={{ color: secondaryTextColor }}>{ministry.meeting}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-3" style={{ color: primaryAccentGreen }} />
                        <div>
                          <div className="font-medium" style={{ color: mainTextColor }}>Location</div>
                          <div className="font-semibold" style={{ color: secondaryTextColor }}>{ministry.location}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 flex-wrap">
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: `0 5px 15px ${primaryAccentBlue}40` }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 rounded-xl font-bold transition flex items-center"
                        style={{ backgroundColor: primaryAccentBlue, color: mainTextColor }}
                      >
                        Join Ministry
                        <PlusCircle className="ml-2 h-4 w-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: `0 5px 15px ${primaryAccentGreen}40` }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-transparent rounded-xl font-bold transition flex items-center"
                        style={{ 
                          border: `1px solid ${primaryAccentGreen}`,
                          color: primaryAccentGreen
                        }}
                      >
                        Learn More
                        <BookOpen className="ml-2 h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div 
            className="max-w-4xl mx-auto text-center p-10 rounded-2xl"
            style={{
              backgroundColor: glassBg,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: `1px solid ${glassBorder}`,
              boxShadow: `0 8px 30px ${glassShadow}`,
            }}
          >
            <motion.div
              className="inline-block mb-6 px-6 py-2 rounded-full text-sm font-bold tracking-wider"
              style={{ backgroundColor: primaryAccentGreen, color: blackBg }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              GET INVOLVED
            </motion.div>
            
            <motion.h2 
              className="text-4xl font-bold mb-6 font-serif"
              style={{ color: mainTextColor }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Start a New Ministry
            </motion.h2>
            
            <motion.p 
              className="text-xl mb-10 max-w-3xl mx-auto"
              style={{ color: secondaryTextColor }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Have a vision for a new ministry? We'd love to support you in launching and growing it within our church community.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.button 
                className="px-8 py-4 rounded-xl font-bold text-lg transition"
                style={{ backgroundColor: primaryAccentBlue, color: mainTextColor }}
                whileHover={{ scale: 1.05, boxShadow: `0 5px 15px ${primaryAccentBlue}40` }}
                whileTap={{ scale: 0.98 }}
              >
                Propose a Ministry
              </motion.button>
              <motion.button 
                className="px-8 py-4 bg-transparent rounded-xl font-bold text-lg transition"
                style={{ 
                  border: `1px solid ${primaryAccentGreen}`,
                  color: primaryAccentGreen
                }}
                whileHover={{ scale: 1.05, boxShadow: `0 5px 15px ${primaryAccentGreen}40` }}
                whileTap={{ scale: 0.98 }}
              >
                Ministry Resources
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-serif" style={{ color: mainTextColor }}>
              Ministry Testimonials
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: secondaryTextColor }}>
              Hear from members who have found purpose and community through our ministries
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="rounded-2xl shadow-lg p-8 border"
              style={{ 
                backgroundColor: glassBg, 
                borderColor: glassBorder,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: `0 8px 30px ${glassShadow}`,
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: `0 8px 20px ${primaryAccentGreen}30` }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryAccentGreen}20` }}>
                  <Users className="w-6 h-6" style={{ color: primaryAccentGreen }} />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg" style={{ color: mainTextColor }}>Sarah M.</h4>
                  <p className="text-sm" style={{ color: secondaryTextColor }}>Youth Ministry</p>
                </div>
              </div>
              <motion.p className="italic" style={{ color: secondaryTextColor }}> {/* Changed to motion.p */}
                "Joining the Youth Ministry transformed my faith journey. I've found lifelong friends and grown spiritually in ways I never imagined."
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="rounded-2xl shadow-lg p-8 border"
              style={{ 
                backgroundColor: glassBg, 
                borderColor: glassBorder,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: `0 8px 30px ${glassShadow}`,
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, boxShadow: `0 8px 20px ${primaryAccentBlue}30` }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryAccentBlue}20` }}>
                  <Users className="w-6 h-6" style={{ color: primaryAccentBlue }} />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg" style={{ color: mainTextColor }}>James K.</h4>
                  <p className="text-sm" style={{ color: secondaryTextColor }}>Visionaries</p>
                </div>
              </div>
              <motion.p className="italic" style={{ color: secondaryTextColor }}> {/* Changed to motion.p */}
                "The Visionaries ministry equipped me with leadership skills that have impacted both my spiritual life and career."
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="rounded-2xl shadow-lg p-8 border"
              style={{ 
                backgroundColor: glassBg, 
                borderColor: glassBorder,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: `0 8px 30px ${glassShadow}`,
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, boxShadow: `0 8px 20px ${primaryAccentGreen}30` }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryAccentGreen}20` }}>
                  <Users className="w-6 h-6" style={{ color: primaryAccentGreen }} />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg" style={{ color: mainTextColor }}>Grace W.</h4>
                  <p className="text-sm" style={{ color: secondaryTextColor }}>Women of Faith</p>
                </div>
              </div>
              <motion.p className="italic" style={{ color: secondaryTextColor }}> {/* Changed to motion.p */}
                "Through Women of Faith, I've found a supportive community that has helped me through challenging times."
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 font-serif" style={{ color: mainTextColor }}>Ministry Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-2xl" 
                 style={{ 
                   backgroundColor: glassBg, 
                   border: `1px solid ${glassBorder}`,
                   backdropFilter: 'blur(8px)',
                   WebkitBackdropFilter: 'blur(8px)',
                   boxShadow: `0 4px 15px ${glassShadow}`,
                 }}>
              <div className="text-5xl font-bold mb-2" style={{ color: primaryAccentGreen }}>15</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: mainTextColor }}>Active Ministries</h3>
              <p style={{ color: secondaryTextColor }}>Serving various needs in our church and community</p>
            </div>
            <div className="text-center p-6 rounded-2xl" 
                 style={{ 
                   backgroundColor: glassBg, 
                   border: `1px solid ${glassBorder}`,
                   backdropFilter: 'blur(8px)',
                   WebkitBackdropFilter: 'blur(8px)',
                   boxShadow: `0 4px 15px ${glassShadow}`,
                 }}>
              <div className="text-5xl font-bold mb-2" style={{ color: primaryAccentBlue }}>350+</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: mainTextColor }}>Volunteers</h3>
              <p style={{ color: secondaryTextColor }}>Dedicated members serving across all ministries</p>
            </div>
            <div className="text-center p-6 rounded-2xl" 
                 style={{ 
                   backgroundColor: glassBg, 
                   border: `1px solid ${glassBorder}`,
                   backdropFilter: 'blur(8px)',
                   WebkitBackdropFilter: 'blur(8px)',
                   boxShadow: `0 4px 15px ${glassShadow}`,
                 }}>
              <div className="text-5xl font-bold mb-2" style={{ color: primaryAccentGreen }}>20+</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: mainTextColor }}>Weekly Gatherings</h3>
              <p style={{ color: secondaryTextColor }}>Opportunities to connect and grow throughout the week</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ministries;
