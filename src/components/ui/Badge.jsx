import React from 'react';
import { motion } from 'framer-motion';

const badgeVariants = {
  default: 'bg-amber-100 text-amber-900 border-amber-200',
  secondary: 'bg-gray-100 text-gray-900 border-gray-200',
  destructive: 'bg-red-100 text-red-900 border-red-200',
  outline: 'border-amber-300 text-amber-900 bg-transparent hover:bg-amber-50',
  success: 'bg-green-100 text-green-900 border-green-200',
};

const sizeVariants = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full border transition-colors duration-300';
  const variantClasses = badgeVariants[variant] || badgeVariants.default;
  const sizeClasses = sizeVariants[size] || sizeVariants.md;
  const clickableClasses = onClick ? 'cursor-pointer hover:opacity-80' : '';
  
  const Component = onClick ? motion.button : motion.span;
  
  return (
    <Component
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Badge;