import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // change "instant" to "smooth" if needed
  }, [pathname]);

  return null;
};

export default ScrollToTop;
