import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const {
    items,
    total,
    isOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const navigate = useNavigate();

  const handleClose = () => toggleCart();
  const handleViewCart = () => {
    toggleCart();
    navigate('/cart');
  };
  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-[1000]"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white z-[1001] shadow-xl border-l-2 border-amber-200 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-amber-700" />
                <h2 className="text-lg font-semibold text-amber-900">Your Cart</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded hover:bg-amber-50"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-amber-700 mb-3">Your cart is empty.</p>
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 border-2 border-amber-600 text-amber-900 rounded hover:bg-black hover:text-white hover:border-black transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.cartId || item.id}
                    className="flex gap-3 items-center p-3 border-2 border-amber-200 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain bg-white rounded-md border"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-900 line-clamp-2">{item.name}</p>
                      <p className="text-amber-700 text-sm">${Number(item.price).toFixed(2)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.cartId || item.id, Math.max(1, (item.quantity || 1) - 1))}
                          className="p-1 rounded hover:bg-amber-50"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-2 py-1 text-sm border rounded">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(item.cartId || item.id, (item.quantity || 1) + 1)}
                          className="p-1 rounded hover:bg-amber-50"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.cartId || item.id)}
                          className="ml-auto p-1 text-red-600 hover:bg-red-50 rounded"
                          aria-label="Remove from cart"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-700">Subtotal</span>
                <span className="text-lg font-semibold text-amber-900">${Number(total).toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleViewCart}
                  className="flex-1 px-4 py-2 border-2 border-amber-600 text-amber-900 rounded hover:bg-black hover:text-white hover:border-black transition-colors"
                >
                  View Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                >
                  Checkout
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;