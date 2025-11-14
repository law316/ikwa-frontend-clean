import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { cartService } from '../services/api';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
  isLoading: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(
        (item) => 
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price,
          itemCount: state.itemCount + 1,
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.price,
        itemCount: state.itemCount + 1,
      };

    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find(
        (item) => (item.cartId || item.id) === action.payload
      );
      if (!itemToRemove) return state;
      
      return {
        ...state,
        items: state.items.filter((item) => (item.cartId || item.id) !== action.payload),
        total: state.total - itemToRemove.price * itemToRemove.quantity,
        itemCount: state.itemCount - itemToRemove.quantity,
      };

    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map((item) =>
        (item.cartId || item.id) === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((total, item) => total + item.price * item.quantity, 0),
        itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0),
      };

    case 'CLEAR_CART':
      return initialState;

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addToCart = async (product) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cartItem = {
        ...product,
        cartId: `${product.id}-${Date.now()}-${Math.random()}`,
        quantity: product.quantity ? product.quantity : 1,
      };
    
      // Optimistic update
      dispatch({ type: 'ADD_ITEM', payload: cartItem });
    
      // Attempt backend sync (best-effort)
      try {
        await cartService.addToCart({
          productId: product.id,
          quantity: cartItem.quantity,
          size: cartItem.size,
          color: cartItem.color,
        });
      } catch (err) {
        console.error('Cart add sync failed:', err);
      }
    
      toast.success('Item added to cart');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromCart = async (itemId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Attempt backend removal with productId extracted from our cartId format
      const backendId = String(itemId).split('-')[0];
      try {
        await cartService.removeFromCart(backendId);
      } catch (err) {
        console.error('Cart remove sync failed:', err);
      }
    
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const backendId = String(itemId).split('-')[0];
      try {
        await cartService.updateCart({ productId: backendId, quantity });
      } catch (err) {
        console.error('Cart update sync failed:', err);
      }
    
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};