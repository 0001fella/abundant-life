import React, { useState } from "react";
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle,
  Clock 
} from "lucide-react";

const NewsletterFooter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setSubmitted(false);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setEmail("");
    }, 2000);
  };

  // Placeholder for leadership images
  const leadershipImages = {
    priscah: "/images/leaders/priscah-otieno.jpg", // Add to public/images/leaders/
    samuel: "/images/leaders/samuel-kiptoo.jpg",   // Add to public/images/leaders/
    esther: "/images/leaders/esther-mugo.jpg",     // Add to public/images/leaders/
    joel: "/images/leaders/joel-mwangi.jpg",       // Add to public/images/leaders/
    ruth: "/images/leaders/ruth-achieng.jpg"       // Add to public/images/leaders/
  };

  return (
    <div className="bg-white text-gray-800 border-t border-gray-200">
      {/* Newsletter Section */}
      <section className="py-16 px-4 text-center bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-blue-900">
            Stay Connected
          </h2>
          <p className="mb-6 text-gray-600 max-w-2xl mx-auto">
            Join our newsletter to receive updates and inspiration from our ministry.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto"
          >
            <div className="relative w-full sm:w-auto">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-md flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                <>
                  Subscribe
                </>
              )}
            </button>
          </form>

          {submitted && (
            <div className="mt-6 text-green-600 flex justify-center items-center gap-2">
              <CheckCircle className="text-green-600" />
              <span>Thank you for subscribing!</span>
            </div>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Branding */}
          <div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Abundant Life
            </h2>
            <p className="text-gray-600 text-sm">
              Empowering you to walk in purpose and overflow with grace.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                "Home",
                "About",
                "Sermons",
                "Events",
                "Get Involved",
                "Contact",
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
              Service Times
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <Clock className="text-blue-600 mt-0.5" size={16} />
                <span>Sunday Service: 10:00 AM – 12:30 PM</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="text-blue-600 mt-0.5" size={16} />
                <span>Wednesday Bible Study: 6:00 PM – 7:30 PM</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="text-blue-600 mt-0.5" size={16} />
                <span>Youth Fridays: 5:00 PM – 7:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <MapPin className="text-blue-600 mt-0.5" size={16} />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="text-blue-600 mt-0.5" size={16} />
                <span>+254 712 345678</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="text-blue-600 mt-0.5" size={16} />
                <span>info@abundantlife.org</span>
              </li>
            </ul>

            {/* Socials */}
            <div className="flex gap-4 mt-6">
              {[
                { icon: Facebook, color: "text-blue-600" },
                { icon: Instagram, color: "text-pink-600" },
                { icon: Youtube, color: "text-red-600" }
              ].map(({ icon: Icon, color }, idx) => (
                <a
                  key={idx}
                  href="#"
                  className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition ${color}`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Abundant Life Celebration Center. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default NewsletterFooter;