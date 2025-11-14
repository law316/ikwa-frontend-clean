import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg border-2 transition-colors duration-300 ${
          currentPage === 1
            ? 'border-amber-200 text-amber-300 cursor-not-allowed'
            : 'border-amber-300 text-amber-600 hover:border-amber-600'
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* First Page */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded-lg border-2 border-amber-300 text-amber-600 hover:border-amber-600 transition-colors duration-300 font-mono"
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="px-2 text-amber-600">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <motion.button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg border-2 font-mono transition-colors duration-300 ${
            currentPage === page
              ? 'bg-amber-600 border-amber-600 text-white'
              : 'border-amber-300 text-amber-600 hover:border-amber-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {page}
        </motion.button>
      ))}

      {/* Last Page */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2 text-amber-600">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 rounded-lg border-2 border-amber-300 text-amber-600 hover:border-amber-600 transition-colors duration-300 font-mono"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg border-2 transition-colors duration-300 ${
          currentPage === totalPages
            ? 'border-amber-200 text-amber-300 cursor-not-allowed'
            : 'border-amber-300 text-amber-600 hover:border-amber-600'
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination; 