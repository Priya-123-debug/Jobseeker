import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import Botinterface from "./chatbot/Botinterface";

function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          {/* Grid: 1 col mobile → 2 col tablet → 4 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h2 className="text-xl font-bold text-white mb-3">
                Job<span className="text-orange-500">Portal</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Connecting students and recruiters with the best opportunities.
                Explore jobs, internships, and career resources all in one place.
              </p>
              {/* Social icons */}
              <div className="flex gap-3 mt-5">
                {[
                  { icon: <FaFacebookF />, href: "#" },
                  { icon: <FaTwitter />, href: "#" },
                  { icon: <FaLinkedinIn />, href: "#" },
                  { icon: <FaInstagram />, href: "#" },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 hover:bg-orange-500 transition text-sm"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-base font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {[
                  { label: "Home", to: "/" },
                  { label: "Jobs", to: "/jobs" },
                  { label: "Browse", to: "/browse" },
                  { label: "Sign Up", to: "/signup" },
                ].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:text-orange-400 transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-base font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                {["Blog", "FAQ", "Contact", "Privacy Policy"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-orange-400 transition">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-base font-semibold text-white mb-4">Contact Us</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>📧 support@jobportal.com</p>
                <p>📞 +91 12345 67890</p>
                <p>📍 Patna, Bihar, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 py-4 text-center text-gray-500 text-xs sm:text-sm px-4">
          © {new Date().getFullYear()} JobPortal. All rights reserved. Made with ❤️ in India
        </div>
      </footer>

      {/* Chatbot FAB */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-2xl shadow-xl transition flex items-center justify-center"
          title="Chat with us"
        >
          💬
        </button>
      </div>

      {isOpen && <Botinterface onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default Footer;