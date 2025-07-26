import React, { useState, useEffect } from "react";
import { Eye, EyeOff, UserPlus, LogIn, Server, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from 'axios'; // Import axios directly

const Login = () => {
  const navigate = useNavigate();
  const { user, login, signup } = useAuth();
  const [formMode, setFormMode] = useState("login");
  const [formData, setFormData] = useState({ 
    name: "",
    email: "", 
    password: "",
    confirmPassword: "",
    phone: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");
  const [backendStatus, setBackendStatus] = useState(null); // Track backend status

  // Check backend status on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get(
          'https://abundant-life.onrender.com/api/health', 
          { withCredentials: true } // Ensure credentials are sent
        );
        setBackendStatus(response.status === 200 ? 'online' : 'offline');
      } catch (err) {
        setBackendStatus('error');
        console.error('Backend health check failed:', err);
      }
    };

    checkBackend();
  }, []);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "member") {
        navigate("/member/dashboard");
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (formMode === "signup") {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("All fields are required");
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        return false;
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Please enter a valid email address");
        return false;
      }
    } else {
      if (!formData.email || !formData.password) {
        setError("All fields are required");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitted(true);
    setError("");

    try {
      if (formMode === "signup") {
        // Axios call with credentials
        await signup(
          formData.name,
          formData.email,
          formData.password,
          formData.phone
        );
        setWelcomeName(formData.name);
        setSuccessMessage(true);
        setTimeout(() => navigate("/member/dashboard"), 2500);
      } else {
        // Axios call with credentials
        const user = await login(
          formData.email, 
          formData.password,
          { withCredentials: true } // CRITICAL FIX: Add credentials flag
        );
        setWelcomeName(user.name || "Member");
        setSuccessMessage(true);
        setTimeout(() => {
          user.role === "admin" 
            ? navigate("/admin/dashboard") 
            : navigate("/member/dashboard");
        }, 2500);
      }
    } catch (error) {
      let errorMsg = error.message || 
        (formMode === "signup" 
          ? "Failed to create account. Please try again." 
          : "Invalid email or password");
      
      // Enhanced network error handling
      if (error.message.includes('Network Error')) {
        errorMsg = (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-bold">
              <WifiOff className="text-red-500" />
              Network Connection Failed
            </div>
            <div className="mt-2 text-sm">
              <p>• Check your internet connection</p>
              <p>• Verify backend is running at:</p>
              <code className="text-xs block bg-gray-100 p-2 mt-1 rounded">
                https://abundant-life.onrender.com
              </code>
              <p className="mt-2">• Ensure cookies are enabled in your browser</p>
            </div>
          </div>
        );
      }
      
      setError(errorMsg);
    } finally {
      setIsSubmitted(false);
    }
  };

  const handleBackToHome = () => navigate("/");
  const toggleFormMode = () => {
    setFormMode(prev => prev === "login" ? "signup" : "login");
    setError("");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Show loading while redirecting
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a142f] to-[#1a2439]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37]"></div>
          <p className="mt-4 text-white font-medium">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0a142f] to-[#1a2439] flex items-center justify-center p-4 font-sans">
      {/* Backend status indicator */}
      {backendStatus && (
        <div className="absolute top-4 right-4 z-30">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            backendStatus === 'online' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <Server size={16} />
            {backendStatus === 'online' ? 'Backend Online' : 'Backend Unavailable'}
          </div>
        </div>
      )}

      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a142f]/95 to-[#1a2439]/95" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-10" />
      </div>
      
      {/* Floating elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#D4AF37]/10 blur-xl"
        animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-[#D4AF37]/15 blur-xl"
        animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Main container */}
      <motion.div 
        className="w-full max-w-6xl bg-white backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Left side (Form) */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-white to-[#f8f9fa]">
          <div>
            <motion.div 
              className="mb-6 md:mb-8 flex items-center gap-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-gradient-to-r from-[#D4AF37] to-[#C19A30] w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0A142F]">Abundant Life Christian Center</h1>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.h2 
                className="text-2xl sm:text-3xl font-bold text-[#0A142F] mb-2"
                variants={itemVariants}
              >
                {formMode === "login" ? "Welcome Back!" : "Join Our Community"}
              </motion.h2>
              
              <motion.p 
                className="text-[#5a5a5a] text-sm mb-6"
                variants={itemVariants}
              >
                {formMode === "login" 
                  ? "Sign in to continue your spiritual journey" 
                  : "Create an account to access member features"}
              </motion.p>

              {error && (
                <motion.div 
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {formMode === "signup" && (
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-[#0A142F] mb-2">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-[#e2e8f0] bg-white focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all duration-300 pl-12 text-[#0A142F]"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#94a3b8]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-[#0A142F] mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-[#e2e8f0] bg-white focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all duration-300 pl-12 text-[#0A142F]"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#94a3b8]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
                
                {formMode === "signup" && (
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-[#0A142F] mb-2">Phone Number (Optional)</label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+254 700 000 000"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#e2e8f0] bg-white focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all duration-300 pl-12 text-[#0A142F]"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#94a3b8]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-[#0A142F] mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={formMode === "login" ? "Enter your password" : "Create a password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 pr-12 rounded-lg border border-[#e2e8f0] bg-white focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all duration-300 pl-12 text-[#0A142F]"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#94a3b8]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#94a3b8] hover:text-[#D4AF37] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>
                
                {formMode === "signup" && (
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-[#0A142F] mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={8}
                        className="w-full px-4 py-3 pr-12 rounded-lg border border-[#e2e8f0] bg-white focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all duration-300 pl-12 text-[#0A142F]"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#94a3b8]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#94a3b8] hover:text-[#D4AF37] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {formMode === "login" && (
                  <motion.div 
                    className="flex justify-between pt-2"
                    variants={itemVariants}
                  >
                    <div className="flex items-center">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-[#e2e8f0] rounded"
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-[#0A142F]">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm text-[#D4AF37] hover:underline font-medium">
                      Forgot password?
                    </a>
                  </motion.div>
                )}
                
                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitted}
                    className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C19A30] text-[#0A142F] font-bold rounded-lg transition-all shadow-lg hover:shadow-xl relative overflow-hidden disabled:opacity-75"
                  >
                    <AnimatePresence>
                      {isSubmitted ? (
                        <motion.span
                          className="absolute inset-0 flex items-center justify-center bg-[#D4AF37] text-white"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {formMode === "signup" ? "Creating Account..." : "Signing In..."}
                        </motion.span>
                      ) : (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-2"
                        >
                          {formMode === "signup" ? (
                            <>
                              <UserPlus size={20} /> Create Account
                            </>
                          ) : (
                            <>
                              <LogIn size={20} /> Sign In
                            </>
                          )}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>

            {/* Back to Home Button at bottom */}
            <div className="mt-6 flex justify-center">
              <button 
                onClick={handleBackToHome}
                className="flex items-center text-sm text-[#0A142F] hover:text-[#D4AF37] transition-colors font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-between text-sm text-[#64748b] pt-6 gap-2 sm:gap-0">
            <p>
              {formMode === "login" 
                ? "Don't have an account? " 
                : "Already have an account? "}
              <button 
                onClick={toggleFormMode}
                className="text-[#D4AF37] font-medium hover:underline"
              >
                {formMode === "login" ? "Sign Up Now" : "Sign In"}
              </button>
            </p>
            <a href="#" className="text-[#0A142F] hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Right side (Image Area) */}
        <div className="hidden md:flex md:w-1/2 h-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-12 h-12 bg-white rounded-br-[40px] z-10" />
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-white rounded-tr-[40px] z-10" />
          
          <div className="w-full h-full">
            <img 
              src="/child.jpg" 
              alt="Church community" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12 text-white z-10 bg-gradient-to-t from-[#0A142F]/80 via-[#0A142F]/30 to-transparent">
            <motion.div 
              className="max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="bg-[#0A142F]/70 backdrop-blur-sm p-6 rounded-2xl border border-[#D4AF37]/30 shadow-lg">
                <h3 className="text-2xl lg:text-3xl font-bold mb-3 font-serif">
                  {formMode === "login" 
                    ? "Welcome Back to Our Community" 
                    : "Join Our Growing Family"}
                </h3>
                <p className="mb-4 text-lg italic">
                  {formMode === "login" 
                    ? '"Come to me, all you who are weary and burdened, and I will give you rest."' 
                    : '"For where two or three gather in my name, there am I with them."'}
                </p>
                <p className="font-semibold text-[#D4AF37]">
                  {formMode === "login" ? "- Matthew 11:28" : "- Matthew 18:20"}
                </p>
              </div>
              
              <motion.div 
                className="mt-8 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex -space-x-3 mr-4">
                  {[0, 1, 2, 3].map((index) => (
                    <motion.div 
                      key={index}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 border-2 border-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 + (index * 0.1), type: "spring" }}
                    />
                  ))}
                </div>
                <p className="text-sm lg:text-base font-medium">Join 500+ believers in worship</p>
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div 
            className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-[#D4AF37]/30 text-[#0A142F] z-10 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h4 className="font-bold mb-1 text-[#D4AF37]">Cookie Settings</h4>
            <div className="space-y-1 text-xs">
              <p>• <span className="font-medium">SameSite</span>: None</p>
              <p>• <span className="font-medium">Secure</span>: true</p>
              <p>• <span className="font-medium">Domain</span>: alcc-church.com</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#D4AF37]"
            animate={{ y: [0, -10, 0], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M2 12h20" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Success message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-md mx-4 text-center relative z-10"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#D4AF37] to-[#C19A30] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0A142F] mb-2">
                {formMode === "signup" 
                  ? `Welcome to ALCC, ${welcomeName}!`
                  : `Welcome Back, ${welcomeName}!`}
              </h3>
              <p className="mb-6 text-[#5A5A5A]">
                {formMode === "signup" 
                  ? "Your account has been created successfully. Redirecting you..."
                  : "You're being redirected to your dashboard..."}
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D4AF37]"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;