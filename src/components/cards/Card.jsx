import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  normal: 'bg-white border border-gray-light shadow-md',
  vintage: 'vintage-border vintage-bg',
  flat: 'bg-cream-light border border-gray-light',
};

const Card = ({
  children,
  variant = 'normal',
  className = '',
  onClick,
  animate = false,
  ...props
}) => {
  const baseClasses = 'rounded-lg overflow-hidden';
  const variantClasses = cardVariants[variant] || cardVariants.normal;
  const clickableClasses = onClick ? 'cursor-pointer transition-transform hover:scale-[1.01]' : '';
  
  const cardClasses = `${baseClasses} ${variantClasses} ${clickableClasses} ${className}`;
  
  const CardComponent = animate ? motion.div : 'div';
  const animateProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};
  
  return (
    <CardComponent
      className={cardClasses}
      onClick={onClick}
      {...animateProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-4 border-b border-gray-light ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-4 border-t border-gray-light ${className}`} {...props}>
    {children}
  </div>
);

export default Card;