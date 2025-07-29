import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, HeartHandshake, CalendarDays, Clock, Facebook, Instagram, Twitter, Youtube, Send, ArrowRight } from "lucide-react";

const Contact = () => {
  // Define the color palette from the Footer component
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

  return (
    <div
      className="min-h-screen font-inter" // Apply Inter font globally
      style={{
        background: `linear-gradient(to bottom right, ${blackBg}, #1a202c, ${primaryAccentBlue}20)`, // Blue and black gradient background
        color: mainTextColor, // Default text color for the page
      }}
    >
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4 leading-tight font-serif"
            style={{ color: mainTextColor }} // White text for main heading
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Connect With <span style={{ color: primaryAccentGreen }}>Our Church</span>
          </motion.h1>
          
          <motion.p 
            className="max-w-2xl mx-auto text-lg mb-6"
            style={{ color: secondaryTextColor }} // Light gray for sub-heading
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We'd love to hear from you. Reach out through any of these channels.
          </motion.p>
          
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.a 
              href="#contact-form"
              whileHover={{ scale: 1.05, boxShadow: `0 5px 15px ${primaryAccentBlue}40` }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 font-medium rounded-lg shadow-md flex items-center gap-2"
              style={{ backgroundColor: primaryAccentBlue, color: mainTextColor }} // Blue button
            >
              Send a Message <ArrowRight size={20} />
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {[
              { 
                icon: <MapPin className="w-6 h-6" style={{ color: primaryAccentGreen }} />,
                title: "Our Location",
                content: "Umoja III, Chokmart, Nairobi, Kenya",
                action: "Get Directions",
                link: "https://maps.app.goo.gl/example"
              },
              { 
                icon: <Mail className="w-6 h-6" style={{ color: primaryAccentBlue }} />,
                title: "Email Us",
                content: "info@alcc.org\nprayer@alcc.org",
                action: "Send Email",
                link: "mailto:info@alcc.org"
              },
              { 
                icon: <Phone className="w-6 h-6" style={{ color: primaryAccentGreen }} />,
                title: "Call Us",
                content: "+254 700 123 456\n+254 711 987 654",
                action: "Call Now",
                link: "tel:+254700123456"
              },
              { 
                icon: <CalendarDays className="w-6 h-6" style={{ color: primaryAccentBlue }} />,
                title: "Service Times",
                content: "Sunday: 8:30 AM & 10:30 AM\nWednesday: 6:30 PM (Bible Study)",
                action: "View Details",
                link: "/services"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="p-5 rounded-xl h-full flex flex-col justify-between"
                style={{
                  backgroundColor: glassBg,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: `1px solid ${glassBorder}`,
                  boxShadow: `0 4px 15px ${glassShadow}`,
                }}
                whileHover={{ y: -8, boxShadow: `0 8px 25px ${primaryAccentBlue}30` }} // Accent shadow on hover
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4"
                     style={{ backgroundColor: index % 2 === 0 ? `${primaryAccentGreen}20` : `${primaryAccentBlue}20` }}> {/* Alternating icon background */}
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl mb-3" style={{ color: mainTextColor }}>{item.title}</h3>
                <p className="mb-4 whitespace-pre-line" style={{ color: secondaryTextColor }}>{item.content}</p>
                <motion.a
                  href={item.link}
                  whileHover={{ scale: 1.03, x: 5 }}
                  className="font-medium text-sm hover:underline flex items-center gap-1"
                  style={{ color: index % 2 === 0 ? primaryAccentGreen : primaryAccentBlue }} // Alternating link color
                >
                  {item.action} <ArrowRight size={16} />
                </motion.a>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form & Social Media / Ministries */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              id="contact-form"
              className="p-8 rounded-2xl"
              style={{
                backgroundColor: glassBg,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: `1px solid ${glassBorder}`,
                boxShadow: `0 8px 30px ${glassShadow}`,
              }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: mainTextColor }}>
                <Send size={24} style={{ color: primaryAccentGreen }} />
                Send Us a Message
              </h2>
              
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block mb-2" style={{ color: secondaryTextColor }}>Your Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg focus:ring-2 transition"
                      style={{
                        backgroundColor: inputBg,
                        border: `1px solid ${inputBorder}`,
                        color: mainTextColor,
                        '--tw-ring-color': primaryAccentBlue, // Tailwind ring color
                        '--tw-focus-border-color': primaryAccentBlue, // Tailwind focus border color
                      }}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2" style={{ color: secondaryTextColor }}>Email Address</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg focus:ring-2 transition"
                      style={{
                        backgroundColor: inputBg,
                        border: `1px solid ${inputBorder}`,
                        color: mainTextColor,
                        '--tw-ring-color': primaryAccentBlue,
                        '--tw-focus-border-color': primaryAccentBlue,
                      }}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2" style={{ color: secondaryTextColor }}>Subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 transition"
                    style={{
                      backgroundColor: inputBg,
                      border: `1px solid ${inputBorder}`,
                      color: mainTextColor,
                      '--tw-ring-color': primaryAccentBlue,
                      '--tw-focus-border-color': primaryAccentBlue,
                    }}
                    placeholder="How can we help?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2" style={{ color: secondaryTextColor }}>Your Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 transition"
                    style={{
                      backgroundColor: inputBg,
                      border: `1px solid ${inputBorder}`,
                      color: mainTextColor,
                      '--tw-ring-color': primaryAccentBlue,
                      '--tw-focus-border-color': primaryAccentBlue,
                    }}
                    placeholder="Type your message here..."
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  className="w-full px-6 py-3 font-bold rounded-lg shadow flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(to right, ${primaryAccentBlue}, ${primaryAccentGreen})`, color: mainTextColor }} // Blue-green gradient button
                  whileHover={{ scale: 1.02, boxShadow: `0 5px 20px ${primaryAccentBlue}50` }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message <Send size={20} />
                </motion.button>
              </form>
            </motion.div>
            
            {/* Social Media & Ministries */}
            <motion.div
              className="p-8 rounded-2xl"
              style={{
                backgroundColor: glassBg,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: `1px solid ${glassBorder}`,
                boxShadow: `0 8px 30px ${glassShadow}`,
              }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Social Media */}
              <div className="mb-8">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2" style={{ color: mainTextColor }}>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${primaryAccentGreen}20` }}>
                    <Facebook className="" style={{ color: primaryAccentGreen }} />
                  </div>
                  Connect With Us
                </h3>
                <div className="flex gap-3">
                  {[
                    { icon: <Facebook className="w-5 h-5" />, url: "https://facebook.com", color: "#3b5998", name: "Facebook" },
                    { icon: <Instagram className="w-5 h-5" />, url: "https://instagram.com", color: "#e4405f", name: "Instagram" },
                    { icon: <Twitter className="w-5 h-5" />, url: "https://twitter.com", color: "#1da1f2", name: "Twitter" },
                    { icon: <Youtube className="w-5 h-5" />, url: "https://youtube.com", color: "#cd201f", name: "YouTube" }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white p-3 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${social.color}30`, border: `1px solid ${social.color}50` }}
                      whileHover={{ y: -5, scale: 1.1, boxShadow: `0 5px 15px ${social.color}40` }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={social.name}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
                <p className="mt-4 text-sm" style={{ color: secondaryTextColor }}>
                  Follow us for daily encouragement, live streams, and updates.
                </p>
              </div>

              {/* Ministries Contact */}
              <div>
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2" style={{ color: mainTextColor }}>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${primaryAccentBlue}20` }}>
                    <HeartHandshake className="" size={20} style={{ color: primaryAccentBlue }} />
                  </div>
                  Ministry Contacts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "Children", email: "children@alcc.org" },
                    { name: "Youth", email: "youth@alcc.org" },
                    { name: "Women", email: "women@alcc.org" },
                    { name: "Men", email: "men@alcc.org" },
                    { name: "Worship", email: "worship@alcc.org" },
                    { name: "Outreach", email: "outreach@alcc.org" },
                    { name: "Prayer", email: "prayer@alcc.org" },
                    { name: "Media", email: "media@alcc.org" }
                  ].map((ministry, index) => (
                    <motion.div 
                      key={index}
                      className="p-3 rounded-lg"
                      style={{
                        backgroundColor: inputBg, // Use inputBg for ministry boxes
                        border: `1px solid ${inputBorder}`,
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -3, boxShadow: `0 3px 10px ${glassShadow}` }}
                    >
                      <h4 className="font-bold mb-1" style={{ color: mainTextColor }}>{ministry.name}</h4>
                      <a 
                        href={`mailto:${ministry.email}`} 
                        className="text-sm hover:underline"
                        style={{ color: index % 2 === 0 ? primaryAccentGreen : primaryAccentBlue }} // Alternating link color
                      >
                        {ministry.email}
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.h2 
            className="text-3xl font-bold mb-8 text-center font-serif"
            style={{ color: mainTextColor }} // White text for FAQ heading
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked Questions
          </motion.h2>
          
          <div className="grid grid-cols-1 gap-6">
            {[
              { 
                question: "What should I expect on my first visit?", 
                answer: "You'll be greeted warmly, enjoy inspiring worship, and hear a relevant message. We have special hospitality areas for first-time guests." 
              },
              { 
                question: "Do you have programs for children?", 
                answer: "Yes! We have excellent programs for children of all ages during all our services with trained, caring staff." 
              },
              { 
                question: "How can I get involved in serving?", 
                answer: "We have many serving opportunities. Visit our Connect Desk on Sundays or browse serving opportunities on our website." 
              },
              { 
                question: "Do you offer counseling services?", 
                answer: "Yes, our pastoral staff provides confidential counseling. Contact our office to schedule an appointment." 
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                className="p-6 rounded-xl"
                style={{
                  backgroundColor: glassBg,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: `1px solid ${glassBorder}`,
                  boxShadow: `0 4px 15px ${glassShadow}`,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: `0 8px 20px ${primaryAccentGreen}30` }} // Green accent shadow on hover
              >
                <h3 className="text-xl font-bold mb-3" style={{ color: primaryAccentGreen }}>{faq.question}</h3>
                <p style={{ color: secondaryTextColor }}>{faq.answer}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.a
              href="/faq"
              className="inline-block px-8 py-4 font-medium rounded-lg shadow"
              style={{ background: `linear-gradient(to right, ${primaryAccentGreen}, ${primaryAccentBlue})`, color: mainTextColor }} // Green-blue gradient button
              whileHover={{ scale: 1.05, boxShadow: `0 5px 20px ${primaryAccentGreen}50` }}
              whileTap={{ scale: 0.95 }}
            >
              View All FAQs
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
