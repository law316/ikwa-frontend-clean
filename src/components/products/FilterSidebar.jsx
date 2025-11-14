import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const FilterSidebar = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const filterGroups = [
    {
      title: 'Era',
      key: 'eras',
      options: ['60s', '70s', '80s', '90s', '2000s'],
    },
    {
      title: 'Condition',
      key: 'conditions',
      options: ['New', 'Like New', 'Excellent', 'Good', 'Fair'],
    },
    {
      title: 'Size',
      key: 'sizes',
      options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      title: 'Price Range',
      key: 'priceRange',
      options: [
        'Under $25',
        '$25 - $50',
        '$50 - $100',
        '$100 - $200',
        'Over $200',
      ],
    },
    {
      title: 'Style',
      key: 'styles',
      options: [
        'Vintage',
        'Retro',
        'Classic',
        'Streetwear',
        'Athletic',
        'Other',
      ],
    },
  ];

  const sidebarVariants = {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  };

  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <>
      {/* Mobile Overlay - Only show on mobile */}
      <motion.div
        initial="initial"
        animate={isOpen ? 'animate' : 'exit'}
        variants={overlayVariants}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
        style={{ zIndex: 40 }}
      />

      {/* Sidebar */}
      <div className="lg:relative lg:top-auto lg:left-auto lg:h-auto lg:w-full lg:max-w-none lg:shadow-none lg:z-auto">
        <motion.div
          initial="initial"
          animate={isOpen ? 'animate' : 'exit'}
          variants={sidebarVariants}
          className="fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-xl z-50 overflow-y-auto lg:relative lg:top-auto lg:left-auto lg:h-auto lg:w-full lg:max-w-none lg:shadow-none lg:z-auto lg:transform-none"
          style={{ zIndex: 45, marginTop: '80px' }}
        >
          <div className="p-6 lg:p-4 lg:border-2 lg:border-gray-200 lg:rounded-xl lg:bg-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-amber-900 font-mono lg:text-xl">
              Filters
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-amber-600 hover:text-amber-700 transition-colors duration-300 lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Filter Groups */}
          <div className="space-y-6">
            {filterGroups.map((group) => (
              <div key={group.key} className="border-b border-amber-200 pb-6">
                <h3 className="text-lg font-medium text-amber-900 mb-4">
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name={group.key}
                        checked={filters[group.key] === option}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onFilterChange(group.key, option);
                          }
                        }}
                        className="w-4 h-4 border-2 border-amber-300 text-amber-600 focus:ring-amber-600 focus:ring-offset-0 transition-colors duration-300"
                      />
                      <span className="text-amber-900 group-hover:text-amber-700 transition-colors duration-300">
                        {option}
                      </span>
                    </label>
                  ))}
                  {/* Clear option for this category */}
                  {filters[group.key] && (
                    <button
                      onClick={() => onFilterChange(group.key, null)}
                      className="text-sm text-amber-600 hover:text-amber-700 ml-7 transition-colors duration-300"
                    >
                      Clear {group.title}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={onClearFilters}
            className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border-2 border-amber-600 rounded-lg text-amber-900 hover:bg-amber-600 hover:text-white transition-colors duration-300"
          >
            Clear All Filters
          </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default FilterSidebar;