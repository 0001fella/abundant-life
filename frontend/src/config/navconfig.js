export const navConfig = {
  routes: [
    // Main navigation links (visible in desktop/mobile nav)
    { label: "Home", path: "/", group: "Main" },
    { label: "About", path: "/about", group: "Main" },
    { label: "Contact", path: "/contact", group: "Main" },

    // Dropdown: Involvement
    { label: "Ministries", path: "/ministries", group: "Involvement" },
    { label: "Events", path: "/events", group: "Involvement" },

    // Dropdown: Media
    { label: "Gallery", path: "/gallery", group: "Media" },
    { label: "Live", path: "/live", group: "Media" },

    // Dropdown: Community
    // Add these if needed
    { label: "Blog", path: "/blog", group: "Community" },
    { label: "Forum", path: "/forum", group: "Community" },
  ],

  // These routes will render dark-themed navbar
  darkRoutes: ["/ministries", "/live", "/gallery"]
};
