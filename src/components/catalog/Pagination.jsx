import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  className = '',
}) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const itemsPerPageOptions = [12, 24, 36, 48];

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    if (totalPages <= 7) return pageNumbers;
    
    const pages = [];
    if (currentPage <= 4) {
      pages.push(...pageNumbers.slice(0, 5), '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', ...pageNumbers.slice(totalPages - 5));
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}>
      {/* Items per page selector */}
      <div className="flex items-center space-x-2">
        <span className="text-amber-900 font-mono">Show:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-2 py-1 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-600 transition-colors duration-300 font-mono bg-white text-amber-900"
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option} items
            </option>
          ))}
        </select>
      </div>

      {/* Page numbers */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border-2 border-amber-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-600 transition-colors duration-300"
        >
          <ChevronLeft className="w-5 h-5 text-amber-600" />
        </button>

        {getVisiblePages().map((page, index) => (
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-1 text-amber-600 font-mono"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 border-2 rounded-lg font-mono transition-colors duration-300 ${
                currentPage === page
                  ? 'border-amber-600 bg-amber-600 text-white'
                  : 'border-amber-300 text-amber-900 hover:border-amber-600'
              }`}
            >
              {page}
            </button>
          )
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border-2 border-amber-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-600 transition-colors duration-300"
        >
          <ChevronRight className="w-5 h-5 text-amber-600" />
        </button>
      </div>
    </div>
  );
};

export default Pagination; 