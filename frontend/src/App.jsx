// App.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context Providers
import { AuthProvider, useAuth } from "./context/authContext";
import { ThemeProvider } from "./context/ThemeContext";

// Components
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import BackToTopButton from "./components/BackToTopButton";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"; // Make sure this path is correct

// Public Pages
import Home from "./components/Home";
import About from "./components/About";
import Events from "./components/Events";
import Sermons from "./components/Sermons";
import Contact from "./components/Contact";
import GetInvolved from "./components/GetInvolved";
import Testimonials from "./components/Testimonials";
// import Newsletter from "./components/Newsletter"; // Uncomment if needed
import Login from "./components/Login";
import Ministries from "./components/Ministries";
import Gallery from "./components/Gallery";
import Donate from "./components/Donate";
import Leadership from "./components/Leadership";
import PrayerWall from "./components/PrayerWall";
import LiveStream from "./components/LiveStream";
import Devotionals from "./components/Devotionals";
import MinistryDetail from "./components/MinistryDetail";
import ProfileForm from "./components/profileForm";

// Admin Pages
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./components/AdminDashboard";

// =======================
// 404 Page
// =======================
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center text-xl">
    404 - Page Not Found
  </div>
);

// =======================
// Public Page Wrapper (ScrollToTop removed from here)
// =======================
const PublicWrapper = () => (
  <>
    <Navbar />
    {/* ScrollToTop removed from here */}
    <main className="min-h-screen">
      {/* Outlet will render the matched child route component */}
      <Outlet />
    </main>
    <Footer />
    <BackToTopButton />
  </>
);

// =======================
// Main App Routes
// =======================
const AppContent = () => {
  const { loading } = useAuth();
  if (loading) return null; // Or a loading spinner

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute adminOnly />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            {/* Add other admin routes here if needed */}
          </Route>
        </Route>

        {/* Public Routes wrapped with PublicWrapper */}
        <Route element={<PublicWrapper />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="events" element={<Events />} />
          <Route path="sermons" element={<Sermons />} />
          <Route path="get-involved" element={<GetInvolved />} />
          <Route path="leadership" element={<Leadership />} />
          <Route path="contact" element={<Contact />} />
          <Route path="testimonials" element={<Testimonials />} />
          {/* <Route path="newsletter" element={<Newsletter />} />  Uncomment if needed */}
          <Route path="ministries" element={<Ministries />} />
          <Route path="ministries/:slug" element={<MinistryDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="donate" element={<Donate />} />
          <Route path="prayer-wall" element={<PrayerWall />} />
          <Route path="devotionals" element={<Devotionals />} />
          <Route path="live" element={<LiveStream />} />

          {/* Protected Profile Route */}
          <Route path="profile" element={<PrivateRoute />}>
            <Route index element={<ProfileForm />} />
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

// =======================
// App Wrapper (ScrollToTop placed here)
// =======================
const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <div className="w-full min-h-screen overflow-x-hidden">
        {/* Place ScrollToTop directly inside the providers/routing context */}
        <ScrollToTop />
        <AppContent />
      </div>
    </ThemeProvider>
  </AuthProvider>
);

export default App;