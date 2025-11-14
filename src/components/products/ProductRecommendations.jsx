import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockProducts } from '../../data/mockProducts';

const ProductRecommendations = ({ currentProductId, category }) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Filter out current product and get related products
  const relatedProducts = mockProducts
    .filter(
      (product) =>
        product.id !== currentProductId &&
        (product.category === category || product.era === category)
    )
    .slice(0, 8);

  const productsPerPage = 4;
  const totalPages = Math.ceil(relatedProducts.length / productsPerPage);
  const currentProducts = relatedProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-amber-900 font-mono">
          Similar Vintage Finds
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="p-2 rounded-lg border-2 border-amber-300 text-amber-600 hover:border-amber-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="p-2 rounded-lg border-2 border-amber-300 text-amber-600 hover:border-amber-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white rounded-xl shadow-lg border-2 border-amber-200 overflow-hidden"
          >
            <Link to={`/products/${product.id}`}>
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply" />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-medium text-amber-900 font-mono line-clamp-1">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xl font-bold text-amber-900 font-mono">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-900 rounded-full">
                    {product.era}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Pagination Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                currentPage === index
                  ? 'bg-amber-600'
                  : 'bg-amber-300 hover:bg-amber-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductRecommendations; 