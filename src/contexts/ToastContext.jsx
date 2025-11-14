import React, { createContext, useContext, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

const initialState = {
  toasts: [],
};

const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, { ...action.payload, id: Date.now() }],
      };

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      };

    case 'CLEAR_TOASTS':
      return {
        ...state,
        toasts: [],
      };

    default:
      return state;
  }
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`flex items-center gap-2 p-4 rounded-lg shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-50 text-green-800'
                : toast.type === 'error'
                ? 'bg-red-50 text-red-800'
                : 'bg-amber-50 text-amber-800'
            }`}
          >
            {toast.type === 'success' && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            {toast.type === 'info' && (
              <Info className="h-5 w-5 text-amber-500" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const addToast = (message, type = 'info', duration = 3000) => {
    dispatch({ type: 'ADD_TOAST', payload: { message, type, duration } });

    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: Date.now() });
      }, duration);
    }
  };

  const removeToast = (id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  const clearToasts = () => {
    dispatch({ type: 'CLEAR_TOASTS' });
  };

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
        clearToasts,
      }}
    >
      {children}
      <ToastContainer toasts={state.toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 