import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  vintage = false,
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition-all duration-300';
  const normalClasses = 'border-gray-medium focus:border-brown-medium focus:ring-brown-light/30 bg-white';
  const vintageClasses = 'vintage-border font-mono tracking-wide bg-cream-lightest focus:ring-brown-light/30';
  const errorClasses = 'border-accent-red focus:border-accent-red focus:ring-accent-red/30';
  const disabledClasses = 'opacity-50 cursor-not-allowed bg-gray-lightest';
  
  const inputClasses = `
    ${baseClasses} 
    ${error ? errorClasses : vintage ? vintageClasses : normalClasses} 
    ${disabled ? disabledClasses : ''} 
    ${className}
  `;
  
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className={`block mb-2 font-medium ${vintage ? 'font-mono tracking-wide' : ''} ${error ? 'text-accent-red' : 'text-brown-darkest'}`}
        >
          {label}
          {required && <span className="text-accent-red ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-accent-red">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;