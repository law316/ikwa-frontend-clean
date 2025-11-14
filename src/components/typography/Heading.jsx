import React from 'react';

const Heading = ({
  children,
  level = 1,
  vintage = false,
  className = '',
  ...props
}) => {
  const Component = `h${level}`;
  
  const baseClasses = 'font-bold text-brown-darkest';
  const vintageClasses = vintage ? 'vintage-title' : 'font-serif';
  
  const sizeClasses = {
    1: 'text-5xl md:text-6xl',
    2: 'text-4xl md:text-5xl',
    3: 'text-3xl md:text-4xl',
    4: 'text-2xl md:text-3xl',
    5: 'text-xl md:text-2xl',
    6: 'text-lg md:text-xl',
  }[level] || 'text-5xl md:text-6xl';
  
  return (
    <Component 
      className={`${baseClasses} ${vintageClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Heading;