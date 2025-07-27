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
import ScrollToTop from "./components/ScrollToTop";

// Public Pages
import Home from "./components/Home";
import About from "./components/About";
import Events from "./components/Events";
import Sermons from "./components/Sermons";
import Contact from "./components/Contact";
import GetInvolved from "./components/GetInvolved";
import Testimonials from "./components/Testimonials";
import Newsletter from "./components/Newsletter";
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
// Public Page Wrapper
// =======================
const PublicWrapper = () => (
  <>
    <Navbar />
    <ScrollToTop />
    <main className="min-h-screen">
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
  if (loading) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<PrivateRoute adminOnly />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route element={<PublicWrapper />}>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="events" element={<Events />} />
          <Route path="sermons" element={<Sermons />} />
          <Route path="get-involved" element={<GetInvolved />} />
          <Route path="leadership" element={<Leadership />} />
          <Route path="contact" element={<Contact />} />
          <Route path="testimonials" element={<Testimonials />} />
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
// App Wrapper
// =======================
const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <div className="w-full min-h-screen overflow-x-hidden">
        <AppContent />
      </div>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
