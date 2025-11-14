import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { mockProducts } from '../../data/mockProducts';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [typewriterText, setTypewriterText] = useState('');
  const searchRef = useRef(null);

  // Typewriter effect for placeholder
  useEffect(() => {
    const placeholder = "Search for vintage tees...";
    let i = 0;
    let isDeleting = false;
    let timer;

    const type = () => {
      if (isDeleting) {
        setTypewriterText(prev => prev.slice(0, -1));
        i--;
      } else {
        setTypewriterText(placeholder.slice(0, i + 1));
        i++;
      }

      if (!isDeleting && i === placeholder.length) {
        isDeleting = true;
        timer = setTimeout(type, 2000);
      } else if (isDeleting && i === 0) {
        isDeleting = false;
        timer = setTimeout(type, 500);
      } else {
        timer = setTimeout(type, isDeleting ? 50 : 100);
      }
    };

    if (!searchQuery && !isFocused) {
      timer = setTimeout(type, 1000);
    }

    return () => clearTimeout(timer);
  }, [searchQuery, isFocused]);

  // Handle search suggestions
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = mockProducts
        .filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for vintage tees..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-amber-200 focus:border-amber-600 focus:outline-none bg-white text-amber-900 placeholder-amber-400"
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
    </div>
  );
};

export default SearchBar; 