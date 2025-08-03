// src/components/Navbar.js

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames";
import { navConfig } from "./navconfig";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";

// --- Color Palette ---
// Primary: #5D1C34 (Dark Red)
// Secondary: #A67D44 (Gold)
// Accent: #899481 (Sage Green)
// Light Backgrounds: #EFE9E1 (Cream)
// Dark Backgrounds: #11100F (Near Black)
// Light Accents: #CDBCAB (Light Tan)

// --- Excluded Labels ---
// Removed "Contact" from direct navbar display as requested
const EXCLUDED_LABELS = ["Live Stream", "Gallery", "Newsletter", "Contact"];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const lastScrollYRef = useRef(window.scrollY);
  const dropdownRef = useRef(null);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrolled(currentScrollY > 50);
    setShowNavbar(
      currentScrollY < 10 || currentScrollY < lastScrollYRef.current
    );
    lastScrollYRef.current = currentScrollY;
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
        setOpenDropdown(null);
        setOpenMobileDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const throttledScroll = () => window.requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  // --- Group Routes and Handle "Contact" ---
  const { groupedRoutes, contactRoute } = useMemo(() => {
    const groups = {};
    let contact = null;

    navConfig.routes
      .filter((route) => !EXCLUDED_LABELS.includes(route.label))
      .forEach((route) => {
        if (route.label === "Contact") {
          contact = route; // Capture the Contact route
        } else {
          groups[route.group] = groups[route.group] || [];
          groups[route.group].push(route);
        }
      });

    // If Contact route exists, add it to the Involvement group
    if (contact) {
       if (!groups["Involvement"]) {
         groups["Involvement"] = [];
       }
       // Ensure it's added only once and at the beginning or end
       // Let's add it at the end for this example
       groups["Involvement"].push(contact);
    }

    return { groupedRoutes: groups, contactRoute: contact };
  }, []);

  const filteredAuthRoutes = useMemo(() => {
    if (!user) return [{ label: "Login", path: "/login" }];
    if (user?.role === "admin")
      return [{ label: "Admin", path: "/admin/dashboard" }];
    return [{ label: "My Account", path: "/account" }];
  }, [user]);

  // --- Updated Color Classes to Match Hero Page ---
  const textColor = "text-[#11100F]"; // Near Black
  const hoverColor = "hover:text-[#5D1C34]"; // Dark Red
  const activeColor = "text-[#5D1C34]"; // Dark Red
  const navbarBg = scrolled
    ? "bg-[#EFE9E1] shadow-md" // Cream background when scrolled
    : "bg-[#EFE9E1]"; // Cream background
  const dropdownBg = "bg-white border border-[#CDBCAB]"; // White dropdown with light tan border
  const dropdownTextColor = "text-[#11100F]"; // Near Black text in dropdown
  const dropdownHoverBg = "hover:bg-[#CDBCAB]/30"; // Light Tan hover in dropdown

  const renderDropdown = (items, name, isMobile = false) => {
    const isOpen = isMobile
      ? openMobileDropdown === name
      : openDropdown === name;
    const toggle = () => {
      if (isMobile) setOpenMobileDropdown(isOpen ? null : name);
      else setOpenDropdown(isOpen ? null : name);
    };

    return (
      <div key={name} className="relative" ref={isMobile ? null : dropdownRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          className={classNames(
            "px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all",
            textColor,
            hoverColor,
            {
              [activeColor]: isOpen,
            }
          )}
        >
          {name}
          <svg
            className={`ml-1 h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={classNames(
              isMobile ? "pl-6 mt-1" : "absolute left-0 mt-2 w-48 z-50",
              "rounded-xl shadow-lg", // Removed dark mode classes, using custom ones
              dropdownBg // Custom dropdown background
            )}
          >
            <div className="py-1">
              {items.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => {
                    setOpenDropdown(null);
                    setOpenMobileDropdown(null);
                    setMenuOpen(false);
                  }}
                  // Updated dropdown item styles
                  className={classNames(
                    "block px-4 py-2.5 text-sm",
                    dropdownTextColor, // Custom text color
                    dropdownHoverBg // Custom hover background
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const headerClasses = classNames(
    "fixed top-0 left-0 w-full z-50 transition-all duration-300 transform",
    navbarBg,
    {
      "translate-y-0": showNavbar,
      "-translate-y-full": !showNavbar,
    }
  );

  return (
    <header className={headerClasses} ref={dropdownRef}>
      <nav className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center">
          {/* Updated Logo Colors */}
          <Link to="/" className={classNames("text-2xl font-extrabold", textColor)}>
            <span className="text-[#5D1C34]">AL</span>CC {/* Dark Red for AL */}
          </Link>
          <div className="hidden md:flex ml-auto space-x-1 items-center">
            {/* Main Links */}
            {(groupedRoutes["Main"] || []).map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={classNames(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  textColor,
                  hoverColor
                )}
              >
                {label}
              </Link>
            ))}

            {/* Dropdowns: Media, Community, Involvement (now includes Contact) */}
            {["Media", "Community", "Involvement"].map((section) =>
              groupedRoutes[section]?.length
                ? renderDropdown(groupedRoutes[section], section)
                : null
            )}

            {/* Auth Links */}
            {filteredAuthRoutes.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={classNames(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  textColor,
                  hoverColor
                )}
              >
                {label}
              </Link>
            ))}

            {/* Logout Button - Updated Style */}
            {user && (
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-[#5D1C34] hover:bg-[#A67D44] transition-all shadow-md" // Dark Red to Gold
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="ml-auto md:hidden relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              // Updated mobile button style
              className="py-2 px-4 rounded-lg text-[#11100F] bg-white border border-[#CDBCAB] hover:bg-[#CDBCAB]/30"
            >
              {user ? "Menu" : "Navigate"}
            </button>

            {/* Mobile Menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  // Updated mobile menu styles
                  className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg z-50 bg-white border border-[#CDBCAB]"
                >
                  {/* Mobile Main Links */}
                  {(groupedRoutes["Main"] || []).map(({ label, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={() => setMenuOpen(false)}
                        // Updated mobile link styles
                        className="block px-4 py-3 text-[#11100F] hover:bg-[#CDBCAB]/30"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}

                  {/* Mobile Dropdowns */}
                  {["Media", "Community", "Involvement"].map((section) => (
                    <li key={section}>
                      {groupedRoutes[section]?.length
                        ? renderDropdown(groupedRoutes[section], section, true)
                        : null}
                    </li>
                  ))}

                  {/* Mobile Auth Links */}
                  {filteredAuthRoutes.map(({ label, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={() => setMenuOpen(false)}
                        // Updated mobile link styles
                        className="block px-4 py-3 text-[#11100F] hover:bg-[#CDBCAB]/30"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}

                  {/* Mobile Logout Button */}
                  {user && (
                    <li>
                      <button
                        onClick={handleLogout}
                        // Updated mobile logout button style
                        className="w-full text-left px-4 py-3 text-white bg-[#5D1C34] hover:bg-[#A67D44] mt-2 rounded-b-xl"
                      >
                        Logout
                      </button>
                    </li>
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;