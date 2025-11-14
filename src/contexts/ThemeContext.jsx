import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ThemeContext = createContext();

const initialState = {
  mode: 'light',
  font: 'vintage',
  colors: {
    primary: '#000000',
    secondary: '#FFFFFF',
    background: '#FFFFFF',
    text: '#000000',
    accent: '#333333',
  },
  animations: {
    enabled: true,
    speed: 'normal',
  },
};

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_MODE':
      return {
        ...state,
        mode: state.mode === 'light' ? 'dark' : 'light',
      };

    case 'SET_FONT':
      return {
        ...state,
        font: action.payload,
      };

    case 'UPDATE_COLORS':
      return {
        ...state,
        colors: {
          ...state.colors,
          ...action.payload,
        },
      };

    case 'TOGGLE_ANIMATIONS':
      return {
        ...state,
        animations: {
          ...state.animations,
          enabled: !state.animations.enabled,
        },
      };

    case 'SET_ANIMATION_SPEED':
      return {
        ...state,
        animations: {
          ...state.animations,
          speed: action.payload,
        },
      };

    default:
      return state;
  }
};

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState, () => {
    try {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? JSON.parse(savedTheme) : initialState;
    } catch (error) {
      console.warn('Failed to parse theme from localStorage:', error);
      localStorage.removeItem('theme'); // Remove invalid theme data
      return initialState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('theme', JSON.stringify(state));
      document.documentElement.setAttribute('data-theme', state.mode);
      document.documentElement.style.setProperty('--primary-color', state.colors.primary);
      document.documentElement.style.setProperty('--secondary-color', state.colors.secondary);
      document.documentElement.style.setProperty('--background-color', state.colors.background);
      document.documentElement.style.setProperty('--text-color', state.colors.text);
      document.documentElement.style.setProperty('--accent-color', state.colors.accent);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }
  }, [state]);

  const toggleMode = () => {
    dispatch({ type: 'TOGGLE_MODE' });
  };

  const setFont = (font) => {
    dispatch({ type: 'SET_FONT', payload: font });
  };

  const updateColors = (colors) => {
    dispatch({ type: 'UPDATE_COLORS', payload: colors });
  };

  const toggleAnimations = () => {
    dispatch({ type: 'TOGGLE_ANIMATIONS' });
  };

  const setAnimationSpeed = (speed) => {
    dispatch({ type: 'SET_ANIMATION_SPEED', payload: speed });
  };

  return (
    <ThemeContext.Provider
      value={{
        ...state,
        toggleMode,
        setFont,
        updateColors,
        toggleAnimations,
        setAnimationSpeed,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 