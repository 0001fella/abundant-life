import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Custom hook to scroll the window to the top whenever the route changes.
 * This ensures that navigating between pages in a SPA starts from the top.
 */
export default function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      // Use 'auto' for immediate scroll, or 'smooth' for animated scroll
      behavior: "auto" 
    });
  }, [pathname]); // Dependency array ensures this runs on pathname change
}

// Note: This hook doesn't return anything. It's used for its side effect.
// Call it inside a component that is rendered within your Router.