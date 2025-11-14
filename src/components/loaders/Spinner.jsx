import React from 'react';
import { motion } from 'framer-motion';

const Spinner = ({ size = 'md', color = 'brown', className = '' }) => {
  // Size variants
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  
  // Color variants
  const colorMap = {
    brown: 'text-brown-medium',
    blue: 'text-blue-vintage',
    orange: 'text-orange-medium',
    black: 'text-black',
  };
  
  const sizeClass = sizeMap[size] || sizeMap.md;
  const colorClass = colorMap[color] || colorMap.brown;
  
  return (
    <div className={`flex justify-center items-center ${className}`} role="status" aria-live="polite">
      <motion.div
        className={`${sizeClass} ${colorClass}`}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg 
          className="w-full h-full" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vintage-style spinner with decorative elements */}
          <path 
            d="M12 2.5V6.5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          <path 
            d="M12 17.5V21.5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
            strokeOpacity="0.3"
          />
          <path 
            d="M4.5 12H8.5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
            strokeOpacity="0.4"
          />
          <path 
            d="M15.5 12H19.5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
          <path 
            d="M6.34 6.34L9.17 9.17" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
          <path 
            d="M14.83 14.83L17.66 17.66" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
            strokeOpacity="0.6"
          />
          <path 
            d="M6.34 17.66L9.17 14.83" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
          <path 
            d="M14.83 9.17L17.66 6.34" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
            strokeOpacity="0.9"
          />
        </svg>
      </motion.div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;