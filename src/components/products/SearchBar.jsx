import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ value, onChange, onClear }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onClear();
  };

  return (
    <div className="relative">
      <div
        className={`relative flex items-center border-2 rounded-lg transition-colors duration-300 ${
          isFocused
            ? 'border-amber-600 bg-white'
            : 'border-amber-300 bg-amber-50/50'
        }`}
      >
        <Search
          className={`h-5 w-5 ml-3 transition-colors duration-300 ${
            isFocused ? 'text-amber-600' : 'text-amber-500'
          }`}
        />
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for vintage tees..."
          className="w-full px-3 py-2 bg-transparent text-amber-900 placeholder-amber-500 focus:outline-none font-mono"
        />
        <AnimatePresence>
          {localValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="p-2 text-amber-600 hover:text-amber-700 transition-colors duration-300"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {isFocused && localValue && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border-2 border-amber-200 overflow-hidden z-50"
          >
            <div className="py-2">
              <div className="px-4 py-2">
                <h3 className="text-sm font-medium text-amber-900 mb-2">
                  Popular Searches
                </h3>
                <div className="space-y-1">
                  {['Vintage Band Tees', 'Retro Sports', '80s Rock', '90s Hip Hop'].map(
                    (suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setLocalValue(suggestion);
                          onChange(suggestion);
                        }}
                        className="w-full px-2 py-1 text-left text-sm text-amber-600 hover:bg-amber-50 rounded transition-colors duration-300"
                      >
                        {suggestion}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar; 