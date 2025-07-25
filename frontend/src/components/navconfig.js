// src/components/navconfig.js

export const navConfig = {
  routes: [
    { label: "Home", path: "/", group: "Main" },
    { label: "About", path: "/about", group: "Main" },
    { label: "Leadership", path: "/leadership", group: "Main" },
    { label: "Contact", path: "/contact", group: "Main" },

    { label: "Sermons", path: "/sermons", group: "Media" },
    { label: "Live Stream", path: "/livestream", group: "Media" },
    { label: "Gallery", path: "/gallery", group: "Media" },
    { label: "Devotionals", path: "/devotionals", group: "Media" },

    { label: "Events", path: "/events", group: "Community" },
    { label: "Prayer Wall", path: "/prayer-wall", group: "Community" },
    { label: "Testimonials", path: "/testimonials", group: "Community" },
    { label: "Newsletter", path: "/newsletter", group: "Community" },

    { label: "Get Involved", path: "/get-involved", group: "Involvement" },
    { label: "Ministries", path: "/ministries", group: "Involvement" },
    { label: "Donate", path: "/donate", group: "Involvement" },

    { label: "Login", path: "/login", group: "Auth" },
    { label: "Admin", path: "/admin", group: "Auth" },
    { label: "Dashboard", path: "/dashboard", group: "Auth" }
  ],

  // Optional: darkRoutes if you still want that styling config
  darkRoutes: [
    "/", "/about", "/leadership", "/contact",
    "/sermons", "/livestream", "/gallery", "/devotionals",
    "/events", "/prayer-wall", "/testimonials", "/newsletter",
    "/get-involved", "/ministries", "/donate",
    "/login", "/admin", "/dashboard"
  ]
};
