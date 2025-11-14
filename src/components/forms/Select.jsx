import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  value,
  onValueChange,
  placeholder = 'Select an option',
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedValue) => {
    onValueChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <SelectTrigger
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        isOpen={isOpen}
      >
        <SelectValue value={value} placeholder={placeholder} />
      </SelectTrigger>
      
      {isOpen && (
        <SelectContent>
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onSelect: handleSelect,
              selectedValue: value
            })
          )}
        </SelectContent>
      )}
    </div>
  );
};

const SelectTrigger = ({ children, onClick, disabled, isOpen, className = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between px-4 py-2 border-2 border-amber-300 rounded-lg bg-white text-amber-900 hover:border-amber-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
      <ChevronDown
        className={`h-4 w-4 transition-transform duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
  );
};

const SelectValue = ({ value, placeholder }) => {
  return (
    <span className="font-mono">
      {value || placeholder}
    </span>
  );
};

const SelectContent = ({ children, className = '' }) => {
  return (
    <div className={`absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border-2 border-amber-200 overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

const SelectItem = ({ value, children, onSelect, selectedValue }) => {
  const isSelected = selectedValue === value;
  
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`w-full px-4 py-2 text-left hover:bg-amber-50 transition-colors duration-300 flex items-center justify-between ${
        isSelected ? 'bg-amber-100 text-amber-900 font-medium' : 'text-amber-900'
      }`}
    >
      {children}
    </button>
  );
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
export default Select;