import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useUser } from '../../contexts/UserContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount, toggleCart } = useCart();
  const { isAuthenticated, user } = useUser();
  const location = useLocation();

  const getAccountLabel = () => {
    const primaryName =
      user?.firstName ||
      user?.firstname ||
      user?.name ||
      user?.username ||
      (user?.email ? user.email.split('@')[0] : null);

    if (primaryName) {
      return `Hi, ${primaryName}`;
    }
    return 'My Account';
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className={`absolute w-full z-[1] transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/laces.png" alt="Logo" className="h-12 w-12 object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-black hover:text-gray-700 transition-colors duration-300" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
              Home
            </Link>
            <Link to="/catalog" className="text-black hover:text-gray-700 transition-colors duration-300" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
              Shop
            </Link>
            <Link to="/reviews" className="text-black hover:text-gray-700 transition-colors duration-300" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
              Reviews
            </Link>
            <Link to="/about" className="text-black hover:text-gray-700 transition-colors duration-300" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
              Our Story
            </Link>
            <Link to="/contact" className="text-black hover:text-gray-700 transition-colors duration-300" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
              Contact
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/account"
                className="text-amber-900 hover:text-amber-600 transition-colors duration-300 font-mono"
              >
                {getAccountLabel()}
              </Link>
            ) : (
              <div className="hidden lg:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="bg-white text-black px-4 py-2 rounded-lg border border-black hover:bg-gray-100 transition-colors duration-300 font-mono"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-black px-4 py-2 rounded-lg border border-black hover:bg-gray-100 transition-colors duration-300"
                  style={{ fontFamily: 'Times New Roman, Times, serif' }}
                >
                  Register
                </Link>
              </div>
            )}
            <button
              onClick={toggleCart}
              className="text-amber-900 hover:text-amber-600 transition-colors duration-300 relative"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-amber-900 hover:text-amber-600 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Slide Menu */}
          <div className="absolute right-0 top-0 h-full w-[45%] bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-amber-200">
              <span className="text-lg font-bold text-amber-900 font-mono">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-amber-900 hover:text-amber-600 transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Menu Content */}
            <div className="px-4 py-6 space-y-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-black hover:text-gray-700 transition-colors duration-300 py-2 border-b border-gray-100" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                Home
              </Link>
              <Link to="/catalog" onClick={() => setIsMenuOpen(false)} className="block text-black hover:text-gray-700 transition-colors duration-300 py-2 border-b border-gray-100" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                Shop
              </Link>
              <Link to="/reviews" onClick={() => setIsMenuOpen(false)} className="block text-black hover:text-gray-700 transition-colors duration-300 py-2 border-b border-gray-100" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                Reviews
              </Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block text-black hover:text-gray-700 transition-colors duration-300 py-2 border-b border-gray-100" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                Our Story
              </Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block text-black hover:text-gray-700 transition-colors duration-300 py-2 border-b border-gray-100" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                Contact
              </Link>
              
              {/* Authentication Links */}
              <div className="pt-4 mt-4 border-t border-amber-200">
                {isAuthenticated ? (
                  <Link
                    to="/account"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-amber-900 hover:text-amber-600 transition-colors duration-300 font-mono py-2"
                  >
                    {getAccountLabel()}
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block bg-white text-black px-4 py-2 rounded-lg border border-black hover:bg-gray-100 transition-colors duration-300 text-center"
                      style={{ fontFamily: 'Times New Roman, Times, serif' }}
                    >
                      Register
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block bg-white text-black px-4 py-2 rounded-lg border border-black hover:bg-gray-100 transition-colors duration-300 font-mono text-center"
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;