import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Sheet = ({ open, onOpenChange, children }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Sheet Content */}
          <div className="fixed inset-0 z-50 pointer-events-none">
            {children}
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const SheetContent = ({ 
  children, 
  side = 'right', 
  className = '',
  onClose 
}) => {
  const sideVariants = {
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      className: 'right-0 top-0 h-full'
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
      className: 'left-0 top-0 h-full'
    },
    top: {
      initial: { y: '-100%' },
      animate: { y: 0 },
      exit: { y: '-100%' },
      className: 'top-0 left-0 w-full'
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      className: 'bottom-0 left-0 w-full'
    }
  };

  const variant = sideVariants[side];

  return (
    <motion.div
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className={`fixed bg-white shadow-xl pointer-events-auto ${variant.className} ${className}`}
    >
      {children}
    </motion.div>
  );
};

const SheetHeader = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

const SheetTitle = ({ children, className = '' }) => {
  return (
    <h2 className={`text-lg font-semibold text-amber-900 font-mono ${className}`}>
      {children}
    </h2>
  );
};

const SheetClose = ({ onClose, className = '' }) => {
  return (
    <button
      onClick={onClose}
      className={`p-2 text-amber-600 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-colors duration-300 ${className}`}
      aria-label="Close"
    >
      <X className="h-5 w-5" />
    </button>
  );
};

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose };
export default Sheet;