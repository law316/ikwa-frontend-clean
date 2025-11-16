import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authService, userService } from "../services/api";
import { toast } from "react-hot-toast";

const UserContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, error: null };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case "REGISTER_SUCCESS":
      return { ...state, loading: false, error: null };

    case "AUTH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "LOGOUT":
      return { ...initialState };

    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState, () => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    return {
      ...initialState,
      user: savedUser ? JSON.parse(savedUser) : null,
      isAuthenticated: !!token,
    };
  });

  // Persist user
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  // --- AUTH METHODS -----------------------------------

  const register = async (form) => {
    dispatch({ type: "AUTH_START" });

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        country: form.country,
      };

      const res = await authService.register(payload);

      dispatch({ type: "REGISTER_SUCCESS" });
      toast.success("Registration successful!");

      return res; // RegisterPage will handle redirect
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Registration failed";
      dispatch({ type: "AUTH_ERROR", payload: msg });
      toast.error(msg);
      throw err;
    }
  };

  const login = async (credentials) => {
    dispatch({ type: "AUTH_START" });

    try {
      const res = await authService.login(credentials);

      const token = res?.token;
      const user = res?.user;

      if (!token || !user)
        throw new Error("Invalid login response from backend");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({ type: "LOGIN_SUCCESS", payload: user });

      toast.success("Welcome back!");

      return user;
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Login failed";
      dispatch({ type: "AUTH_ERROR", payload: msg });
      toast.error(msg);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out");
  };

  const updateProfile = async (data) => {
    try {
      const res = await userService.updateProfile(data);
      localStorage.setItem("user", JSON.stringify(res));
      dispatch({ type: "LOGIN_SUCCESS", payload: res });
      toast.success("Profile updated");
      return res;
    } catch (err) {
      toast.error("Update failed");
      throw err;
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserContext;
