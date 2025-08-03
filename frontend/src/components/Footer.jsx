import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Updated color palette
  const primaryAccent = '#5D1C34'; // Deep burgundy
  const secondaryAccent = '#A67D44'; // Earthy gold
  const mainTextColor = '#FFFFFF'; // White
  const secondaryTextColor = '#EFE9E1'; // Light beige
  const blackBg = '#000000'; // Explicit black background
  const glassBorder = 'rgba(255, 255, 255, 0.15)'; // Border color

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer 
      className="hidden md:block relative pt-16 pb-8 overflow-hidden z-10 font-inter"
      style={{
        backgroundColor: blackBg,
        borderTop: `1px solid ${glassBorder}`,
        color: mainTextColor,
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Church Info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold font-serif" style={{ color: primaryAccent }}>Abundant Life Celebration Center</span>
            </div>
            <p className="leading-relaxed text-sm" style={{ color: secondaryTextColor }}>
              A place of worship, fellowship, and spiritual growth dedicated to serving God and serving people.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold font-serif mb-6 pb-2 border-b-2 inline-block" style={{ borderColor: secondaryAccent, color: secondaryAccent }}>Quick Links</h3>
            <ul className="space-y-3">
              {['About Us', 'Our Beliefs', 'Ministries', 'Sermons', 'Events'].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-sm transition-colors block py-1" style={{ color: secondaryTextColor }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold font-serif mb-6 pb-2 border-b-2 inline-block" style={{ borderColor: secondaryAccent, color: secondaryAccent }}>Contact Us</h3>
            <ul className="space-y-3 text-sm" style={{ color: secondaryTextColor }}>
              <li className="flex items-start">
                Umoja Three, Chockmart
              </li>
              <li className="flex items-center">
                (555) 123-4567
              </li>
              <li className="flex items-center">
                info@abundantlife.com
              </li>
            </ul>
            
            <div className="mt-6 text-sm">
              <h4 className="font-bold font-serif mb-2" style={{ color: secondaryAccent }}>Service Times</h4>
              <ul className="space-y-1" style={{ color: secondaryTextColor }}>
                <li className="flex justify-between">
                  <span>Sunday Worship</span>
                  <span>10:00 AM</span>
                </li>
                <li className="flex justify-between">
                  <span>Wednesday Bible Study</span>
                  <span>7:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t" style={{ borderColor: glassBorder }}>
          <p className="text-sm mb-4 md:mb-0" style={{ color: secondaryTextColor }}>
            © {currentYear} Abundant Life Celebration Center. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            {['Privacy Policy', 'Terms of Service'].map((item, index) => (
              <a 
                key={index}
                href="#"
                className="text-sm transition-colors"
                style={{ color: secondaryTextColor }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;