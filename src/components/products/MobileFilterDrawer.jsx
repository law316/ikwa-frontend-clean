import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, ChevronDown, ChevronUp } from 'lucide-react';

const MobileFilterDrawer = ({ isOpen, onClose, onApplyFilters }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [filters, setFilters] = useState({
    price: [0, 200],
    categories: [],
    eras: [],
    sizes: [],
    colors: [],
  });

  const filterSections = [
    {
      title: 'Price Range',
      type: 'range',
      min: 0,
      max: 200,
      step: 10,
      value: filters.price,
      onChange: (value) => setFilters({ ...filters, price: value }),
    },
    {
      title: 'Categories',
      type: 'checkbox',
      options: ['T-Shirts', 'Hoodies', 'Sweatshirts', 'Accessories'],
      value: filters.categories,
      onChange: (value) => setFilters({ ...filters, categories: value }),
    },
    {
      title: 'Eras',
      type: 'checkbox',
      options: ['70s', '80s', '90s'],
      value: filters.eras,
      onChange: (value) => setFilters({ ...filters, eras: value }),
    },
    {
      title: 'Sizes',
      type: 'checkbox',
      options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      value: filters.sizes,
      onChange: (value) => setFilters({ ...filters, sizes: value }),
    },
    {
      title: 'Colors',
      type: 'color',
      options: [
        { name: 'Black', value: '#000000' },
        { name: 'White', value: '#FFFFFF' },
        { name: 'Red', value: '#FF0000' },
        { name: 'Blue', value: '#0000FF' },
        { name: 'Green', value: '#00FF00' },
      ],
      value: filters.colors,
      onChange: (value) => setFilters({ ...filters, colors: value }),
    },
  ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      price: [0, 200],
      categories: [],
      eras: [],
      sizes: [],
      colors: [],
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed bottom-0 left-0 right-0 bg-amber-50 rounded-t-2xl z-40 max-h-[80vh] overflow-y-auto"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-amber-900" />
                  <h2 className="text-xl font-bold text-amber-900 font-mono">
                    Filters
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-amber-900 hover:text-amber-700 transition-colors"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Filter Sections */}
              <div className="space-y-4">
                {filterSections.map((section) => (
                  <div
                    key={section.title}
                    className="border-b border-amber-200 last:border-0 pb-4"
                  >
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="w-full flex items-center justify-between py-2"
                    >
                      <span className="font-medium text-amber-900">
                        {section.title}
                      </span>
                      {expandedSection === section.title ? (
                        <ChevronUp className="h-5 w-5 text-amber-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-amber-600" />
                      )}
                    </button>

                    {expandedSection === section.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4"
                      >
                        {section.type === 'range' && (
                          <div className="px-2">
                            <input
                              type="range"
                              min={section.min}
                              max={section.max}
                              step={section.step}
                              value={section.value[1]}
                              onChange={(e) =>
                                section.onChange([
                                  section.value[0],
                                  parseInt(e.target.value),
                                ])
                              }
                              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between mt-2 text-sm text-amber-600">
                              <span>${section.value[0]}</span>
                              <span>${section.value[1]}</span>
                            </div>
                          </div>
                        )}

                        {section.type === 'checkbox' && (
                          <div className="grid grid-cols-2 gap-2">
                            {section.options.map((option) => (
                              <label
                                key={option}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-amber-100 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={section.value.includes(option)}
                                  onChange={(e) => {
                                    const newValue = e.target.checked
                                      ? [...section.value, option]
                                      : section.value.filter(
                                          (item) => item !== option
                                        );
                                    section.onChange(newValue);
                                  }}
                                  className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                                />
                                <span className="text-amber-900">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {section.type === 'color' && (
                          <div className="flex flex-wrap gap-2">
                            {section.options.map((color) => (
                              <button
                                key={color.name}
                                onClick={() => {
                                  const newValue = section.value.includes(
                                    color.value
                                  )
                                    ? section.value.filter(
                                        (item) => item !== color.value
                                      )
                                    : [...section.value, color.value];
                                  section.onChange(newValue);
                                }}
                                className={`w-8 h-8 rounded-full border-2 ${
                                  section.value.includes(color.value)
                                    ? 'border-amber-600'
                                    : 'border-transparent'
                                }`}
                                style={{ backgroundColor: color.value }}
                                aria-label={color.name}
                              />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 px-4 border-2 border-amber-300 rounded-lg text-amber-900 hover:border-amber-600 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 py-3 px-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileFilterDrawer;