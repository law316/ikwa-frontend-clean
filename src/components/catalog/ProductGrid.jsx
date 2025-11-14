import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { useUser } from '../../contexts/UserContext';
import QuickViewModal from '../products/QuickViewModal';
import Tooltip from '../ui/Tooltip';

const ProductGrid = ({ products }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: Array.isArray(product.sizes) ? product.sizes[0] : product.size || 'M',
        color: product.color || 'Default',
        era: product.era,
        quantity: 1
      };
      try {
        localStorage.setItem('pendingCartItem', JSON.stringify(cartItem));
      } catch {}
      addToast({ message: 'Please log in to add items to your cart', type: 'error' });
      navigate('/login', { state: { returnTo: location.pathname } });
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: Array.isArray(product.sizes) ? product.sizes[0] : product.size || 'M',
      color: product.color || 'Default',
      era: product.era,
      quantity: 1
    };
    addToCart(cartItem);
    addToast({
      message: `${product.name} added to cart`,
      type: 'success'
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-amber-200"
        >
          <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square">
            {product.isNew && (
              <div className="absolute top-3 left-3 z-10 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                NEW IN
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter sepia-[0.1] group-hover:sepia-[0.3]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-3">
                <button className="bg-white text-amber-800 p-2 rounded-full hover:bg-amber-100 transition-colors duration-300">
                  <Heart className="h-5 w-5" />
                </button>
                <Tooltip content="Quick View Product Details" side="top">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                    className="bg-white text-amber-800 p-2 rounded-full hover:bg-amber-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    aria-label="Quick View Product Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </Tooltip>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(product);
                  }}
                  className="bg-white text-amber-800 p-2 rounded-full hover:bg-amber-100 transition-colors duration-300"
                >
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Link>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                {product.decade}
              </span>
              <span className="text-amber-600 text-sm font-mono">
                {product.condition}
              </span>
            </div>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                {product.name}
              </h3>
            </Link>
            <p className="text-amber-600 text-sm mb-3 font-mono">
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

export default ProductGrid;