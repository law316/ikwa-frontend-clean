import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import { useTheme } from '../../contexts/ThemeContext';
import CartDrawer from '../cart/CartDrawer';

const Layout = ({ children }) => {
  const { theme } = useTheme();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <div className={`min-h-screen flex flex-col bg-${theme === 'light' ? 'amber-50' : 'gray-900'}`}>
      <Header />
      <CartDrawer />
      <motion.main
        className="flex-1 pt-20"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Breadcrumbs />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
          {children}
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;