import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { productService } from '../../services/api';
import { toast } from 'react-hot-toast';

const FilterSidebar = ({ isOpen, onClose, filters, onChange, onClear }) => {
  const [openSections, setOpenSections] = useState({
    size: true,
    color: true,
    price: true,
    decade: true,
    style: true,
    condition: true
  });

  const [filterOptions, setFilterOptions] = useState({
    sizes: [],
    colors: [],
    decades: [],
    styles: [],
    conditions: []
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    setIsLoading(true);
    try {
      const response = await productService.getFilters();
      setFilterOptions(response.data);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load filter options';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (category, value) => {
    const newFilters = { ...filters };
    if (newFilters[category].includes(value)) {
      newFilters[category] = newFilters[category].filter(item => item !== value);
    } else {
      newFilters[category] = [...newFilters[category], value];
    }
    onChange(newFilters);
  };

  const handlePriceChange = (type, value) => {
    const newFilters = { ...filters };
    newFilters.priceRange[type] = Number(value);
    onChange(newFilters);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 lg:shadow-none`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b-4 border-amber-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-amber-900">Filters</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={onClear}
                className="text-amber-600 hover:text-amber-800 text-sm font-medium"
              >
                Clear all
              </button>
              <button
                onClick={onClose}
                className="lg:hidden text-amber-600 hover:text-amber-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Sections */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Size Filter */}
          <div className="border-b-2 border-amber-200 pb-4">
            <button
              onClick={() => toggleSection('size')}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-bold text-amber-900">Size</h3>
              {openSections.size ? (
                <ChevronUp className="w-5 h-5 text-amber-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-amber-600" />
              )}
            </button>
            {openSections.size && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {filterOptions.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFilterChange('size', size)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      filters.size.includes(size)
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Filter */}
          <div className="border-b-2 border-amber-200 pb-4">
            <button
              onClick={() => toggleSection('color')}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-bold text-amber-900">Color</h3>
              {openSections.color ? (
                <ChevronUp className="w-5 h-5 text-amber-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-amber-600" />
              )}
            </button>
            {openSections.color && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {filterOptions.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleFilterChange('color', color)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      filters.color.includes(color)
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="border-b-2 border-amber-200 pb-4">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-bold text-amber-900">Price Range</h3>
              {openSections.price ? (
                <ChevronUp className="w-5 h-5 text-amber-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-amber-600" />
              )}
            </button>
            {openSections.price && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm text-amber-600 mb-1">Min</label>
                    <input
                      type="number"
                      value={filters.priceRange.min}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-600 transition-colors duration-300"
                      min="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-amber-600 mb-1">Max</label>
                    <input
                      type="number"
                      value={filters.priceRange.max}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-600 transition-colors duration-300"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Decade Filter */}
          <div className="border-b-2 border-amber-200 pb-4">
            <button
              onClick={() => toggleSection('decade')}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-bold text-amber-900">Decade</h3>
              {openSections.decade ? (
                <ChevronUp className="w-5 h-5 text-amber-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-amber-600" />
              )}
            </button>
            {openSections.decade && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {filterOptions.decades.map((decade) => (
                  <button
                    key={decade}
                    onClick={() => handleFilterChange('decade', decade)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      filters.decade.includes(decade)
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {decade}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Style Filter */}
          <div className="border-b-2 border-amber-200 pb-4">
            <button
              onClick={() => toggleSection('style')}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-bold text-amber-900">Style</h3>
              {openSections.style ? (
                <ChevronUp className="w-5 h-5 text-amber-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-amber-600" />
              )}
            </button>
            {openSections.style && (
              <div className="mt-4 space-y-2">
                {filterOptions.styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => handleFilterChange('style', style)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      filters.style.includes(style)
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Condition Filter */}
          <div className="border-b-2 border-amber-200 pb-4">
            <button
              onClick={() => toggleSection('condition')}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-bold text-amber-900">Condition</h3>
              {openSections.condition ? (
                <ChevronUp className="w-5 h-5 text-amber-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-amber-600" />
              )}
            </button>
            {openSections.condition && (
              <div className="mt-4 space-y-2">
                {filterOptions.conditions.map((condition) => (
                  <button
                    key={condition}
                    onClick={() => handleFilterChange('condition', condition)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      filters.condition.includes(condition)
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar; 