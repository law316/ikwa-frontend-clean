import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Heart, User, Search, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useUser();

  const getAccountLabel = () => {
    const primaryName =
      user?.firstName ||
      user?.firstname ||
      user?.name ||
      user?.username ||
      (user?.email ? user.email.split('@')[0] : null);

    return primaryName ? `Hi, ${primaryName}` : 'My Account';
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuItems = [
    { icon: <Home className="h-6 w-6" />, label: 'Home', path: '/' },
    { icon: <Search className="h-6 w-6" />, label: 'Search', path: '/search' },
    { icon: <ShoppingBag className="h-6 w-6" />, label: 'Cart', path: '/cart' },
    { icon: <Heart className="h-6 w-6" />, label: 'Wishlist', path: '/wishlist' },
    { icon: <User className="h-6 w-6" />, label: isAuthenticated ? getAccountLabel() : 'Account', path: '/account' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-black hover:text-gray-700 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-black font-mono">
            <img src="/logo.jpg" alt="Logo" className="h-8 w-8 object-contain" />
            <span>Lace and Legacy</span>
          </Link>
          <Link
            to="/cart"
            className="p-2 text-black hover:text-gray-700 transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="h-6 w-6" />
          </Link>
        </div>
      </header>

      {/* Slide-out Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-8">
                  <Link
                    to="/"
                    className="text-2xl font-bold text-black font-mono"
                  >
                    Lace and Legacy
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-black hover:text-black transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Auth Buttons */}
                {isAuthenticated ? (
                  <Link
                    to="/account"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 text-black hover:bg-gray-100 rounded-lg transition-colors mb-4"
                  >
                    <User className="h-6 w-6" />
                    <span className="font-medium">{getAccountLabel()}</span>
                  </Link>
                ) : (
                  <div className="space-y-2 mb-4">
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block w-full p-3 text-center bg-gray-600 text-white hover:bg-gray-700 rounded-lg transition-colors font-bold"
                    >
                      Register
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full p-3 text-center border-2 border-gray-600 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-bold"
                    >
                      Log In
                    </Link>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 text-black hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* Categories */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-black mb-4">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {['70s', '80s', '90s', 'Limited Edition', 'New Arrivals'].map(
                      (category) => (
                        <Link
                          key={category}
                          to={`/category/${category.toLowerCase()}`}
                          onClick={() => setIsOpen(false)}
                          className="block p-3 text-black hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {category}
                        </Link>
                      )
                    )}
                  </div>
                </div>

                {/* Support Links */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-black mb-4">
                    Support
                  </h3>
                  <div className="space-y-2">
                    {[
                      'Contact Us',
                      'FAQ',
                      'Size Guide',
                      'Shipping',
                      'Returns',
                    ].map((item) => (
                      <Link
                        key={item}
                        to={`/support/${item.toLowerCase().replace(' ', '-')}`}
                        onClick={() => setIsOpen(false)}
                        className="block p-3 text-black hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;