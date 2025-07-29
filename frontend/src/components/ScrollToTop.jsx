// src/components/ScrollToTop.jsx (or your chosen path)
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto" // or "smooth"
    });
  }, [pathname]); // Dependency ensures it runs on route change

  // This component doesn't render anything visible
  return null;
};

export default ScrollToTop;