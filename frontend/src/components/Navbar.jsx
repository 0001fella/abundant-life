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
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";

const EXCLUDED_LABELS = ["Live Stream", "Gallery", "Newsletter"];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const lastScrollYRef = useRef(window.scrollY);
  const dropdownRef = useRef(null);
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
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

  const groupedRoutes = useMemo(() => {
    return navConfig.routes
      .filter((route) => !EXCLUDED_LABELS.includes(route.label))
      .reduce((acc, route) => {
        acc[route.group] = acc[route.group] || [];
        acc[route.group].push(route);
        return acc;
      }, {});
  }, []);

  const filteredAuthRoutes = useMemo(() => {
    if (!user) return [{ label: "Login", path: "/login" }];
    if (user.role === "admin")
      return [{ label: "Admin", path: "/admin/dashboard" }];
    return [{ label: "My Account", path: "/account" }];
  }, [user]);

  const textColor = "text-gray-800 dark:text-gray-100";
  const hoverColor = "hover:text-emerald-600";
  const activeColor = "text-emerald-600";

  const navbarBg = scrolled
    ? "bg-white dark:bg-gray-900 shadow-md"
    : "bg-white dark:bg-gray-900";

  const renderDropdown = (items, name, isMobile = false) => {
    const isOpen = isMobile
      ? openMobileDropdown === name
      : openDropdown === name;
    const toggle = () => {
      if (isMobile) setOpenMobileDropdown(isOpen ? null : name);
      else setOpenDropdown(isOpen ? null : name);
    };

    return (
      <div key={name} className="relative">
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
              "rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
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
                  className="block px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-700/20"
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
          <Link to="/" className={classNames("text-2xl font-extrabold", textColor)}>
            <span className="text-emerald-600">AL</span>CC
          </Link>

          <div className="hidden md:flex ml-auto space-x-1 items-center">
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

            {["Media", "Community", "Involvement"].map((section) =>
              groupedRoutes[section]?.length
                ? renderDropdown(groupedRoutes[section], section)
                : null
            )}

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

            {user && (
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all shadow-md"
              >
                Logout
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
            >
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
          </div>

          <div className="ml-auto md:hidden relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="py-2 px-4 rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {user ? "Menu" : "Navigate"}
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg z-50 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                >
                  {(groupedRoutes["Main"] || []).map(({ label, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-700/20"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}

                  {["Media", "Community", "Involvement"].map((section) => (
                    <li key={section}>
                      {groupedRoutes[section]?.length
                        ? renderDropdown(groupedRoutes[section], section, true)
                        : null}
                    </li>
                  ))}

                  {filteredAuthRoutes.map(({ label, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-700/20"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}

                  {user && (
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 mt-2 rounded-b-xl"
                      >
                        Logout
                      </button>
                    </li>
                  )}

                  <li>
                    <button
                      onClick={toggleTheme}
                      className="w-full text-left px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </button>
                  </li>
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
