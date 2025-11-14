import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'react-hot-toast';

const ProductGrid = ({ products, onLoadMore }) => {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize intersection observer for infinite scroll
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading]);

  // Load initial products
  useEffect(() => {
    setVisibleProducts(products.slice(0, 8));
  }, [products]);

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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <AnimatePresence>
        {visibleProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-amber-200"
          >
            <Link to={`/product/${product.id}`} className="block">
              <div className="relative overflow-hidden aspect-square">
                {product.isNew && (
                  <div className="absolute top-3 left-3 z-10 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    NEW IN
                  </div>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter sepia-[0.1] group-hover:sepia-[0.3]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-3">
                    <button 
                      className="bg-white text-amber-800 p-3 rounded-full hover:bg-black hover:text-white transition-colors duration-300 touch-manipulation"
                      onClick={(e) => {
                        e.preventDefault();
                        // Add to wishlist logic
                      }}
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                    <button 
                      className="bg-white text-amber-800 p-3 rounded-full hover:bg-black hover:text-white transition-colors duration-300 touch-manipulation"
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
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                    {product.decade}
                  </span>
                  <span className="text-amber-600 text-sm font-mono">
                    {product.condition}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-amber-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-amber-600 text-sm mb-3 font-mono line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-amber-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-amber-500 line-through text-sm">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Loading Indicator */}
      <div
        ref={loadingRef}
        className="col-span-full flex justify-center py-8"
      >
        {isLoading && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
        )}
      </div>
    </div>
  );
};

export default ProductGrid;