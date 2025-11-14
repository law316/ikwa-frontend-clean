import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-white border-t-2 border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img src="/laces.png" alt="Logo" className="h-12 w-12 object-contain" />
            </Link>
            <p className="text-black">
              Your destination for authentic vintage t-shirts from the most iconic moments in history.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-black transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-black transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-black transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:contact@lace-legacy.com" className="text-black hover:text-black transition-colors duration-300">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog" className="text-black hover:text-black transition-colors duration-300">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-black hover:text-black transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-black hover:text-black transition-colors duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-black hover:text-black transition-colors duration-300">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping" className="text-black hover:text-black transition-colors duration-300">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-black hover:text-black transition-colors duration-300">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/care-guide" className="text-black hover:text-black transition-colors duration-300">
                  Care Guide
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-black hover:text-black transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Stay Updated</h3>
            <p className="text-black mb-4">
              Subscribe to our newsletter for exclusive offers and vintage finds.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
              />
              <button
                type="submit"
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-black">
          <p className="text-center text-black">
            © {new Date().getFullYear()} Lace and Legacy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;