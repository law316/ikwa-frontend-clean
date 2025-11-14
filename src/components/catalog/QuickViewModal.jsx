import React from 'react';
import { X, Heart, ShoppingCart, Star } from 'lucide-react';

const QuickViewModal = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-black bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl border-4 border-amber-800">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-amber-600 hover:text-amber-800 transition-colors duration-300"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-amber-200">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover filter sepia-[0.2]"
              />
              {product.isNew && (
                <div className="absolute top-3 left-3 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  NEW IN
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Title and Era */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    {product.decade}
                  </span>
                  <span className="text-amber-600 text-sm font-mono">
                    {product.condition}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-amber-900 mb-2">
                  {product.name}
                </h2>
                <p className="text-amber-600 font-mono">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold text-amber-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xl text-amber-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              </div>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-amber-600 font-mono">Style:</span>
                  <p className="text-amber-900 font-medium">{product.style}</p>
                </div>
                <div>
                  <span className="text-amber-600 font-mono">Color:</span>
                  <p className="text-amber-900 font-medium">{product.color}</p>
                </div>
                <div>
                  <span className="text-amber-600 font-mono">Size:</span>
                  <p className="text-amber-900 font-medium">{product.size}</p>
                </div>
                <div>
                  <span className="text-amber-600 font-mono">Condition:</span>
                  <p className="text-amber-900 font-medium">{product.condition}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  className="flex items-center justify-center px-6 py-3 border-2 border-amber-600 text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-300"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  <span>Add to Wishlist</span>
                </button>
              </div>

              {/* Additional Info */}
              <div className="pt-6 border-t-2 border-amber-200">
                <div className="flex items-center space-x-2 text-amber-600 mb-2">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5" />
                  <span className="text-sm font-mono">(4.0)</span>
                </div>
                <p className="text-sm text-amber-600 font-mono">
                  Free shipping on orders over $50
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal; 