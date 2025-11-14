import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import QuickViewModal from '../products/QuickViewModal';
import Tooltip from '../ui/Tooltip';

const ProductList = ({ products }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToCart = (product) => {
    addToCart(product);
    addToast({
      message: `${product.name} added to cart`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-amber-200"
        >
          <Link to={`/product/${product.id}`} className="md:w-1/3 relative overflow-hidden aspect-square">
            {product.isNew && (
              <div className="absolute top-3 left-3 z-10 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                NEW IN
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 filter sepia-[0.1] hover:sepia-[0.3]"
            />
          </Link>
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                {product.decade}
              </span>
              <span className="text-amber-600 text-sm font-mono">
                {product.condition}
              </span>
            </div>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-xl font-bold text-amber-900 mb-2">
                {product.name}
              </h3>
            </Link>
            <p className="text-amber-600 text-sm mb-4 font-mono">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-amber-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-amber-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-white text-amber-800 p-2 rounded-full hover:bg-black hover:text-white transition-colors duration-300 border-2 border-amber-200">
                  <Heart className="h-5 w-5" />
                </button>
                <Tooltip content="Quick View Product Details" side="top">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                    className="bg-white text-amber-800 p-2 rounded-full hover:bg-black hover:text-white transition-colors duration-300 border-2 border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    aria-label="Quick View Product Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </Tooltip>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <QuickViewModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;