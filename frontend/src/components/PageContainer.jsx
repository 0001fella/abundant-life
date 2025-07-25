// src/components/PageContainer.jsx
import React from "react";
import { motion } from "framer-motion";

const PageContainer = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className={`main-content w-full min-h-screen ${className}`}
  >
    <div className="w-full h-full">{children}</div>
  </motion.div>
);

export default PageContainer;
