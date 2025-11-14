import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Share2,
  Trash2,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';

const WishlistPage = () => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { items: wishlistItems, removeFromWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnTo: location.pathname } });
    }
  }, [user, navigate, location.pathname]);

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      removeFromWishlist(itemId);
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = async (item) => {
    if (!user) {
      const cartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        size: item.sizes?.[0] || 'M',
        color: item.color || 'Default',
        era: item.era,
        quantity: 1
      };
      try {
        localStorage.setItem('pendingCartItem', JSON.stringify(cartItem));
      } catch {}
      toast.error('Please log in to add items to your cart');
      navigate('/login', { state: { returnTo: location.pathname } });
      return;
    }
    
    setIsAddingToCart(true);
    try {
      const cartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        size: item.sizes?.[0] || 'M', // Default to first available size or M
        color: item.color || 'Default',
        era: item.era,
        quantity: 1
      };
      
      await addToCart(cartItem);
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShareWishlist = async () => {
    try {
      // Simulate API call to generate shareable link
      await new Promise((resolve) => setTimeout(resolve, 500));
      const shareUrl = `${window.location.origin}/wishlist/share/123`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'My Lace and Legacy Wishlist',
          text: 'Check out my vintage fashion wishlist!',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Wishlist link copied to clipboard');
      }
    } catch (error) {
      toast.error('Failed to share wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-black font-mono">
            My Wishlist
          </h1>
          <button
            onClick={handleShareWishlist}
            className="inline-flex items-center px-4 py-2 border-2 border-gray-300 rounded-lg text-black hover:border-black transition-colors duration-300"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Wishlist
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-black mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-700 mb-6">
              Start adding items to your wishlist to save them for later
            </p>
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 border-2 border-black rounded-lg text-black hover:bg-black hover:text-white transition-colors duration-300"
            >
              Browse Products
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden"
              >
                <div className="relative">
                  <div className="aspect-w-1 aspect-h-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    disabled={isLoading}
                    className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:text-black transition-colors duration-300"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-black font-mono">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-700">{item.category}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-black">
                      {item.era}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xl font-bold text-black font-mono">
                      ${item.price.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={isAddingToCart}
                      className="inline-flex items-center px-4 py-2 border-2 border-black rounded-lg text-black hover:bg-black hover:text-white transition-colors duration-300"
                    >
                      {isAddingToCart ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-gray-700 mt-2">
                    Added on {new Date(item.addedDate || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;