import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, ShoppingCart, Heart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const location = useLocation();

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

  // Handle touch gestures
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    
    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    // Close drawer on swipe right
    if (diff > 50) {
      setIsOpen(false);
    }
  };

  const menuItems = [
    { name: 'Shop', path: '/catalog' },
    { name: 'Collections', path: '/collections' },
    { name: 'Our Story', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 text-amber-900 hover:text-amber-600 transition-colors duration-300"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-[999] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring',
              damping: 20,
              duration: 0.3
            }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              width: '40%',
              backgroundColor: 'white',
              zIndex: 1000,
              boxShadow: '-4px 0 10px rgba(0, 0, 0, 0.1)'
            }}
            className="lg:hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-black">
              <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-black font-mono">
                <img src="/logo.jpg" alt="Logo" className="h-8 w-8 object-contain" />
                <span>Lace and Legacy</span>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-black hover:text-black transition-colors duration-300"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-4">
              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-3 text-amber-900 hover:bg-amber-50 rounded-lg transition-colors duration-300"
                    >
                      <span className="font-mono">{item.name}</span>
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-amber-200">
              <div className="grid grid-cols-3 gap-4">
                <Link
                  to="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col items-center p-3 text-amber-900 hover:bg-amber-50 rounded-lg transition-colors duration-300"
                >
                  <User className="w-6 h-6 mb-1" />
                  <span className="text-xs font-mono">Account</span>
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col items-center p-3 text-amber-900 hover:bg-amber-50 rounded-lg transition-colors duration-300"
                >
                  <Heart className="w-6 h-6 mb-1" />
                  <span className="text-xs font-mono">Wishlist</span>
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col items-center p-3 text-amber-900 hover:bg-amber-50 rounded-lg transition-colors duration-300"
                >
                  <ShoppingCart className="w-6 h-6 mb-1" />
                  <span className="text-xs font-mono">Cart</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;