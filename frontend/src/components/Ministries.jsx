import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Clock, MapPin, PlusCircle, BookOpen, ArrowRight } from "lucide-react";

const Ministries = () => {
  // Updated theme colors
  const primaryAccent = '#5D1C34'; // Deep burgundy
  const secondaryAccent = '#A67D44'; // Earthy gold
  const mainTextColor = '#FFFFFF'; // White
  const secondaryTextColor = '#EFE9E1'; // Light beige
  const blackBg = '#000000';
  const glassBg = 'rgba(0, 0, 0, 0.4)';
  const glassBorder = 'rgba(255, 255, 255, 0.15)';
  const glassShadow = 'rgba(0, 0, 0, 0.6)';
  const inputBg = 'rgba(255, 255, 255, 0.1)';
  const inputBorder = 'rgba(255, 255, 255, 0.2)';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const ministries = [
    // Ministry data remains unchanged
  ];

  // Filtering logic remains unchanged

  return (
    <div
      className="min-h-screen font-inter"
      style={{
        background: `linear-gradient(to bottom right, ${blackBg}, #1a202c, ${primaryAccent}20)`,
        color: mainTextColor,
      }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-cover bg-center py-20 px-4 sm:px-6">
        <div className="absolute inset-0" style={{ backgroundColor: `${primaryAccent}CC` }}></div>
        <div className="relative container mx-auto text-center z-10">
          <motion.div
            className="inline-block mb-6 px-6 py-2 rounded-full text-sm font-bold tracking-wider"
            style={{ backgroundColor: secondaryAccent, color: blackBg }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            SERVING TOGETHER
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 font-serif"
            style={{ color: mainTextColor }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Discover Our Ministries
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            style={{ color: secondaryTextColor }}
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
              style={{ backgroundColor: secondaryAccent, color: blackBg }}
              whileHover={{ scale: 1.05, boxShadow: `0 5px 15px ${secondaryAccent}40` }}
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
                  <Search className="h-5 w-5" style={{ color: secondaryAccent }} />
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
                    '--tw-ring-color': primaryAccent,
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
                        : 'text-white'
                    }`}
                    style={{
                      backgroundColor: selectedCategory === category 
                        ? primaryAccent
                        : glassBg,
                      border: `1px solid ${selectedCategory === category ? primaryAccent : glassBorder}`,
                      boxShadow: selectedCategory === category ? `0 2px 8px ${primaryAccent}40` : 'none',
                    }}
                    whileHover={{ scale: 1.05, boxShadow: `0 2px 10px ${primaryAccent}40` }}
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
                  whileHover={{ boxShadow: `0 12px 40px ${primaryAccent}40` }}
                >
                  <div className="w-full md:w-1/2">
                    <div className="relative h-full">
                      <img 
                        src={ministry.image} 
                        alt={ministry.title}
                        className="w-full h-full min-h-[350px] object-cover rounded-t-2xl md:rounded-tr-none md:rounded-bl-2xl"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/000000/FFFFFF?text=Image+Not+Found" }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="text-sm font-bold px-4 py-2 rounded-xl" style={{ 
                          backgroundColor: secondaryAccent,
                          color: blackBg
                        }}>
                          {ministry.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 font-serif" style={{ color: primaryAccent }}>
                      {ministry.title}
                    </h2>
                    
                    <p className="mb-6 text-lg" style={{ color: secondaryTextColor }}>
                      {ministry.description}
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-3" style={{ color: secondaryAccent }} />
                        <div>
                          <div className="font-medium" style={{ color: mainTextColor }}>Leader</div>
                          <div className="font-semibold" style={{ color: secondaryTextColor }}>{ministry.leader}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-3" style={{ color: primaryAccent }} />
                        <div>
                          <div className="font-medium" style={{ color: mainTextColor }}>Meeting Time</div>
                          <div className="font-semibold" style={{ color: secondaryTextColor }}>{ministry.meeting}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-3" style={{ color: secondaryAccent }} />
                        <div>
                          <div className="font-medium" style={{ color: mainTextColor }}>Location</div>
                          <div className="font-semibold" style={{ color: secondaryTextColor }}>{ministry.location}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 flex-wrap">
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: `0 5px 15px ${primaryAccent}40` }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 rounded-xl font-bold transition flex items-center"
                        style={{ backgroundColor: primaryAccent, color: mainTextColor }}
                      >
                        Join Ministry
                        <PlusCircle className="ml-2 h-4 w-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: `0 5px 15px ${secondaryAccent}40` }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-transparent rounded-xl font-bold transition flex items-center"
                        style={{ 
                          border: `1px solid ${secondaryAccent}`,
                          color: secondaryAccent
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
              style={{ backgroundColor: secondaryAccent, color: blackBg }}
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
                style={{ backgroundColor: primaryAccent, color: mainTextColor }}
                whileHover={{ scale: 1.05, boxShadow: `0 5px 15px ${primaryAccent}40` }}
                whileTap={{ scale: 0.98 }}
              >
                Propose a Ministry
              </motion.button>
              <motion.button 
                className="px-8 py-4 bg-transparent rounded-xl font-bold text-lg transition"
                style={{ 
                  border: `1px solid ${secondaryAccent}`,
                  color: secondaryAccent
                }}
                whileHover={{ scale: 1.05, boxShadow: `0 5px 15px ${secondaryAccent}40` }}
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
              whileHover={{ y: -5, boxShadow: `0 8px 20px ${secondaryAccent}30` }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${secondaryAccent}20` }}>
                  <Users className="w-6 h-6" style={{ color: secondaryAccent }} />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg" style={{ color: mainTextColor }}>Sarah M.</h4>
                  <p className="text-sm" style={{ color: secondaryTextColor }}>Youth Ministry</p>
                </div>
              </div>
              <motion.p className="italic" style={{ color: secondaryTextColor }}>
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
              whileHover={{ y: -5, boxShadow: `0 8px 20px ${primaryAccent}30` }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryAccent}20` }}>
                  <Users className="w-6 h-6" style={{ color: primaryAccent }} />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg" style={{ color: mainTextColor }}>James K.</h4>
                  <p className="text-sm" style={{ color: secondaryTextColor }}>Visionaries</p>
                </div>
              </div>
              <motion.p className="italic" style={{ color: secondaryTextColor }}>
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
              whileHover={{ y: -5, boxShadow: `0 8px 20px ${secondaryAccent}30` }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${secondaryAccent}20` }}>
                  <Users className="w-6 h-6" style={{ color: secondaryAccent }} />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg" style={{ color: mainTextColor }}>Grace W.</h4>
                  <p className="text-sm" style={{ color: secondaryTextColor }}>Women of Faith</p>
                </div>
              </div>
              <motion.p className="italic" style={{ color: secondaryTextColor }}>
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
              <div className="text-5xl font-bold mb-2" style={{ color: secondaryAccent }}>15</div>
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
              <div className="text-5xl font-bold mb-2" style={{ color: primaryAccent }}>350+</div>
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
              <div className="text-5xl font-bold mb-2" style={{ color: secondaryAccent }}>20+</div>
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