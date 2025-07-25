import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, HeartHandshake, CalendarDays, Clock, Facebook, Instagram, Twitter, Youtube, Send, ArrowRight } from "lucide-react";

const Contact = () => {
  return (
    <div className="bg-[#f8f9fb] text-[#2d3748] min-h-screen">
      {/* Compact Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 text-center overflow-hidden bg-gradient-to-r from-[#0d3b66] to-[#1a5e9a]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-white font-serif"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Connect With <span className="text-[#8a704c]">Our Church</span>
          </motion.h1>
          
          <motion.p 
            className="max-w-2xl mx-auto text-lg text-[#d5f5e3] mb-6"
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[#8a704c] text-white font-medium rounded-lg shadow-md"
            >
              Send a Message
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* Compact Contact Information */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {[
              { 
                icon: <MapPin className="w-6 h-6 text-[#8a704c]" />,
                title: "Our Location",
                content: "Umoja III, Chokmart, Nairobi, Kenya",
                action: "Get Directions →",
                link: "https://maps.app.goo.gl/example"
              },
              { 
                icon: <Mail className="w-6 h-6 text-[#8a704c]" />,
                title: "Email Us",
                content: "info@alcc.org\nprayer@alcc.org",
                action: "Send Email →",
                link: "mailto:info@alcc.org"
              },
              { 
                icon: <Phone className="w-6 h-6 text-[#8a704c]" />,
                title: "Call Us",
                content: "+254 700 123 456\n+254 711 987 654",
                action: "Call Now →",
                link: "tel:+254700123456"
              },
              { 
                icon: <CalendarDays className="w-6 h-6 text-[#8a704c]" />,
                title: "Service Times",
                content: "Sunday: 8:30 AM & 10:30 AM\nWednesday: 6:30 PM (Bible Study)",
                action: "View Details →",
                link: "/services"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full"
                whileHover={{ y: -5 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-3 bg-[#8a704c]/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl mb-3 text-[#1a365d]">{item.title}</h3>
                <p className="text-[#4a5568] mb-4 whitespace-pre-line">{item.content}</p>
                <motion.a
                  href={item.link}
                  whileHover={{ scale: 1.03 }}
                  className="text-[#0d3b66] font-medium text-sm hover:underline"
                >
                  {item.action}
                </motion.a>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              id="contact-form"
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[#1a365d]">
                <Send className="text-[#8a704c]" size={24} />
                Send Us a Message
              </h2>
              
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-[#4a5568] mb-2">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8a704c] focus:border-[#8a704c] transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[#4a5568] mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8a704c] focus:border-[#8a704c] transition"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-[#4a5568] mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8a704c] focus:border-[#8a704c] transition"
                    placeholder="How can we help?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-[#4a5568] mb-2">Your Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8a704c] focus:border-[#8a704c] transition"
                    placeholder="Type your message here..."
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#0d3b66] to-[#1a5e9a] text-white font-bold rounded-lg shadow hover:opacity-90 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
            
            {/* Social Media & Ministries */}
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Social Media */}
              <div className="mb-8">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-[#1a365d]">
                  <div className="bg-[#8a704c]/10 p-2 rounded-lg">
                    <Facebook className="text-[#8a704c]" />
                  </div>
                  Connect With Us
                </h3>
                <div className="flex gap-3">
                  {[
                    { icon: <Facebook className="w-5 h-5" />, url: "https://facebook.com", color: "bg-[#3b5998]", name: "Facebook" },
                    { icon: <Instagram className="w-5 h-5" />, url: "https://instagram.com", color: "bg-[#e4405f]", name: "Instagram" },
                    { icon: <Twitter className="w-5 h-5" />, url: "https://twitter.com", color: "bg-[#1da1f2]", name: "Twitter" },
                    { icon: <Youtube className="w-5 h-5" />, url: "https://youtube.com", color: "bg-[#cd201f]", name: "YouTube" }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${social.color} text-white p-3 rounded-full`}
                      whileHover={{ y: -5, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={social.name}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
                <p className="mt-4 text-[#4a5568] text-sm">
                  Follow us for daily encouragement, live streams, and updates.
                </p>
              </div>

              {/* Ministries Contact */}
              <div>
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-[#1a365d]">
                  <div className="bg-[#8a704c]/10 p-2 rounded-lg">
                    <HeartHandshake className="text-[#8a704c]" size={20} />
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
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <h4 className="font-bold text-[#1a365d] mb-1">{ministry.name}</h4>
                      <a 
                        href={`mailto:${ministry.email}`} 
                        className="text-sm text-[#0d3b66] hover:underline"
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
      <section className="py-12 bg-[#e6eaef]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.h2 
            className="text-3xl font-bold mb-8 text-center text-[#1a365d] font-serif"
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
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-bold mb-3 text-[#8a704c]">{faq.question}</h3>
                <p className="text-[#4a5568]">{faq.answer}</p>
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
              className="inline-block px-6 py-3 bg-[#0d3b66] text-white font-medium rounded-lg shadow text-sm"
              whileHover={{ scale: 1.05 }}
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