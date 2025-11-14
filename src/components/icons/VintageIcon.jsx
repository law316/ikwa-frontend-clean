import React from 'react';

// A collection of vintage-themed icons
const iconPaths = {
  // Shopping and commerce
  'shopping-bag': {
    viewBox: '0 0 24 24',
    path: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0',
  },
  'tag': {
    viewBox: '0 0 24 24',
    path: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01',
  },
  'shirt': {
    viewBox: '0 0 24 24',
    path: 'M20 8l-4-4H8L4 8l2 2v10a2 2 0 002 2h8a2 2 0 002-2V10l2-2zM12 4v6M8 8h8',
  },
  
  // Navigation
  'menu': {
    viewBox: '0 0 24 24',
    path: 'M3 12h18M3 6h18M3 18h18',
  },
  'search': {
    viewBox: '0 0 24 24',
    path: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  'home': {
    viewBox: '0 0 24 24',
    path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-7m-6 0a1 1 0 00-1 1v3',
  },
  
  // User interface
  'check': {
    viewBox: '0 0 24 24',
    path: 'M5 13l4 4L19 7',
  },
  'x': {
    viewBox: '0 0 24 24',
    path: 'M18 6L6 18M6 6l12 12',
  },
  'chevron-down': {
    viewBox: '0 0 24 24',
    path: 'M19 9l-7 7-7-7',
  },
  
  // User
  'user': {
    viewBox: '0 0 24 24',
    path: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 100-8 4 4 0 000 8z',
  },
  'heart': {
    viewBox: '0 0 24 24',
    path: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  },
  
  // Vintage elements
  'stamp': {
    viewBox: '0 0 24 24',
    path: 'M19 5h-7v2h7a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h7V5H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V8a3 3 0 00-3-3zm-7-3h2v4h-2V2zm0 16h2v4h-2v-4z',
  },
  'typewriter': {
    viewBox: '0 0 24 24',
    path: 'M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7M8 12V5a2 2 0 012-2h4a2 2 0 012 2v7m-9 0h14M5 16h.01M9 16h.01M13 16h.01M17 16h.01M4 20h16',
  },
  'camera': {
    viewBox: '0 0 24 24',
    path: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11zM12 13a4 4 0 100-8 4 4 0 000 8z',
  },
};

const VintageIcon = ({
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  ...props
}) => {
  if (!iconPaths[name]) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  const { viewBox, path } = iconPaths[name];
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default VintageIcon;