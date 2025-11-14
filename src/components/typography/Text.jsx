import React from 'react';

const Text = ({
  children,
  variant = 'body',
  as,
  className = '',
  ...props
}) => {
  const variantClasses = {
    body: 'text-base font-sans text-black',
    lead: 'text-lg font-sans text-black leading-relaxed',
    small: 'text-sm font-sans text-gray-dark',
    vintage: 'font-mono tracking-vintage text-brown-dark',
    display: 'font-display text-brown-darkest tracking-wide',
    caption: 'text-sm font-sans text-gray-dark italic',
  };
  
  const Component = as || (
    variant === 'lead' ? 'p' :
    variant === 'small' ? 'span' :
    variant === 'vintage' ? 'span' :
    variant === 'display' ? 'p' :
    variant === 'caption' ? 'span' : 'p'
  );
  
  return (
    <Component 
      className={`${variantClasses[variant] || variantClasses.body} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;