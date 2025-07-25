import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import classNames from "classnames";
import { navConfig } from "./navconfig";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import NavDropdown from "./NavDropdown";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const location = useLocation();
  const lastScrollYRef = useRef(window.scrollY);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrolled(currentScrollY > 50);
    const goingUp = currentScrollY < lastScrollYRef.current;
    setShowNavbar(currentScrollY < 10 || goingUp);
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const throttledScroll = () => {
      window.requestAnimationFrame(() => handleScroll());
    };
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  const groupedRoutes = useMemo(() => {
    const groups = {};
    navConfig.routes.forEach(route => {
      if (!groups[route.group]) {
        groups[route.group] = [];
      }
      groups[route.group].push(route);
    });
    return groups;
  }, []);

  const filteredAuthRoutes = useMemo(() => {
    const authRoutes = groupedRoutes["Auth"] || [];
    if (!user) {
      return authRoutes.filter(route => route.path === "/login");
    } else if (user.role === "admin") {
      return authRoutes.filter(route => route.path === "/admin");
    } else {
      return authRoutes.filter(route => route.path === "/dashboard");
    }
  }, [user, groupedRoutes]);

  const headerClasses = classNames(
    "fixed top-0 left-0 w-full z-50 transition-all duration-300 transform",
    {
      "translate-y-0": showNavbar,
      "-translate-y-full": !showNavbar,
      "bg-black/90 text-white shadow-lg": scrolled,
      "bg-black/80 text-white": !scrolled,
    }
  );

  const buttonClasses = classNames(
    "py-2 px-4 rounded-lg border-2 font-medium focus:outline-none transition",
    "bg-black/90 border-white/20 text-white hover:bg-black"
  );

  return (
    <header className={headerClasses} ref={dropdownRef}>
      <nav className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to="/" className="focus:outline-none focus:ring-2 focus:ring-primary/50 rounded" aria-label="Go to homepage">
              <h1 className="text-2xl font-extrabold text-white">ALCC</h1>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex ml-auto space-x-4 items-center">
            {(groupedRoutes["Main"] || []).map(({ label, path }) => (
              <Link key={path} to={path} className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-black/30 transition">
                {label}
              </Link>
            ))}
            {["Media", "Community", "Involvement"].map((section) => (
              <NavDropdown
                key={section}
                dropdownName={section}
                items={groupedRoutes[section] || []}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
            ))}
            {filteredAuthRoutes.map(({ label, path }) => (
              <Link key={path} to={path} className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-black/30 transition">
                {label}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="ml-auto md:hidden relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className={buttonClasses}>
              {user ? "Menu" : "Navigate"}
            </button>

            {menuOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-56 rounded-md shadow-lg z-50 overflow-hidden bg-black/90 border border-white/20"
              >
                {(groupedRoutes["Main"] || []).map(({ label, path }) => (
                  <li key={path}>
                    <Link to={path} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-white hover:bg-black/70">
                      {label}
                    </Link>
                  </li>
                ))}

                {["Media", "Community", "Involvement"].map((section) => (
                  <li key={section} className="border-t border-white/20">
                    <NavDropdown
                      dropdownName={section}
                      items={groupedRoutes[section] || []}
                      isMobile={true}
                      openDropdown={openMobileDropdown}
                      setOpenDropdown={setOpenMobileDropdown}
                      onClose={() => setMenuOpen(false)}
                    />
                  </li>
                ))}

                {filteredAuthRoutes.map(({ label, path }) => (
                  <li key={path} className="border-t border-white/20">
                    <Link
                      to={path}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-white hover:bg-black/70"
                    >
                      {label}
                    </Link>
                  </li>
                ))}

                {user && (
                  <li className="border-t border-white/20">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-white hover:bg-red-900/50"
                    >
                      Logout
                    </button>
                  </li>
                )}
              </motion.ul>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
