// AdminDashboard.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiUsers, FiCalendar, FiBook, FiDollarSign, FiMail,
  FiSettings, FiMenu, FiBell, FiUser, FiSearch, FiPlus,
  FiDownload, FiEdit2, FiTrash2, FiFile, FiVideo, FiMusic,
  FiBarChart2, FiArrowRight, FiUpload, FiX, FiChevronDown,
  FiLogOut, FiLock, FiMessageSquare, FiImage, FiMapPin, FiGrid, FiLogIn, FiCamera, FiSun, FiMoon, FiDroplet // Fixed typo: Fi droplet -> FiDroplet
} from 'react-icons/fi';
import { TbCloudUpload, TbHistory } from 'react-icons/tb';
import { FaChurch, FaUserShield, FaPrayingHands, FaUserFriends, FaBible } from 'react-icons/fa';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { MdDashboard, MdAnalytics, MdNotificationsActive } from 'react-icons/md';
import { useAuth } from '../context/authContext';
import * as resourcesService from '../services/resourcesService';
import * as membersService from '../services/membersService';
import * as eventsService from '../services/eventsService';
import * as donationsService from '../services/donationsService';
import * as devotionalsService from '../services/devotionalsService';
import * as sermonsService from '../services/sermonsService';
import * as userService from '../services/userService';
import * as authService from '../services/authService';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import Chart from 'react-apexcharts';

// Modal Component
const Modal = ({ onClose, title, children, darkMode }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`relative rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-5 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
            <motion.button
              onClick={onClose}
              className={`p-2 rounded-full hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'} transition-colors`}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <FiX size={24} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            </motion.button>
          </div>
        </div>
        <div className="p-5">
          {children}
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const AdminDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showCreateMemberModal, setShowCreateMemberModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showCreateDevotionalModal, setShowCreateDevotionalModal] = useState(false);
  const [showLoginHistoryModal, setShowLoginHistoryModal] = useState(false);
  const [fileHover, setFileHover] = useState(false);

  // Data states
  const [resources, setResources] = useState([]);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [devotionals, setDevotionals] = useState([]);
  const [sermons, setSermons] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  // Resource upload specific
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFileName, setUploadFileName] = useState('');

  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('service');
  const [eventStatus, setEventStatus] = useState('scheduled');
  const [eventImage, setEventImage] = useState(null);
  const [eventImagePreview, setEventImagePreview] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState({ frequency: 'weekly', interval: 1, endDate: '' });
  const [eventCategory, setEventCategory] = useState('Youths');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberJoinDate, setMemberJoinDate] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationDate, setDonationDate] = useState('');
  const [donationMember, setDonationMember] = useState('');
  const [donationType, setDonationType] = useState('tithe');
  const [donationNotes, setDonationNotes] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profileImage || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [devotionalTitle, setDevotionalTitle] = useState('');
  const [devotionalContent, setDevotionalContent] = useState('');
  const [devotionalDate, setDevotionalDate] = useState('');
  const [devotionalAuthor, setDevotionalAuthor] = useState('Pastor');
  const [devotionalScripture, setDevotionalScripture] = useState('');
  const [selectedDevotional, setSelectedDevotional] = useState(null);

  // UI states
  const [isLoading, setIsLoading] = useState({
    resources: true,
    members: true,
    events: true,
    donations: true,
    devotionals: true,
    loginStats: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [realtimeActivity, setRealtimeActivity] = useState([]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Stats and Chart states
  const [stats, setStats] = useState([
    { id: 1, title: 'Total Members', value: 0, change: '+0', icon: <FiUsers size={24} />, color: 'bg-gradient-to-r from-blue-500 to-indigo-600', gradient: 'bg-gradient-to-r from-blue-500 to-indigo-600', trend: 'up' },
    { id: 2, title: 'Upcoming Events', value: 0, change: '0 this week', icon: <FiCalendar size={24} />, color: 'bg-gradient-to-r from-purple-500 to-pink-600', gradient: 'bg-gradient-to-r from-purple-500 to-pink-600', trend: 'stable' },
    { id: 3, title: 'Recent Donations', value: 'KSh 0', change: '+KSh 0', icon: <FiDollarSign size={24} />, color: 'bg-gradient-to-r from-green-500 to-teal-600', gradient: 'bg-gradient-to-r from-green-500 to-teal-600', trend: 'up' },
    { id: 4, title: 'Sermon Resources', value: 0, change: '0 new', icon: <FiBook size={24} />, color: 'bg-gradient-to-r from-orange-500 to-amber-600', gradient: 'bg-gradient-to-r from-orange-500 to-amber-600', trend: 'up' },
    { id: 5, title: 'Total Logins', value: 0, change: '+0 today', icon: <FiLock size={24} />, color: 'bg-gradient-to-r from-blue-500 to-indigo-600', gradient: 'bg-gradient-to-r from-blue-500 to-indigo-600', trend: 'up' },
    { id: 6, title: 'Active Now', value: 0, change: '0 online', icon: <FiUser size={24} />, color: 'bg-gradient-to-r from-gray-500 to-gray-600', gradient: 'bg-gradient-to-r from-gray-500 to-gray-600', trend: 'stable' }
  ]);
  const [chartData, setChartData] = useState({ labels: [], values: [] });

  // Refs
  const userDropdownRef = useRef(null);

  // Format currency helper
  const formatCurrency = useCallback((amount) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return 'KSh 0';
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(numAmount);
  }, []);

  // --- Service Calls and Data Fetching ---

  const fetchLoginHistory = async () => {
    try {
      const history = await authService.getLoginHistory();
      setLoginHistory(Array.isArray(history) ? history : []);
    } catch (error) {
      console.error("Failed to load login history:", error);
    }
  };

  const fetchLoginStats = useCallback(async () => {
    try {
      setIsLoading(prev => ({ ...prev, loginStats: true }));
      const stats = await authService.getLoginStats();

      if (stats && stats.monthlyDonations) {
        const monthlyDonations = stats.monthlyDonations.map(m => m.total || 0);
        setChartData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          values: monthlyDonations
        });
      } else {
        console.warn("Login stats did not contain monthlyDonations or were undefined:", stats);
        setChartData({ labels: [], values: [] });
      }
      setError(null);
    } catch (error) {
      console.error("Failed to load login stats:", error);
      setChartData({ labels: [], values: [] });
      if (error.isAxiosError) {
        toast.error('Failed to load login stats.');
      }
    } finally {
      setIsLoading(prev => ({ ...prev, loginStats: false }));
    }
  }, []);

  useEffect(() => {
    setStats(prevStats => [
      {
        ...prevStats[0],
        value: Array.isArray(members) ? members.length : 0,
        change: `+${Array.isArray(members) ? members.filter(m => new Date(m.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length : 0}`
      },
      {
        ...prevStats[1],
        value: Array.isArray(events) ? events.filter(e => new Date(e.date) > new Date()).length : 0,
        change: `+${Array.isArray(events) ? events.filter(e => new Date(e.date) > new Date() && new Date(e.date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length : 0}`
      },
      {
        ...prevStats[2],
        value: Array.isArray(donations) ? formatCurrency(donations.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)) : 'KSh 0',
        change: `+${Array.isArray(donations) ? formatCurrency(donations.filter(d => new Date(d.date || d.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)) : 'KSh 0'}`
      },
      {
        ...prevStats[3],
        value: Array.isArray(resources) ? resources.length : 0,
        change: `+${Array.isArray(resources) ? resources.filter(r => new Date(r.uploadDate || r.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length : 0}`
      },
      {
        ...prevStats[4], // Assuming login stats are handled elsewhere or part of auth context
        value: 0,
        change: '+0 today'
      },
      {
        ...prevStats[5], // Active now - placeholder
        value: 0,
        change: '0 online'
      }
    ]);
  }, [members, events, donations, resources, formatCurrency]);

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading({
        resources: true,
        members: true,
        events: true,
        donations: true,
        devotionals: true,
        loginStats: true
      });

      const results = await Promise.allSettled([
        api.get('/resources').then(res => res.data).catch(err => { console.error("Resources fetch error:", err); throw err; }),
        membersService.getMembers().catch(err => { console.error("Members fetch error:", err); throw err; }),
        eventsService.getEvents().catch(err => { console.error("Events fetch error:", err); throw err; }),
        donationsService.getDonations().catch(err => { console.error("Donations fetch error:", err); throw err; }),
        devotionalsService.getDevotionals().catch(err => { console.error("Devotionals fetch error:", err); throw err; })
      ]);

      const [resourcesResult, membersResult, eventsResult, donationsResult, devotionalsResult] = results;

      if (resourcesResult.status === 'fulfilled') {
        setResources(Array.isArray(resourcesResult.value) ? resourcesResult.value : []);
      } else {
        setResources([]);
      }

      if (membersResult.status === 'fulfilled') {
        setMembers(Array.isArray(membersResult.value) ? membersResult.value : []);
      } else {
        setMembers([]);
      }

      if (eventsResult.status === 'fulfilled') {
        setEvents(Array.isArray(eventsResult.value) ? eventsResult.value : []);
      } else {
        setEvents([]);
      }

      if (donationsResult.status === 'fulfilled') {
        setDonations(Array.isArray(donationsResult.value) ? donationsResult.value : []);
      } else {
        setDonations([]);
      }

      if (devotionalsResult.status === 'fulfilled') {
        setDevotionals(Array.isArray(devotionalsResult.value) ? devotionalsResult.value : []);
      } else {
        setDevotionals([]);
      }

      await fetchLoginStats();
      await fetchLoginHistory();

      setError(null);
    } catch (error) {
      setError(error);
      console.error("Critical error in fetchAllData:", error);
      toast.error("Failed to load dashboard data. Please refresh.");
    } finally {
      setIsLoading({
        resources: false,
        members: false,
        events: false,
        donations: false,
        devotionals: false,
        loginStats: false
      });
    }
  }, [fetchLoginStats]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        await fetchAllData();
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Data fetch error:", error);
        }
      }
    };

    fetchData();

    const activityInterval = setInterval(() => {
      const newActivity = [
        {
          id: Date.now() + 1,
          user: 'John Doe',
          action: 'joined the church',
          time: 'Just now',
          icon: <FiUser size={18} />,
          iconBg: 'bg-blue-500/20 text-blue-500'
        },
        {
          id: Date.now() + 2,
          user: 'Sarah Johnson',
          action: 'donated KSh 10,000',
          time: '2 mins ago',
          icon: <FiDollarSign size={18} />,
          iconBg: 'bg-green-500/20 text-green-500'
        },
        {
          id: Date.now() + 3,
          user: 'Pastor Mike',
          action: 'scheduled new event',
          time: '5 mins ago',
          icon: <FiCalendar size={18} />,
          iconBg: 'bg-purple-500/20 text-purple-500'
        }
      ];
      setRealtimeActivity(prev => {
        const updated = [...newActivity, ...prev.slice(0, 2)];
        return updated.slice(0, 5);
      });
    }, 15000);

    return () => {
      abortController.abort();
      clearInterval(activityInterval);
    };
  }, [fetchAllData]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: 'New Member Registered',
        message: 'Sarah Johnson has just registered as a new member',
        timestamp: '2 mins ago',
        read: false,
        icon: <HiOutlineUserGroup className="text-blue-500" size={20} />
      },
      {
        id: 2,
        title: 'Upcoming Event',
        message: 'Bible Study is scheduled for tomorrow at 7pm',
        timestamp: '1 hour ago',
        read: false,
        icon: <FiCalendar className="text-purple-500" size={20} />
      },
      {
        id: 3,
        title: 'Donation Received',
        message: 'You have received a new donation of KSh 5,000',
        timestamp: '4 hours ago',
        read: true,
        icon: <FiDollarSign className="text-green-500" size={20} />
      }
    ];
    setNotifications(mockNotifications);
    setUnreadNotifications(mockNotifications.filter(n => !n.read).length);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadNotifications(0);
  };

  const donationChartOptions = {
    chart: {
      id: 'donation-analytics',
      toolbar: { show: false },
      foreColor: darkMode ? '#E2E8F0' : '#4A5568'
    },
    xaxis: {
      categories: chartData.labels.length > 0 ? chartData.labels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    colors: ['#4F46E5'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['#818CF8'],
        shadeIntensity: 1,
        type: 'vertical',
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 100]
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    grid: {
      borderColor: darkMode ? '#374151' : '#E2E8F0',
      strokeDashArray: 4
    },
    tooltip: {
      theme: darkMode ? 'dark' : 'light',
      y: {
        formatter: function (val) {
          return formatCurrency(val);
        }
      }
    }
  };

  const donationChartSeries = [{ name: 'Donations', data: chartData.values }];

  const renderEventTypeBadge = (type) => {
    const typeConfig = {
      service: { label: 'Worship Service', color: 'bg-blue-500/20 text-blue-500' },
      bible: { label: 'Bible Study', color: 'bg-purple-500/20 text-purple-500' },
      prayer: { label: 'Prayer Meeting', color: 'bg-green-500/20 text-green-500' },
      youth: { label: 'Youth Event', color: 'bg-yellow-500/20 text-yellow-500' },
      community: { label: 'Community', color: 'bg-red-500/20 text-red-500' },
      other: { label: 'Other', color: 'bg-gray-500/20 text-gray-500' }
    };
    const config = typeConfig[type] || typeConfig.other;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResourceFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadFileName(file.name);
    }
  };

  const handleResourceUpload = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!title || !uploadFile) {
      toast.error('Title and file are required');
      setIsSubmitting(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('file', uploadFile);

      const newResource = await resourcesService.uploadResource(formData);
      setResources(prev => [newResource, ...prev]);
      setShowUploadModal(false);
      toast.success('Resource uploaded successfully');
      setTitle('');
      setDescription('');
      setUploadFile(null);
      setUploadFileName('');
    } catch (error) {
      console.error("Resource upload error:", error);
      if (error.isAxiosError && (error.response?.status === 401 || error.response?.status === 403)) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login", { state: { from: location }, replace: true });
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
        toast.error(`Upload failed: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditResourceSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!title) {
      toast.error('Title is required');
      setIsSubmitting(false);
      return;
    }
    try {
      const updatedResource = await resourcesService.updateResource(selectedResource._id, {
        title: title.trim(),
        description: description.trim()
      });
      setResources(prev => prev.map(resource =>
        resource._id === selectedResource._id ? updatedResource : resource
      ));
      setShowEditModal(false);
      toast.success('Resource updated successfully');
    } catch (error) {
      console.error("Resource update error:", error);
      if (error.isAxiosError && (error.response?.status === 401 || error.response?.status === 403)) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login", { state: { from: location }, replace: true });
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Update failed';
        toast.error(`Update failed: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!eventTitle || !eventDate || !eventCategory) {
      toast.error('Title, date and category are required');
      setIsSubmitting(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', eventTitle.trim());
      formData.append('date', eventDate);
      formData.append('location', eventLocation.trim());
      formData.append('description', eventDescription.trim());
      formData.append('type', eventType);
      formData.append('status', eventStatus);
      formData.append('category', eventCategory);
      if (eventImage) formData.append('image', eventImage);

      let result;
      if (selectedEvent) {
        result = await eventsService.updateEvent(selectedEvent._id, formData);
        setEvents(prev => prev.map(event =>
          event._id === selectedEvent._id ? result : event
        ));
        toast.success('Event updated successfully');
      } else {
        result = await eventsService.createEvent(formData);
        setEvents(prev => [result, ...prev]);
        toast.success('Event created successfully');
      }
      setShowCreateEventModal(false);
      setEventTitle('');
      setEventDate('');
      setEventLocation('');
      setEventDescription('');
      setEventType('service');
      setEventStatus('scheduled');
      setEventImage(null);
      setEventImagePreview('');
      setIsRecurring(false);
      setRecurrence({ frequency: 'weekly', interval: 1, endDate: '' });
      setEventCategory('Youths');
      setSelectedEvent(null);
    } catch (error) {
      console.error("Event operation error:", error);
      if (error.isAxiosError && (error.response?.status === 401 || error.response?.status === 403)) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login", { state: { from: location }, replace: true });
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Event operation failed';
        toast.error(`Event operation failed: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!memberName || !memberEmail) {
      toast.error('Name and email are required');
      setIsSubmitting(false);
      return;
    }
    try {
      const memberData = {
        name: memberName.trim(),
        email: memberEmail.trim(),
        phone: memberPhone.trim(),
        joinDate: memberJoinDate
      };
      if (selectedMember) {
        const updatedMember = await membersService.updateMember(selectedMember._id, memberData);
        setMembers(prev => prev.map(member =>
          member._id === selectedMember._id ? updatedMember : member
        ));
        toast.success('Member updated successfully');
      } else {
        const newMember = await membersService.createMember(memberData);
        setMembers(prev => [newMember, ...prev]);
        toast.success('Member added successfully');
      }
      setShowCreateMemberModal(false);
      setMemberName('');
      setMemberEmail('');
      setMemberPhone('');
      setMemberJoinDate('');
      setSelectedMember(null);
    } catch (error) {
      console.error("Member operation error:", error);
      if (error.isAxiosError && (error.response?.status === 401 || error.response?.status === 403)) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login", { state: { from: location }, replace: true });
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Member operation failed';
        toast.error(`Member operation failed: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!donationAmount || !donationDate) {
      toast.error('Amount and date are required');
      setIsSubmitting(false);
      return;
    }
    try {
      const donationData = {
        name: donationMember.trim() || 'Anonymous',
        amount: parseFloat(donationAmount),
        method: donationType,
        date: donationDate,
        notes: donationNotes.trim()
      };

      let result;
      if (selectedDonation) {
        result = await donationsService.updateDonation(selectedDonation._id, donationData);
        setDonations(prev => prev.map(donation =>
          donation._id === selectedDonation._id ? result : donation
        ));
        toast.success('Donation updated successfully');
      } else {
        result = await donationsService.createDonation(donationData);
        setDonations(prev => [result, ...prev]);
        toast.success('Donation recorded successfully');
      }
      setShowDonationModal(false);
      setDonationAmount('');
      setDonationDate('');
      setDonationMember('');
      setDonationType('tithe');
      setDonationNotes('');
      setSelectedDonation(null);
    } catch (error) {
      console.error("Donation operation error:", error);
      if (error.isAxiosError && (error.response?.status === 401 || error.response?.status === 403)) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login", { state: { from: location }, replace: true });
      } else {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Donation operation failed';
        toast.error(`Donation operation failed: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      setIsSubmitting(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', profileName.trim());
      formData.append('email', profileEmail.trim());
      if (profileImage) formData.append('profileImage', profileImage);
      if (currentPassword && newPassword) {
        formData.append('currentPassword', currentPassword);
        formData.append('newPassword', newPassword);
      }
      const updatedUser = await userService.updateProfile(user._id, formData);
      updateUser(updatedUser);
      setShowProfileModal(false);
      toast.success('Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Profile update error:", error);
      if (error.isAxiosError && (error.response?.status === 401 || error.response?.status === 403)) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login", { state: { from: location }, replace: true });
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
        toast.error(`Profile update failed: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDevotionalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!devotionalTitle || !devotionalContent || !devotionalDate || !devotionalScripture) {
      toast.error('Title, content, scripture, and date are required');
      setIsSubmitting(false);
      return;
    }
    try {
      const devotionalData = {
        title: devotionalTitle.trim(),
        snippet: devotionalContent.trim(),
        scripture: devotionalScripture.trim(),
        date: devotionalDate,
        author: devotionalAuthor.trim()
      };

      let result;
      if (selectedDevotional) {
        result = await devotionalsService.updateDevotional(selectedDevotional._id, devotionalData);
        setDevotionals(prev => prev.map(devotional =>
          devotional._id === selectedDevotional._id ? result : devotional
        ));
        toast.success('Devotional updated successfully');
      } else {
        result = await devotionalsService.createDevotional(devotionalData);
        setDevotionals(prev => [result, ...prev]);
        toast.success('Devotional created successfully');
      }
      setShowCreateDevotionalModal(false);
      setDevotionalTitle('');
      setDevotionalContent('');
      setDevotionalDate('');
      setDevotionalAuthor('Pastor');
      setDevotionalScripture('');
      setSelectedDevotional(null);
    } catch (error) {
      console.error("Devotional operation error:", error);
      if (error.isAxiosError && (error.response?.status === 401 || error.response?.status === 403)) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login", { state: { from: location }, replace: true });
      } else {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Devotional operation failed';
        toast.error(`Devotional operation failed: ${errorMessage}`);
        if (error.response?.data?.details) {
          console.error("Devotional error details:", error.response.data.details);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourcesService.deleteResource(id);
        setResources(prev => prev.filter(item => item._id !== id));
        toast.success('Resource deleted successfully');
      } catch (error) {
        console.error("Resource deletion error:", error);
        if (error.isAxiosError && (error.response?.status === 401 || error.response?.status === 403)) {
          toast.error("Session expired. Please log in again.");
          logout();
          navigate("/login", { state: { from: location }, replace: true });
        } else {
          const errorMessage = error.response?.data?.message || error.message || 'Deletion failed';
          toast.error(`Deletion failed: ${errorMessage}`);
        }
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsService.deleteEvent(id);
        setEvents(prev => prev.filter(item => item._id !== id));
        toast.success('Event deleted successfully');
      } catch (error) {
        console.error("Event deletion error:", error);
        if (error.isAxiosError && (error.response?.status === 401 || error.response?.status === 403)) {
          toast.error("Session expired. Please log in again.");
          logout();
          navigate("/login", { state: { from: location }, replace: true });
        } else {
          const errorMessage = error.response?.data?.message || error.message || 'Deletion failed';
          toast.error(`Deletion failed: ${errorMessage}`);
        }
      }
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await membersService.deleteMember(id);
        setMembers(prev => prev.filter(item => item._id !== id));
        toast.success('Member deleted successfully');
      } catch (error) {
        console.error("Member deletion error:", error);
        if (error.isAxiosError && (error.response?.status === 401 || error.response?.status === 403)) {
          toast.error("Session expired. Please log in again.");
          logout();
          navigate("/login", { state: { from: location }, replace: true });
        } else {
          const errorMessage = error.response?.data?.message || error.message || 'Deletion failed';
          toast.error(`Deletion failed: ${errorMessage}`);
        }
      }
    }
  };

  const handleDeleteDonation = async (id) => {
    if (window.confirm('Are you sure you want to delete this donation record?')) {
      try {
        await donationsService.deleteDonation(id);
        setDonations(prev => prev.filter(item => item._id !== id));
        toast.success('Donation deleted successfully');
      } catch (error) {
        console.error("Donation deletion error:", error);
        if (error.isAxiosError && (error.response?.status === 401 || error.response?.status === 403)) {
          toast.error("Session expired. Please log in again.");
          logout();
          navigate("/login", { state: { from: location }, replace: true });
        } else {
          const errorMessage = error.response?.data?.message || error.message || 'Deletion failed';
          toast.error(`Deletion failed: ${errorMessage}`);
        }
      }
    }
  };

  const handleDeleteDevotional = async (id) => {
    if (window.confirm('Are you sure you want to delete this devotional?')) {
      try {
        await devotionalsService.deleteDevotional(id);
        setDevotionals(prev => prev.filter(item => item._id !== id));
        toast.success('Devotional deleted successfully');
      } catch (error) {
        console.error("Devotional deletion error:", error);
        if (error.isAxiosError && (error.response?.status === 401 || error.response?.status === 403)) {
          toast.error("Session expired. Please log in again.");
          logout();
          navigate("/login", { state: { from: location }, replace: true });
        } else {
          const errorMessage = error.response?.data?.message || error.message || 'Deletion failed';
          toast.error(`Deletion failed: ${errorMessage}`);
        }
      }
    }
  };

  const renderTabContent = () => {
    if (error && !isLoading.resources && !isLoading.members && !isLoading.events && !isLoading.donations && !isLoading.devotionals) {
      return (
        <div className="p-6 bg-red-100/10 border border-red-400/30 rounded-xl">
          <h2 className="text-xl font-bold mb-2 text-red-400">Error Loading Data</h2>
          <p className="mb-4">{error.message}</p>
          <button
            onClick={fetchAllData}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg"
          >
            Retry
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="mb-8">
              <motion.h1
                className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Dashboard
              </motion.h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Welcome back, <span className="font-semibold text-blue-400">{user?.name}</span>! Here's what's happening today.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {stats.map((stat) => (
                <motion.div
                  key={stat.id}
                  className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm`}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div
                className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Donation Analytics</h3>
                  <button className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                    View Report
                  </button>
                </div>
                {isLoading.loginStats ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : chartData.values.some(v => v > 0) ? (
                  <Chart
                    options={donationChartOptions}
                    series={donationChartSeries}
                    type="area"
                    height={300}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No donation data available</p>
                  </div>
                )}
              </motion.div>

              <motion.div
                className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className={`font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
                <div className="space-y-4">
                  {realtimeActivity.length > 0 ? (
                    realtimeActivity.map(activity => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${activity.iconBg}`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {activity.user} <span className="font-normal">{activity.action}</span>
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{activity.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No recent activity</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="mb-8">
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.button
                  onClick={() => setShowCreateEventModal(true)}
                  className={`p-4 rounded-lg flex flex-col items-center gap-2 ${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiCalendar className={`text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Create Event</span>
                </motion.button>
                <motion.button
                  onClick={() => setShowCreateMemberModal(true)}
                  className={`p-4 rounded-lg flex flex-col items-center gap-2 ${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiUser className={`text-xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Add Member</span>
                </motion.button>
                <motion.button
                  onClick={() => setShowDonationModal(true)}
                  className={`p-4 rounded-lg flex flex-col items-center gap-2 ${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiDollarSign className={`text-xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Record Donation</span>
                </motion.button>
                <motion.button
                  onClick={() => setShowCreateDevotionalModal(true)}
                  className={`p-4 rounded-lg flex flex-col items-center gap-2 ${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPrayingHands className={`text-xl ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Add Devotional</span>
                </motion.button>
              </div>
            </div>
          </>
        );
      case 'members':
        return (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Members</h2>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage church members</p>
              </div>
              <motion.button
                onClick={() => setShowCreateMemberModal(true)}
                className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlus size={18} />
                Add Member
              </motion.button>
            </div>

            {isLoading.members ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className={`rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className={`border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {Array.isArray(members) && members.length > 0 ? members.map(member => (
                        <motion.tr
                          key={member._id}
                          className={`hover:${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                {member.name?.charAt(0) || 'M'}
                              </div>
                              <div className="ml-4">
                                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{member.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{member.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{member.phone || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                              {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedMember(member);
                                setMemberName(member.name);
                                setMemberEmail(member.email);
                                setMemberPhone(member.phone || '');
                                setMemberJoinDate(member.joinDate || '');
                                setShowCreateMemberModal(true);
                              }}
                              className={`mr-3 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member._id)}
                              className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-sm">
                            No members found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      case 'events':
        return (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Events</h2>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage church events</p>
              </div>
              <motion.button
                onClick={() => setShowCreateEventModal(true)}
                className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlus size={18} />
                Create Event
              </motion.button>
            </div>

            {isLoading.events ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(events) && events.length > 0 ? events.map(event => (
                  <motion.div
                    key={event._id}
                    className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm`}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {event.image && (
                      <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.status === 'scheduled' ? 'bg-blue-500/20 text-blue-500' :
                          event.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                            'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {event.status}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-500`}>
                        {event.category}
                      </span>
                    </div>
                    <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{event.title}</h3>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{event.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <FiCalendar className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <FiMapPin className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{event.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setEventTitle(event.title);
                          setEventDate(event.date.split('T')[0]);
                          setEventLocation(event.location || '');
                          setEventDescription(event.description || '');
                          setEventType(event.type || 'service');
                          setEventStatus(event.status || 'scheduled');
                          setEventCategory(event.category || 'Youths');
                          setShowCreateEventModal(true);
                        }}
                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <FiEdit2 size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <FiTrash2 size={16} className={darkMode ? 'text-red-400' : 'text-red-600'} />
                      </button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <FiCalendar size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No events scheduled</h3>
                    <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Get started by creating a new event.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'resources':
        return (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Resources</h2>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage church resources</p>
              </div>
              <motion.button
                onClick={() => setShowUploadModal(true)}
                className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiUpload size={18} />
                Upload Resource
              </motion.button>
            </div>

            {isLoading.resources ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(resources) && resources.length > 0 ? resources.map(resource => (
                  <motion.div
                    key={resource._id}
                    className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm`}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-lg ${
                        resource.type === 'document' ? 'bg-blue-500/20 text-blue-500' :
                          resource.type === 'video' ? 'bg-red-500/20 text-red-500' :
                            'bg-green-500/20 text-green-500'
                      }`}>
                        {resource.type === 'document' ? <FiFile size={24} /> :
                          resource.type === 'video' ? <FiVideo size={24} /> :
                            <FiMusic size={24} />}
                      </div>
                      <div>
                        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{resource.title}</h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {resource.uploadDate ? new Date(resource.uploadDate).toLocaleDateString() : (resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : 'N/A')}
                        </p>
                      </div>
                    </div>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {resource.description || 'No description provided'}
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedResource(resource);
                          setTitle(resource.title);
                          setDescription(resource.description || '');
                          setShowEditModal(true);
                        }}
                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <FiEdit2 size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                      </button>
                      <button
                        onClick={() => handleDeleteResource(resource._id)}
                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <FiTrash2 size={16} className={darkMode ? 'text-red-400' : 'text-red-600'} />
                      </button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <FiBook size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No resources found</h3>
                    <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Get started by uploading a new resource.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'donations':
        return (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Donations</h2>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Track and manage donations</p>
              </div>
              <motion.button
                onClick={() => setShowDonationModal(true)}
                className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiDollarSign size={18} />
                Record Donation
              </motion.button>
            </div>

            {isLoading.donations ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className={`rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className={`border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Member</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Notes</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {Array.isArray(donations) && donations.length > 0 ? donations.map(donation => (
                        <motion.tr
                          key={donation._id}
                          className={`hover:${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {donation.name || 'Anonymous'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                              {formatCurrency(donation.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                              {donation.date ? new Date(donation.date).toLocaleDateString() : (donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : 'N/A')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              donation.method === 'tithe' ? 'bg-blue-500/20 text-blue-500' :
                                donation.method === 'offering' ? 'bg-green-500/20 text-green-500' :
                                  'bg-purple-500/20 text-purple-500'
                            }`}>
                              {donation.method || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {donation.notes || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedDonation(donation);
                                setDonationAmount(donation.amount);
                                setDonationDate(donation.date ? donation.date.split('T')[0] : (donation.createdAt ? donation.createdAt.split('T')[0] : ''));
                                setDonationMember(donation.name || '');
                                setDonationType(donation.method || 'tithe');
                                setDonationNotes(donation.notes || '');
                                setShowDonationModal(true);
                              }}
                              className={`mr-3 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteDonation(donation._id)}
                              className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      )) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-sm">
                            No donations recorded
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      case 'devotionals':
        return (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Devotionals</h2>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage daily devotionals</p>
              </div>
              <motion.button
                onClick={() => setShowCreateDevotionalModal(true)}
                className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPrayingHands size={18} />
                Add Devotional
              </motion.button>
            </div>

            {isLoading.devotionals ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(devotionals) && devotionals.length > 0 ? devotionals.map(devotional => (
                  <motion.div
                    key={devotional._id}
                    className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm`}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{devotional.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                        {devotional.date ? new Date(devotional.date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <strong>Scripture:</strong> {devotional.scripture}
                    </p>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {devotional.snippet?.substring(0, 100) + '...'}
                    </p>
                    <p className={`text-xs mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      <strong>Author:</strong> {devotional.author || 'N/A'}
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedDevotional(devotional);
                          setDevotionalTitle(devotional.title);
                          setDevotionalContent(devotional.snippet);
                          setDevotionalDate(devotional.date ? devotional.date.split('T')[0] : '');
                          setDevotionalAuthor(devotional.author || 'Pastor');
                          setDevotionalScripture(devotional.scripture || '');
                          setShowCreateDevotionalModal(true);
                        }}
                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <FiEdit2 size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                      </button>
                      <button
                        onClick={() => handleDeleteDevotional(devotional._id)}
                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <FiTrash2 size={16} className={darkMode ? 'text-red-400' : 'text-red-600'} />
                      </button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <FaPrayingHands size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No devotionals found</h3>
                    <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Get started by adding a new devotional.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Select a tab to view content</p>
          </div>
        );
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <AnimatePresence>
        {(sidebarOpen || mobileMenuOpen) && (
          <>
            {mobileMenuOpen && (
              <motion.div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
              />
            )}
            <motion.div
              className={`fixed lg:static inset-y-0 left-0 z-50 w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-white/10' : 'border-gray-200'} flex flex-col lg:translate-x-0 transform transition-transform duration-300 ease-in-out`}
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              exit={{ x: -100 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FaChurch className="text-blue-500" size={24} />
                  <span className="text-xl font-bold">ChurchAdmin</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="md:hidden text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-1">
                  <motion.button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-500/20 text-blue-500' : 'hover:bg-white/5'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MdDashboard size={20} />
                    <span>Dashboard</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setActiveTab('members')}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'members' ? 'bg-blue-500/20 text-blue-500' : 'hover:bg-white/5'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaUserFriends size={20} />
                    <span>Members</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setActiveTab('events')}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'events' ? 'bg-blue-500/20 text-blue-500' : 'hover:bg-white/5'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiCalendar size={20} />
                    <span>Events</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setActiveTab('resources')}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'resources' ? 'bg-blue-500/20 text-blue-500' : 'hover:bg-white/5'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiBook size={20} />
                    <span>Resources</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setActiveTab('donations')}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'donations' ? 'bg-blue-500/20 text-blue-500' : 'hover:bg-white/5'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiDollarSign size={20} />
                    <span>Donations</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setActiveTab('devotionals')}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'devotionals' ? 'bg-blue-500/20 text-blue-500' : 'hover:bg-white/5'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPrayingHands size={20} />
                    <span>Devotionals</span>
                  </motion.button>
                </nav>
              </div>
              <div className={`p-4 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors hover:bg-red-500/10 text-red-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiLogOut size={20} />
                  <span>Logout</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className={`p-4 md:p-5 flex items-center justify-between z-10 ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <FiMenu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold hidden md:block">
                {activeTab === 'dashboard' ? 'Dashboard' :
                  activeTab === 'members' ? 'Members' :
                    activeTab === 'events' ? 'Events' :
                      activeTab === 'resources' ? 'Resources' :
                        activeTab === 'donations' ? 'Donations' :
                          activeTab === 'devotionals' ? 'Devotionals' : ''}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="Search..."
                className={`pl-10 pr-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${darkMode ? 'border-white/10' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <motion.button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </motion.button>
            <div className="relative" ref={userDropdownRef}>
              <motion.button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border-2 border-blue-500/30"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                )}
                <div className="hidden md:block">
                  <span className="font-medium">{user?.name || 'Admin'}</span>
                  <span className="text-xs opacity-75 block">Administrator</span>
                </div>
                <FiChevronDown className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} z-50`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowProfileModal(true);
                          setUserDropdownOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full text-left px-4 py-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <FiUser size={16} />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowLoginHistoryModal(true);
                          setUserDropdownOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full text-left px-4 py-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <TbHistory size={16} />
                        Login History
                      </button>
                      <button
                        onClick={handleLogout}
                        className={`flex items-center gap-2 w-full text-left px-4 py-2 ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}
                      >
                        <FiLogOut size={16} />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showUploadModal && (
          <Modal
            onClose={() => {
              setTitle('');
              setDescription('');
              setUploadFile(null);
              setUploadFileName('');
              setShowUploadModal(false);
            }}
            title="Upload New Resource"
            darkMode={darkMode}
          >
            <form onSubmit={handleResourceUpload}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter resource title"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter resource description"
                    rows="3"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    File *
                  </label>
                  <div
                    className={`flex items-center justify-center w-full ${darkMode ? 'bg-gray-700 border-white/10' : 'bg-gray-50 border-gray-300'} border-2 border-dashed rounded-lg cursor-pointer hover:opacity-80 transition-opacity`}
                    onDragOver={(e) => { e.preventDefault(); setFileHover(true); }}
                    onDragLeave={() => setFileHover(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setFileHover(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleResourceFileChange({ target: { files: e.dataTransfer.files } });
                      }
                    }}
                  >
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <TbCloudUpload className={`w-8 h-8 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PDF, DOC, MP4, MP3 (MAX. 10MB)</p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handleResourceFileChange}
                        required={!uploadFile}
                      />
                    </label>
                  </div>
                  {uploadFileName && (
                    <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Selected file: <span className="font-medium">{uploadFileName}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  type="button"
                  onClick={() => {
                    setTitle('');
                    setDescription('');
                    setUploadFile(null);
                    setUploadFileName('');
                    setShowUploadModal(false);
                  }}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200'} transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FiUpload size={18} />
                      Upload Resource
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </Modal>
        )}

        {showEditModal && (
          <Modal
            onClose={() => {
              setTitle('');
              setDescription('');
              setSelectedResource(null);
              setShowEditModal(false);
            }}
            title="Edit Resource"
            darkMode={darkMode}
          >
            <form onSubmit={handleEditResourceSubmit}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter resource title"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter resource description"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  type="button"
                  onClick={() => {
                    setTitle('');
                    setDescription('');
                    setSelectedResource(null);
                    setShowEditModal(false);
                  }}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200'} transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiEdit2 size={18} />
                      Update Resource
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </Modal>
        )}

        {showProfileModal && (
          <Modal
            onClose={() => setShowProfileModal(false)}
            title="Your Profile"
            darkMode={darkMode}
          >
            <form onSubmit={handleProfileSubmit}>
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <motion.div
                    className="relative mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={profileImagePreview || user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=random`}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-4 border-blue-500/30"
                    />
                    <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <FiEdit2 size={16} />
                      <input
                        type="file"
                        id="profile-image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                      />
                    </label>
                  </motion.div>
                  <div className="w-full">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="w-full">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <h3 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Change Password</h3>
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200'} transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiUser size={18} />
                      Update Profile
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </Modal>
        )}

        {showCreateEventModal && (
          <Modal
            onClose={() => {
              setShowCreateEventModal(false);
              setEventTitle('');
              setEventDate('');
              setEventLocation('');
              setEventDescription('');
              setEventType('service');
              setEventStatus('scheduled');
              setEventImage(null);
              setEventImagePreview('');
              setIsRecurring(false);
              setRecurrence({ frequency: 'weekly', interval: 1, endDate: '' });
              setEventCategory('Youths');
              setSelectedEvent(null);
            }}
            title={selectedEvent ? 'Edit Event' : 'Create New Event'}
            darkMode={darkMode}
          >
            <form onSubmit={handleEventSubmit}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter event title"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Date *
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category *
                    </label>
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    >
                      <option value="Youths">Youths</option>
                      <option value="Women">Women</option>
                      <option value="Men">Men</option>
                      <option value="Children">Children</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter event location"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter event description"
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="service">Service</option>
                      <option value="meeting">Meeting</option>
                      <option value="workshop">Workshop</option>
                      <option value="conference">Conference</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </label>
                    <select
                      value={eventStatus}
                      onChange={(e) => setEventStatus(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Event Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEventImage(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEventImagePreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {eventImagePreview && (
                    <div className="mt-2">
                      <img src={eventImagePreview} alt="Preview" className="h-32 w-full object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowCreateEventModal(false);
                    setEventTitle('');
                    setEventDate('');
                    setEventLocation('');
                    setEventDescription('');
                    setEventType('service');
                    setEventStatus('scheduled');
                    setEventImage(null);
                    setEventImagePreview('');
                    setIsRecurring(false);
                    setRecurrence({ frequency: 'weekly', interval: 1, endDate: '' });
                    setEventCategory('Youths');
                    setSelectedEvent(null);
                  }}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200'} transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCalendar size={18} />
                      {selectedEvent ? 'Update Event' : 'Create Event'}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </Modal>
        )}

        {showCreateMemberModal && (
          <Modal
            onClose={() => {
              setShowCreateMemberModal(false);
              setMemberName('');
              setMemberEmail('');
              setMemberPhone('');
              setMemberJoinDate('');
              setSelectedMember(null);
            }}
            title={selectedMember ? 'Edit Member' : 'Add New Member'}
            darkMode={darkMode}
          >
            <form onSubmit={handleMemberSubmit}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={memberPhone}
                      onChange={(e) => setMemberPhone(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Join Date
                    </label>
                    <input
                      type="date"
                      value={memberJoinDate}
                      onChange={(e) => setMemberJoinDate(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowCreateMemberModal(false);
                    setMemberName('');
                    setMemberEmail('');
                    setMemberPhone('');
                    setMemberJoinDate('');
                    setSelectedMember(null);
                  }}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200'} transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiUser size={18} />
                      {selectedMember ? 'Update Member' : 'Add Member'}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </Modal>
        )}

        {showDonationModal && (
          <Modal
            onClose={() => {
              setShowDonationModal(false);
              setDonationAmount('');
              setDonationDate('');
              setDonationMember('');
              setDonationType('tithe');
              setDonationNotes('');
              setSelectedDonation(null);
            }}
            title={selectedDonation ? 'Edit Donation' : 'Record New Donation'}
            darkMode={darkMode}
          >
            <form onSubmit={handleDonationSubmit}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Amount (KES) *
                  </label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter amount"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Date *
                    </label>
                    <input
                      type="date"
                      value={donationDate}
                      onChange={(e) => setDonationDate(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Method *
                    </label>
                    <select
                      value={donationType}
                      onChange={(e) => setDonationType(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    >
                      <option value="tithe">Tithe</option>
                      <option value="offering">Offering</option>
                      <option value="pledge">Pledge</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Member Name *
                  </label>
                  <input
                    type="text"
                    value={donationMember}
                    onChange={(e) => setDonationMember(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter member name"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Notes
                  </label>
                  <textarea
                    value={donationNotes}
                    onChange={(e) => setDonationNotes(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter any additional notes"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowDonationModal(false);
                    setDonationAmount('');
                    setDonationDate('');
                    setDonationMember('');
                    setDonationType('tithe');
                    setDonationNotes('');
                    setSelectedDonation(null);
                  }}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200'} transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiDollarSign size={18} />
                      {selectedDonation ? 'Update Donation' : 'Record Donation'}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </Modal>
        )}

        {showCreateDevotionalModal && (
          <Modal
            onClose={() => {
              setShowCreateDevotionalModal(false);
              setDevotionalTitle('');
              setDevotionalContent('');
              setDevotionalDate('');
              setDevotionalAuthor('Pastor');
              setDevotionalScripture('');
              setSelectedDevotional(null);
            }}
            title={selectedDevotional ? 'Edit Devotional' : 'Create New Devotional'}
            darkMode={darkMode}
          >
            <form onSubmit={handleDevotionalSubmit}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={devotionalTitle}
                    onChange={(e) => setDevotionalTitle(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter devotional title"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Scripture *
                  </label>
                  <input
                    type="text"
                    value={devotionalScripture}
                    onChange={(e) => setDevotionalScripture(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g., John 3:16"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={devotionalDate}
                    onChange={(e) => setDevotionalDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Content (Snippet) *
                  </label>
                  <textarea
                    value={devotionalContent}
                    onChange={(e) => setDevotionalContent(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter the main content or a snippet of the devotional"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Author
                  </label>
                  <input
                    type="text"
                    value={devotionalAuthor}
                    onChange={(e) => setDevotionalAuthor(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter author's name (e.g., Pastor John)"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowCreateDevotionalModal(false);
                    setDevotionalTitle('');
                    setDevotionalContent('');
                    setDevotionalDate('');
                    setDevotionalAuthor('Pastor');
                    setDevotionalScripture('');
                    setSelectedDevotional(null);
                  }}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200'} transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaPrayingHands size={18} />
                      {selectedDevotional ? 'Update Devotional' : 'Create Devotional'}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </Modal>
        )}

        {showLoginHistoryModal && (
          <Modal
            onClose={() => setShowLoginHistoryModal(false)}
            title="Login History"
            darkMode={darkMode}
          >
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(loginHistory) && loginHistory.length > 0 ? (
                    loginHistory.map((entry, index) => (
                      <tr key={index} className="border-b border-white/10 hover:bg-gray-700/20">
                        <td className="px-4 py-3 text-sm">{entry.user || entry.userId || 'Unknown'}</td>
                        <td className="px-4 py-3 text-sm">
                          {entry.time ? new Date(entry.time).toLocaleString() : (entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'N/A')}
                        </td>
                        <td className="px-4 py-3 text-sm">{entry.ipAddress || entry.ip || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-center text-sm">
                        No login history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <motion.button
                onClick={() => setShowLoginHistoryModal(false)}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200'} transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </Modal>
        )}

      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;