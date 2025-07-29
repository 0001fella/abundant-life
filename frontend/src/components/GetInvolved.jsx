// src/components/GetInvolved.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Monitor,
  HeartHandshake,
  BookOpenText,
  Megaphone,
  Calendar,
  ArrowRight,
  ChevronRight,
  Search,
  X,
  Phone,
  User,
  CheckCircle,
} from "lucide-react";

// --- Data Definitions ---
// It's a good practice to move data out of the component file
// for better maintainability. We'll define the data here for this example.
const teamsData = [
  {
    id: "praise-and-worship",
    title: "Praise & Worship Team",
    category: "Worship",
    icon: <Mic />,
    leader: "Finidy George",
    phone: "+254 711 834 206",
    roles: ["Soprano", "Alto", "Tenor", "Lead Vocalist"],
    description: "Lead our congregation in powerful worship experiences. Musical talent and a heart for worship are required.",
    schedule: "Meetings:Fridays 10-12am,Saturdays 5-6:30pm, Sundays 8-10am",
  },
  {
    id: "instrumentalists",
    title: "Instrumentalists Team",
    category: "Worship",
    icon: <Monitor />,
    leader: "Finidy George",
    phone: "+254 711 834 206",
    roles: ["Drums", "Keyboard", "Guitar", "Bass", "Sound Engineer"],
    description: "Provide musical accompaniment and technical support for worship services and special events.",
    schedule: "Rehearsals: Wednesdays 7-9pm, Sundays 8-10am",
  },
  {
    id: "ushering",
    title: "Ushering Department",
    category: "Service",
    icon: <HeartHandshake />,
    leader: "Mary Mayaka",
    phone: "+254 722 555 666",
    roles: ["Welcomer", "Offering Collector", "Seating Assistant"],
    description: "Create a welcoming environment and assist attendees during services. You're the first friendly face people see!",
    schedule: "Service times: Sundays 8am & 10:30am",
  },
  {
    id: "sunday-school",
    title: "Sunday School Teaching",
    category: "Teaching",
    icon: <BookOpenText />,
    leader: "Teacher Joan",
    phone: "+254 733 777 888",
    roles: ["Nursery Teacher", "Primary Teacher", "Teens Mentor"],
    description: "Impact the next generation through biblical teaching and mentorship. A passion for children is a must.",
    schedule: "Sundays 9:30am-12pm, Preparation: Saturdays 10am",
  },
  {
    id: "it-media",
    title: "IT & Media Department",
    category: "Technical",
    icon: <Monitor />,
    leader: "Felix Ochieng",
    phone: "+254 748 427 864",
    roles: ["Livestream Operator", "Web Developer", "Social Media Manager", "Photographer"],
    description: "Support our digital presence and enhance worship experiences through technology and visual storytelling.",
    schedule: "Service times + weekly team meetings",
  },
  {
    id: "evangelism",
    title: "Evangelism Team",
    category: "Outreach",
    icon: <Megaphone />,
    leader: "Pst Dennise",
    phone: "+254 710 168 911",
    roles: ["Door-to-door", "Street Outreach", "Community Events"],
    description: "Share the gospel in our community through various outreach initiatives. Be a light in the darkness.",
    schedule: "Outreach: Saturdays 9am-1pm, Training: Fridays 6pm",
  },
  {
    id: "hospitality",
    title: "Hospitality Team",
    category: "Service",
    icon: <HeartHandshake />,
    leader: "Mum",
    phone: "+254 701 445 864",
    roles: ["Event Planning", "Food Service", "Guest Relations"],
    description: "Create a warm, welcoming environment for church events and newcomers. Your smile makes all the difference.",
    schedule: "As needed for events and services",
  },
  {
    id: "prayer",
    title: "Prayer Ministry",
    category: "Outreach",
    icon: <HeartHandshake />,
    leader: "Samuel Masika",
    phone: "+254 7",
    roles: ["Intercessory Prayer", "Prayer Chain", "Hospital Visits"],
    description: "Lead our church in prayer and intercede for needs within our congregation and community.",
    schedule: "Prayer meetings: Tuesdays 6pm, Sundays 7am",
  },
  {
    id: "home-bible-church",
    title: "Home Bible Church",
    category: "Teaching",
    icon: <BookOpenText />,
    leader: "",
    phone: "",
    roles: ["Host", "Facilitator", "Prayer Leader"],
    description: "Host or participate in intimate home gatherings for Bible study and fellowship.",
    schedule: "Tuesdays 6-8PM at various homes",
  },
  {
    id: "greeters",
    title: "Greeters Ministry",
    category: "Service",
    icon: <HeartHandshake />,
    leader: "",
    phone: "",
    roles: ["Welcome Team", "Information Desk", "Newcomers"],
    description: "Be the first friendly face that welcomes people to our church services.",
    schedule: "Sundays 7:30AM & Special Events",
  },
];

const testimonials = [
  {
    name: "James M.",
    role: "Worship Team Member",
    quote: "Serving on the worship team has deepened my relationship with God and allowed me to use my gifts to bless others.",
  },
  {
    name: "Esther W.",
    role: "Children's Ministry Volunteer",
    quote: "Seeing children grow in their faith has been the most rewarding experience of my life.",
  },
  {
    name: "Peter N.",
    role: "Evangelism Team Leader",
    quote: "Our outreach efforts have transformed not just the community, but our own team members as well.",
  },
];

const benefits = [
  "Develop your spiritual gifts",
  "Build meaningful relationships",
  "Make a difference in people's lives",
  "Grow in your faith journey",
  "Be part of God's work in our community",
];

const teamCategories = [
  { id: "all", label: "All Teams" },
  { id: "worship", label: "Worship" },
  { id: "teaching", label: "Teaching" },
  { id: "outreach", label: "Outreach" },
  { id: "technical", label: "Technical" },
  { id: "service", label: "Service" },
];

// --- Sub-components for better organization ---

const Header = () => (
  <section className="relative py-20 px-4 sm:px-6 text-center overflow-hidden bg-gradient-to-r from-[#0F2D24] to-[#1A3C32]">
    <div className="absolute inset-0 opacity-10 bg-[url('/path/to/texture.svg')]"></div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-w-4xl mx-auto"
    >
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white font-serif"
      >
        Serve With <span className="text-[#D4AF37]">Abundant Life</span>
      </motion.h1>
      <motion.p
        className="max-w-2xl mx-auto text-xl text-gray-200 mb-8"
      >
        Discover your purpose and make an eternal difference through service
      </motion.p>
      <div className="flex justify-center gap-4">
        <motion.a
          href="#teams"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-[#D4AF37] text-[#0F2D24] font-medium rounded-full flex items-center shadow-lg hover:bg-[#C19A30] transition-colors"
        >
          Explore Teams <ChevronRight className="ml-2" />
        </motion.a>
      </div>
    </motion.div>
  </section>
);

const BenefitCard = ({ benefit, index }) => (
  <motion.div
    className="bg-white p-6 rounded-2xl border border-[#D1E0DB] text-center shadow-sm hover:shadow-md transition-shadow"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true }}
  >
    <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
      <HeartHandshake className="text-[#D4AF37]" size={28} />
    </div>
    <h3 className="font-semibold text-lg text-[#0F2D24]">{benefit}</h3>
  </motion.div>
);

const TestimonialCard = ({ testimonial, index }) => (
  <motion.div
    className="bg-white p-6 rounded-xl shadow-lg flex flex-col"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2 }}
    viewport={{ once: true }}
  >
    <p className="italic text-gray-600 mb-4 flex-grow">"{testimonial.quote}"</p>
    <div className="flex items-center gap-4 mt-auto">
      <div className="bg-gray-200 border-2 border-dashed rounded-full w-14 h-14 flex-shrink-0" />
      <div>
        <h3 className="font-bold text-lg text-[#0F2D24]">{testimonial.name}</h3>
        <p className="text-[#7D7D7D]">{testimonial.role}</p>
      </div>
    </div>
  </motion.div>
);

const MinistryTeamCard = ({ team, onClick, joinedTeamId }) => (
  <motion.div
    className="bg-white rounded-xl overflow-hidden shadow-lg border border-[#D1E0DB] cursor-pointer"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    viewport={{ once: true }}
    whileHover={{ y: -5, scale: 1.01, boxShadow: "0 10px 15px rgba(0,0,0,0.05)" }}
    onClick={onClick}
  >
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-[#D4AF37]/10 rounded-xl text-[#0F2D24]">{team.icon}</div>
        <h3 className="text-xl font-bold">{team.title}</h3>
      </div>
      <p className="text-[#2D4A43] mb-6 text-sm">{team.description}</p>
      <div className="flex items-center gap-2 text-sm text-[#5A7C74] mb-4">
        <Calendar className="w-4 h-4 text-[#D4AF37]" />
        <span>{team.schedule}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-[#5A7C74] mb-6">
        <User className="w-4 h-4 text-[#D4AF37]" />
        <span>{team.leader}</span>
      </div>
      {joinedTeamId === team.id ? (
        <button
          disabled
          className="w-full py-3 rounded-lg font-medium bg-green-100 text-green-800 cursor-not-allowed flex items-center justify-center"
        >
          <CheckCircle className="mr-2 w-4 h-4" /> Application Submitted
        </button>
      ) : (
        <button
          className="w-full py-3 rounded-lg font-medium transition flex items-center justify-center bg-[#0F2D24] hover:bg-[#1A3C32] text-white"
        >
          Join This Team <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      )}
    </div>
  </motion.div>
);

const ApplicationModal = ({ selectedTeam, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    phone: "",
    role: "",
    reason: "",
    experience: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Simulate API call
    setTimeout(() => {
      onSubmit({ teamId: selectedTeam.id, ...formData });
      setIsSubmitted(false);
      setIsSuccess(true);
      setTimeout(onClose, 2000); // Close modal after success message
    }, 1500);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-xl max-w-lg w-full shadow-xl relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5A7C74] hover:text-[#0F2D24]"
        >
          <X className="w-6 h-6" />
        </button>
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Thank you!</h3>
            <p className="text-[#5A7C74]">
              Your application for the **{selectedTeam.title}** has been submitted. We'll be in touch soon!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Join {selectedTeam.title}</h3>
              <p className="text-[#5A7C74] text-sm">{selectedTeam.description}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Full Name"
                  required
                  className="w-full p-3 rounded-lg border border-[#C1D7D0] focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required
                  className="w-full p-3 rounded-lg border border-[#C1D7D0] focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-3 rounded-lg border border-[#C1D7D0] focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-3 rounded-lg border border-[#C1D7D0] focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none bg-white"
                >
                  <option value="">Select an Area of Service</option>
                  {selectedTeam.roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Why are you interested in this ministry?"
                required
                rows={3}
                className="w-full p-3 rounded-lg border border-[#C1D7D0] focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
              />
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Share any relevant experience or skills you have."
                rows={2}
                className="w-full p-3 rounded-lg border border-[#C1D7D0] focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg border border-[#C1D7D0] text-[#0F2D24] hover:bg-[#E8F3EF] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitted}
                  className={`px-6 py-2 bg-[#D4AF37] text-[#0F2D24] font-bold rounded-lg transition-colors ${
                    isSubmitted ? "opacity-70 cursor-not-allowed" : "hover:bg-[#C19A30]"
                  }`}
                >
                  {isSubmitted ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

// --- Main GetInvolved Component ---

const GetInvolved = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedTeamId, setJoinedTeamId] = useState(null);

  useEffect(() => {
    const storedTeamId = localStorage.getItem("joinedTeamId");
    if (storedTeamId) {
      setJoinedTeamId(storedTeamId);
    }
  }, []);

  const handleJoinTeam = (team) => {
    if (joinedTeamId !== team.id) {
      setSelectedTeam(team);
    }
  };

  const handleApplicationSubmit = (data) => {
    localStorage.setItem("joinedTeamId", data.teamId);
    setJoinedTeamId(data.teamId);
    setSelectedTeam(null);
  };

  const filteredTeams = teamsData.filter((team) => {
    const matchesCategory = activeFilter === "all" || team.category.toLowerCase() === activeFilter;
    const matchesSearch =
      team.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5F9F7] text-[#0F2D24] font-sans antialiased">
      <Header />

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              className="inline-block mb-4 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full px-4 py-1 text-sm font-medium tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              WHY SERVE?
            </motion.div>
            <motion.h2
              className="text-3xl font-bold mb-6 font-serif"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              The Blessings of Service
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} benefit={benefit} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-[#0F2D24] to-[#1A3C32]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl font-bold mb-6 text-white font-serif"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Stories from Our Servants
            </motion.h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Ministry Teams Section */}
      <section id="teams" className="py-16 px-4 sm:px-6 bg-[#F5F9F7]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              className="inline-block mb-4 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full px-4 py-1 text-sm font-medium tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              OPPORTUNITIES
            </motion.div>
            <motion.h2
              className="text-3xl font-bold mb-4 font-serif"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              Ministry Teams
            </motion.h2>
            <motion.p
              className="text-[#2D4A43] max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Discover where your gifts and talents can serve our church community
            </motion.p>
          </div>

          {/* Filter and Search */}
          <div className="sticky top-0 z-10 bg-[#F5F9F7] py-4 md:py-6 -mx-4 sm:mx-0 px-4 sm:px-6 md:px-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-2 flex-grow">
                {teamCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      activeFilter === category.id
                        ? "bg-[#0F2D24] text-white"
                        : "bg-white text-[#0F2D24] hover:bg-[#E8F3EF]"
                    }`}
                  >
                    {category.label}
                  </motion.button>
                ))}
              </div>
              <div className="relative w-full md:max-w-xs">
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-[#C1D7D0] focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D9C94] w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <AnimatePresence>
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <MinistryTeamCard
                      team={team}
                      onClick={() => handleJoinTeam(team)}
                      joinedTeamId={joinedTeamId}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 col-span-full"
                >
                  <h3 className="text-xl font-medium mb-2">No teams found</h3>
                  <p className="text-[#5A7C74]">Try adjusting your search or filter criteria.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      
      {/* Scripture Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-[#0F2D24] to-[#1A3C32] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <blockquote className="text-2xl md:text-3xl italic mb-6 font-serif">
              "Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace in its various forms."
            </blockquote>
            <p className="text-xl font-medium text-[#D4AF37]">- 1 Peter 4:10</p>
          </motion.div>
        </div>
      </section>

      {/* New Statistics Section */}
      <section className="py-16 px-4 sm:px-6 bg-[#0F2D24] text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 font-serif">Ministry Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-[#1A3C32]/80 rounded-2xl">
              <div className="text-5xl font-bold text-[#D4AF37] mb-2">14+</div>
              <h3 className="text-xl font-bold mb-2">Serving Teams</h3>
              <p>Engaging members in various areas of ministry</p>
            </div>
            <div className="text-center p-6 bg-[#1A3C32]/80 rounded-2xl">
              <div className="text-5xl font-bold text-[#D4AF37] mb-2">420+</div>
              <h3 className="text-xl font-bold mb-2">Active Volunteers</h3>
              <p>Dedicated members serving across all teams</p>
            </div>
            <div className="text-center p-6 bg-[#1A3C32]/80 rounded-2xl">
              <div className="text-5xl font-bold text-[#D4AF37] mb-2">9</div>
              <h3 className="text-xl font-bold mb-2">Weekly Meetings</h3>
              <p>Opportunities to connect and serve throughout the week</p>
            </div>
          </div>
        </div>
      </section>
      
      <AnimatePresence>
        {selectedTeam && (
          <ApplicationModal
            selectedTeam={selectedTeam}
            onClose={() => setSelectedTeam(null)}
            onSubmit={handleApplicationSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GetInvolved;