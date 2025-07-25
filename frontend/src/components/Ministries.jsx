import React, { useState } from "react";
import { motion } from "framer-motion";

const Ministries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const ministries = [
    {
      id: 1,
      title: "Sunday School",
      leader: "Sister Grace Wambui",
      meeting: "Sundays 9-11AM",
      location: "Education Wing",
      description: "A rich place where we develop children in the knowledge of God. With passionate and well-equipped teachers, we teach the Bible, grow their memory of God's word, and provide opportunities to minister in main services. Children enjoy singing, fun trips, and swimming - all pointing them toward knowing and accepting God's love in Christ.",
      category: "Children",
      image: '/child.jpg'
    },
    {
      id: 2,
      title: "Youth and Teens",
      leader: "Pastor Samuel Masika",
      meeting: "Fridays 4-6PM",
      location: "Youth Hall",
      description: "We expose youth to the Holy Spirit to shape, equip, and develop them for today's life and challenges. Armed with God's word and practical tools, they confront the spirit of the age and stand for their faith through deliberate forums for interaction, knowledge sharing, and personal experience exchange.",
      category: "Youth",
      image: '/Sam.jpg'
    },
    {
      id: 3,
      title: "Adult Youth",
      leader: "Pastor Daniel Kimani",
      meeting: "Sundays 2-4PM",
      location: "Fellowship Hall",
      description: "Focused on 20-35 year olds, this ministry helps navigate life's challenges while developing a personal relationship with God. We encourage godly relationships and family-oriented discussions, helping young adults find their place in the church community with marriage in perspective.",
      category: "Young Adults",
      image: '/adult_youth.jpg'
    },
    {
      id: 4,
      title: "Visionaries (Men)",
      leader: "Elder James Mwangi",
      meeting: "Wednesdays 5-7PM",
      location: "Leadership Room",
      description: "Equipping and empowering men to live out their faith, build strong relationships, and lead families/communities by Christian principles. Provides fellowship, accountability, and spiritual growth space addressing unique challenges men face.",
      category: "Men",
      image: '/vissionary.jpg'
    },
    {
      id: 5,
      title: "Women of Faith",
      leader: "Deaconess Mary Otieno",
      meeting: "Thursdays 10AM-12PM",
      location: "Prayer Room",
      description: "A supportive environment for women to grow in faith, build community, and address spiritual, emotional, and practical needs. Women connect, study the Bible, pray together, and find encouragement and empowerment.",
      category: "Women",
      image: '/women.jpg'
    },
    {
      id: 6,
      title: "Home Bible Churches",
      leader: "Elder Thomas Owino",
      meeting: "Tuesdays 6-8PM",
      location: "Ushindi, Imani, Ebenezer",
      description: "Essential small groups fostering spiritual growth through intimate discipleship and fellowship. Currently operating three home churches (Ushindi, Imani, Ebenezer) that supplement larger gatherings and enable closer accessibility and outreach.",
      category: "Home Church",
      image: '/home_church.jpg'
    },
    {
      id: 7,
      title: "Evangelism, Outreach and Discipleship",
      leader: "Evangelist Paul Ochieng",
      meeting: "Saturdays 10AM",
      location: "Community Park",
      description: "Shares the Christian message through verbal proclamation and practical service. Plans/organizes evangelism (one-on-one, crusades) and outreach (community service). Runs discipleship classes to ground new believers in God's word.",
      category: "Outreach",
      image: '/outreach.jpg'
    },
    {
      id: 8,
      title: "Couples Ministry",
      leader: "Bro. & Sis. Kamau",
      meeting: "1st Saturday monthly",
      location: "Fellowship Hall",
      description: "Strengthens marriages through support, education, counseling and fellowship. Offers premarital counseling, marriage enrichment programs, and connection opportunities to build healthy, God-centered relationships.",
      category: "Fellowship",
      image:'/couples.jpg'
    },
    {
      id: 9,
      title: "Prayer and Intercession",
      leader: "Elder Sarah Njeri",
      meeting: "Daily 6AM & Wednesdays 7PM",
      location: "Prayer Room",
      description: "Dedicated to continuous, fervent prayer for the church, leaders, and community. Plans/coordinates all prayer ventures, focuses on intercessory prayer, and trains members to cultivate a prayer culture.",
      category: "Prayer",
      image: '/prayer.jpg'
    },
    {
      id: 10,
      title: "Praise and Worship",
      leader: "Minister David Omondi",
      meeting: "Sundays 8-10AM & Wednesdays 5-7PM",
      location: "Sanctuary",
      description: "Leads congregational worship through music and expressions of faith. Creates atmosphere for connecting with God while training others in musical instrument skills.",
      category: "Worship",
      image: '/worship.jpg'
    },
    {
      id: 11,
      title: "School of Ministry",
      leader: "Senior Pastor",
      meeting: "Starting Q1 2024",
      location: "Church Campus",
      description: "Equipping servants of God through structured programs to become effective global ministers of the Gospel (Launching soon).",
      category: "Training",
      image: '/training.jpg'
    },
    {
      id: 12,
      title: "Hospitality and Ushering",
      leader: "Deaconess Jane Akinyi",
      meeting: "Sundays 7:30AM & Special Events",
      location: "Main Lobby",
      description: "Creates welcoming environments and assists attendees during services. Responsible for greeting, seating, offerings, and service flow - serving as the first point of contact while maintaining order and reverence.",
      category: "Service",
      image: '/ushers.jpg'
    },
    {
      id: 13,
      title: "Finance Department",
      leader: "Church Treasurer",
      meeting: "Monthly meetings",
      location: "Church Office",
      description: "Manages financial resources with transparency and accountability. Handles budgeting, financial reporting, fundraising, and asset management to support the church's mission.",
      category: "Administration",
      image: '/finance.jpg'
    },
    {
      id: 14,
      title: "Development Department",
      leader: "Bro. Michael Odhiambo",
      meeting: "Monthly meetings",
      location: "Church Office",
      description: "Oversees physical development, property maintenance, and fundraising for projects. Ensures facilities are suitable for worship and activities while identifying improvement areas.",
      category: "Administration",
      image: '/development.jpg'
    },
    {
      id: 15,
      title: "Equipment/Media",
      leader: "Sister Linda Atieno",
      meeting: "Sundays before service & as needed",
      location: "Media Booth",
      description: "Manages technical aspects of services/events (audio, video, lighting, streaming). Ensures effective message communication through various media channels both onsite and online.",
      category: "Service",
      image: '/media.jpg'
    }
  ];

  const filteredMinistries = ministries.filter(ministry => {
    const matchesSearch = ministry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || ministry.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Updated category colors
  const categoryColors = {
    Children: "bg-green-500 text-white",
    Youth: "bg-green-600 text-white",
    "Young Adults": "bg-green-700 text-white",
    Men: "bg-green-800 text-white",
    Women: "bg-pink-500 text-white",
    "Home Church": "bg-emerald-500 text-white",
    Outreach: "bg-emerald-600 text-white",
    Fellowship: "bg-emerald-700 text-white",
    Prayer: "bg-emerald-800 text-white",
    Worship: "bg-emerald-900 text-white",
    Training: "bg-teal-500 text-white",
    Service: "bg-teal-600 text-white",
    Administration: "bg-teal-700 text-white"
  };

  const categories = ['All', ...new Set(ministries.map(ministry => ministry.category))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-800/80"></div>
        <div className="relative container mx-auto px-4 py-32 lg:py-40 text-center">
          <motion.div
            className="inline-block mb-6 bg-yellow-400 text-emerald-900 rounded-full px-6 py-2 text-sm font-bold tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            SERVING TOGETHER
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 text-white font-serif"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Discover Our Ministries
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-emerald-100"
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
            <button className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-emerald-900 rounded-lg font-bold text-lg transition flex items-center mx-auto">
              Explore Ministries 
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-emerald-900 font-serif">Find Your Ministry</h2>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-200">
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search ministries by name, category, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition text-lg bg-emerald-50"
                />
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl transition text-sm font-medium ${
                      selectedCategory === category
                        ? 'bg-yellow-400 text-emerald-900'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ministries List */}
      <section className="py-16 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-emerald-900 font-serif">Our Ministries</h2>
            <p className="text-xl text-emerald-700 max-w-3xl mx-auto">
              Join one of our vibrant ministries to serve, grow, and connect with others
            </p>
          </div>
          
          {filteredMinistries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-emerald-200">
              <p className="text-emerald-700 text-xl">No ministries found matching your search</p>
            </div>
          ) : (
            <div className="space-y-16">
              {filteredMinistries.map((ministry, index) => (
                <motion.div
                  key={ministry.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-emerald-200`}
                >
                  <div className="w-full md:w-1/2">
                    <div className="relative h-full">
                      <img 
                        src={ministry.image} 
                        alt={ministry.title}
                        className="w-full h-full min-h-[350px] object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`${categoryColors[ministry.category]} text-sm font-bold px-4 py-2 rounded-xl`}>
                          {ministry.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-emerald-900 font-serif">
                      {ministry.title}
                    </h2>
                    
                    <p className="text-emerald-700 mb-6 text-lg">
                      {ministry.description}
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center text-emerald-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <div>
                          <div className="font-medium text-emerald-900">Leader</div>
                          <div className="font-semibold">{ministry.leader}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-emerald-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="font-medium text-emerald-900">Meeting Time</div>
                          <div className="font-semibold">{ministry.meeting}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-emerald-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="font-medium text-emerald-900">Location</div>
                          <div className="font-semibold">{ministry.location}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center"
                      >
                        Join Ministry
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-transparent border border-emerald-800 text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold transition flex items-center"
                      >
                        Learn More
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
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
      <section className="py-20 bg-emerald-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-block mb-6 bg-yellow-400 text-emerald-900 rounded-full px-6 py-2 text-sm font-bold tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              GET INVOLVED
            </motion.div>
            
            <motion.h2 
              className="text-4xl font-bold mb-6 font-serif"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Start a New Ministry
            </motion.h2>
            
            <motion.p 
              className="text-xl mb-10 max-w-3xl mx-auto text-emerald-200"
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
              <button className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-emerald-900 rounded-xl font-bold text-lg transition">
                Propose a Ministry
              </button>
              <button className="px-8 py-4 bg-transparent hover:bg-emerald-800 border border-white text-white rounded-xl font-bold text-lg transition">
                Ministry Resources
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-emerald-900 font-serif">Ministry Testimonials</h2>
            <p className="text-xl text-emerald-700 max-w-3xl mx-auto">
              Hear from members who have found purpose and community through our ministries
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg text-emerald-900">Sarah M.</h4>
                  <p className="text-emerald-600 text-sm">Youth Ministry</p>
                </div>
              </div>
              <p className="text-emerald-700 italic">
                "Joining the Youth Ministry transformed my faith journey. I've found lifelong friends and grown spiritually in ways I never imagined."
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg text-emerald-900">James K.</h4>
                  <p className="text-emerald-600 text-sm">Visionaries</p>
                </div>
              </div>
              <p className="text-emerald-700 italic">
                "The Visionaries ministry equipped me with leadership skills that have impacted both my spiritual life and career."
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg text-emerald-900">Grace W.</h4>
                  <p className="text-emerald-600 text-sm">Women of Faith</p>
                </div>
              </div>
              <p className="text-emerald-700 italic">
                "Through Women of Faith, I've found a supportive community that has helped me through challenging times."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-emerald-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 font-serif">Ministry Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-emerald-900/50 rounded-2xl">
              <div className="text-5xl font-bold text-yellow-400 mb-2">15</div>
              <h3 className="text-xl font-bold mb-2">Active Ministries</h3>
              <p>Serving various needs in our church and community</p>
            </div>
            <div className="text-center p-6 bg-emerald-900/50 rounded-2xl">
              <div className="text-5xl font-bold text-yellow-400 mb-2">350+</div>
              <h3 className="text-xl font-bold mb-2">Volunteers</h3>
              <p>Dedicated members serving across all ministries</p>
            </div>
            <div className="text-center p-6 bg-emerald-900/50 rounded-2xl">
              <div className="text-5xl font-bold text-yellow-400 mb-2">20+</div>
              <h3 className="text-xl font-bold mb-2">Weekly Gatherings</h3>
              <p>Opportunities to connect and grow throughout the week</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ministries;