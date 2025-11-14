import React from 'react';
import { motion } from 'framer-motion';

const buttonVariants = {
  primary: 'bg-brown-medium hover:bg-black hover:text-white text-white',
  secondary: 'bg-cream-medium hover:bg-black hover:text-white text-brown-darkest border border-brown-medium',
  vintage: 'vintage-border bg-cream-light hover:bg-black hover:text-white text-brown-darkest font-mono tracking-vintage',
  link: 'text-blue-vintage hover:bg-black hover:text-white underline px-2 py-1 rounded',
};

const sizeVariants = {
  sm: 'py-1 px-3 text-sm',
  md: 'py-2 px-4 text-base',
  lg: 'py-3 px-6 text-lg',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ariaLabel,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-medium';
  const variantClasses = buttonVariants[variant] || buttonVariants.primary;
  const sizeClasses = sizeVariants[size] || sizeVariants.md;
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || children}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;