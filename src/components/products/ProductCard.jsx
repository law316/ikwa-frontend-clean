import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useUser } from '../../contexts/UserContext';
import Tooltip from '../ui/Tooltip';

const ProductCard = ({ product, viewMode, onQuickView }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, isLoading } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isWishlisted = isInWishlist(product.id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please log in to manage your wishlist');
      navigate('/login', { state: { returnTo: location.pathname } });
      return;
    }
    
    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Persist pending cart item so it can be added after login
      const pendingItem = {
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
        localStorage.setItem('pendingCartItem', JSON.stringify(pendingItem));
      } catch {}
      toast.error('Please log in to add items to your cart');
      navigate('/login', { state: { returnTo: location.pathname } });
      return;
    }
    
    if (isAdding || isLoading) return;
    
    setIsAdding(true);
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: Array.isArray(product.sizes) ? product.sizes[0] : product.size,
        color: product.color || 'Default',
        era: product.era,
        quantity: 1
      };
      
      await addToCart(cartItem);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error('Cart error:', error);
    } finally {
      setIsAdding(false);
    }
  };
  
  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView();
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -5 }
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={cardVariants}
        className="group relative bg-white rounded-xl shadow-lg border-2 border-amber-200 overflow-hidden"
      >
        <Link to={`/products/${product.id}`} className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4">
          <div className="w-full sm:w-48 h-48 flex-shrink-0">
            <motion.div
              variants={imageVariants}
              className="w-full h-full relative overflow-hidden rounded-lg"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply" />
            </motion.div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-amber-900 font-mono truncate">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-amber-600 line-clamp-2">
                  {product.description}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <Tooltip content={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"} side="top">
                  <button
                    onClick={handleWishlist}
                    className={`p-2 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                      isWishlisted
                        ? 'text-red-500 hover:bg-black hover:text-white'
                        : 'text-amber-600 hover:bg-black hover:text-white'
                    }`}
                    aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isWishlisted ? 'fill-current' : ''
                      }`}
                    />
                  </button>
                </Tooltip>
                <Tooltip content="Quick View Product Details" side="top">
                  <button
                    onClick={handleQuickView}
                    className="p-2 rounded-lg text-amber-600 hover:bg-black hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    aria-label="Quick View Product Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </Tooltip>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-xl font-bold text-amber-900 font-mono">
                ${product.price.toFixed(2)}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded-full">
                {product.era}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded-full">
                {product.condition}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {Array.isArray(product.sizes) ? (
                product.sizes.map(size => (
                  <span
                    key={size}
                    className="px-2 py-1 text-xs font-medium border-2 border-amber-300 text-amber-900 rounded-full"
                  >
                    {size}
                  </span>
                ))
              ) : (
                <span className="px-2 py-1 text-xs font-medium border-2 border-amber-300 text-amber-900 rounded-full">
                  {product.size}
                </span>
              )}
            </div>

            <div className="mt-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || isLoading || !product.inStock}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border-2 border-amber-600 rounded-lg text-amber-900 hover:bg-black hover:text-white hover:border-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-amber-900 disabled:hover:border-amber-600"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.inStock !== false ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={cardVariants}
      className="group relative bg-white rounded-xl shadow-lg border-2 border-amber-200 overflow-hidden"
    >
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <motion.div
            variants={imageVariants}
            className="w-full h-full"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply" />
          </motion.div>

          {/* Quick Actions */}
          <div
            className="absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 opacity-100"
          >
            <Tooltip content={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"} side="left">
              <button
                onClick={handleWishlist}
                className={`p-2 rounded-lg bg-white/90 backdrop-blur-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                  isWishlisted
                    ? 'text-red-500 hover:bg-black hover:text-white'
                    : 'text-amber-600 hover:bg-black hover:text-white'
                }`}
                aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? 'fill-current' : ''
                  }`}
                />
              </button>
            </Tooltip>
            <Tooltip content="Quick View Product Details" side="left">
              <button
                onClick={handleQuickView}
                className="p-2 rounded-lg bg-white/90 backdrop-blur-sm text-amber-600 hover:bg-black hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                aria-label="Quick View Product Details"
              >
                <Eye className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>

          {/* Era Badge */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded-full backdrop-blur-sm">
              {product.era}
            </span>
          </div>

          {/* Condition Badge */}
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded-full backdrop-blur-sm">
              {product.condition}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-medium text-amber-900 font-mono line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-amber-600 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-bold text-amber-900 font-mono">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1">
              {Array.isArray(product.sizes) ? (
                product.sizes.map(size => (
                  <span
                    key={size}
                    className="px-2 py-1 text-xs font-medium border-2 border-amber-300 text-amber-900 rounded-full"
                  >
                    {size}
                  </span>
                ))
              ) : (
                <span className="px-2 py-1 text-xs font-medium border-2 border-amber-300 text-amber-900 rounded-full">
                  {product.size}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm transition-transform duration-300 translate-y-0"
      >
        <button
          onClick={handleAddToCart}
          disabled={isAdding || isLoading || !product.inStock}
          className="w-full inline-flex items-center justify-center px-3 py-2 border-2 border-amber-600 rounded-lg text-amber-900 hover:bg-black hover:text-white hover:border-black transition-colors duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-amber-900 disabled:hover:border-amber-600"
        >
          {isAdding ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock !== false ? 'Add to Cart' : 'Out of Stock'}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;