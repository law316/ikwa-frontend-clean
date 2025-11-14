import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';

const sortOptions = [
  { label: 'Price', value: 'price' },
  { label: 'Newest', value: 'dateAdded' },
  { label: 'Era', value: 'decade' },
];

const SortDropdown = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSort = (option) => {
    const [field, direction] = value.split('-');
    const newDirection = field === option ? (direction === 'asc' ? 'desc' : 'asc') : 'asc';
    onChange(`${option}-${newDirection}`);
    setIsOpen(false);
  };

  const [currentField, currentDirection] = value.split('-');
  const currentOption = sortOptions.find(opt => opt.value === currentField);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 border-2 border-amber-300 rounded-lg hover:border-amber-600 transition-colors duration-300 font-mono bg-white"
      >
        <span className="text-amber-900">Sort by: {currentOption?.label}</span>
        {currentDirection === 'asc' ? (
          <ArrowUp className="w-4 h-4 text-amber-600" />
        ) : (
          <ArrowDown className="w-4 h-4 text-amber-600" />
        )}
        <ChevronDown className="w-4 h-4 text-amber-600" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border-2 border-amber-200 overflow-hidden">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSort(option.value)}
              className="w-full px-4 py-2 text-left hover:bg-amber-50 transition-colors duration-300 flex items-center justify-between"
            >
              <span className="text-amber-900">{option.label}</span>
              {currentField === option.value && (
                currentDirection === 'asc' ? (
                  <ArrowUp className="w-4 h-4 text-amber-600" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-amber-600" />
                )
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;