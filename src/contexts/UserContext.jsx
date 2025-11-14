import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService, userService } from '../services/api';
import { toast } from 'react-hot-toast';

const UserContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  preferences: {
    theme: 'light',
    notifications: true,
    language: 'en'
  },
  loading: false,
  error: null
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case 'LOGOUT':
      return {
        ...initialState,
        preferences: state.preferences
      };

    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload
        }
      };

    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };

    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState, () => {
    const savedUser = localStorage.getItem('user');
    const savedPreferences = localStorage.getItem('preferences');
    return {
      ...initialState,
      user: savedUser ? JSON.parse(savedUser) : null,
      isAuthenticated: !!savedUser,
      preferences: savedPreferences ? JSON.parse(savedPreferences) : initialState.preferences
    };
  });

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // Support both email and username fields for broader backend compatibility
      const reqCredentials = {
        email: credentials.email,
        password: credentials.password,
        username: credentials.email || credentials.username,
      };
      const response = await authService.login(reqCredentials);
      const payload = response; // normalized by authService

      // Short-circuit on explicit failure per backend contract
      if (payload?.success === false) {
        const message = payload?.message || 'Login failed';
        throw new Error(message);
      }

      let token = payload?.token;
      let user = payload?.user;

      // If backend uses cookie-based sessions and doesn't return a user, try fetching profile
      if (!user) {
        try {
          const profileResp = await userService.getProfile();
          const p = profileResp?.data ?? profileResp;
          user = p?.user || p?.data || p?.profile || p;
        } catch (_) {
          // graceful fallback; leave user as undefined
        }
      }

      // Fallback: if success with no user data, synthesize minimal user from credentials
      if (!user && (payload?.success || token) && reqCredentials.email) {
        user = { email: reqCredentials.email };
      }

      // Require either a token or user or a success indicator
      if (!token && !user && !payload?.success) {
        const message = payload?.message || 'Login failed';
        throw new Error(message);
      }

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('authToken', token);
      }

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
      toast.success('Login successful!');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const reqData = {
        ...userData,
        firstname: userData.firstName ?? userData.firstname,
        lastname: userData.lastName ?? userData.lastname,
        password_confirmation: userData.repeatedPassword ?? userData.password_confirmation ?? userData.confirmPassword,
        confirmPassword: userData.repeatedPassword ?? userData.confirmPassword,
        username: userData.email,
      };
      const response = await authService.register(reqData);
      const payload = response;

      if (payload?.success === false) {
        const message = payload?.message || 'Registration failed';
        throw new Error(message);
      }

      // Do not auto-login after registration; keep user unauthenticated
      dispatch({ type: 'LOGOUT' });
      toast.success('User registered successfully');
      return payload;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await userService.updateProfile(profileData);
      dispatch({ type: 'UPDATE_PROFILE', payload: response.data });
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      throw error;
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      const response = await userService.updatePreferences(preferences);
      dispatch({ type: 'UPDATE_PREFERENCES', payload: response.data });
      localStorage.setItem('preferences', JSON.stringify(response.data));
      toast.success('Preferences updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update preferences';
      toast.error(message);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        updatePreferences,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;