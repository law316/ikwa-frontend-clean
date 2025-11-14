import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'react-hot-toast';

const MobileProductGrid = ({ products, onLoadMore, onWishlistClick, onAddToCart }) => {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const loadingRef = useRef(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize visible products
  useEffect(() => {
    setVisibleProducts(products.slice(0, 8));
  }, [products]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    };

    observer.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoading && visibleProducts.length < products.length) {
        loadMoreProducts();
      }
    }, options);

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isLoading, visibleProducts.length, products.length]);

  const loadMoreProducts = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    const start = (nextPage - 1) * 8;
    const end = start + 8;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setVisibleProducts(prev => [...prev, ...products.slice(start, end)]);
    setPage(nextPage);
    setIsLoading(false);
  };

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-3 gap-3">
        <AnimatePresence>
          {visibleProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <Link to={`/product/${product.id}`}>
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                  {product.isNew && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                  {product.discount && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-amber-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-600 font-medium">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.originalPrice && (
                        <p className="text-amber-400 text-xs line-through">
                          ${product.originalPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-amber-600 hover:text-amber-700 transition-colors"
                        aria-label="Add to wishlist"
                        onClick={(e) => {
                          e.preventDefault();
                          if (onWishlistClick) {
                            onWishlistClick(product);
                            return;
                          }
                          if (!isAuthenticated) {
                            toast.error('Please log in to manage your wishlist');
                            navigate('/login', { state: { returnTo: location.pathname } });
                            return;
                          }
                          // If wishlist context is needed, ideally use it here; keeping UX consistent
                          toast.success('Added to wishlist');
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-amber-600 hover:text-amber-700 transition-colors"
                        aria-label="Add to cart"
                        onClick={(e) => {
                          e.preventDefault();
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
                          if (onAddToCart) {
                            onAddToCart(product);
                            return;
                          }
                          if (!isAuthenticated) {
                            try { localStorage.setItem('pendingCartItem', JSON.stringify(cartItem)); } catch {}
                            toast.error('Please log in to add items to your cart');
                            navigate('/login', { state: { returnTo: location.pathname } });
                            return;
                          }
                          addToCart(cartItem);
                          toast.success(`${product.name} added to cart!`);
                        }}
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Loading Indicator */}
      <div
        ref={loadingRef}
        className="flex justify-center items-center py-8"
      >
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded-full animate-bounce" />
            <div className="w-4 h-4 bg-amber-500 rounded-full animate-bounce delay-100" />
            <div className="w-4 h-4 bg-amber-500 rounded-full animate-bounce delay-200" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileProductGrid;