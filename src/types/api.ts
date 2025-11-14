// Base API Response Type
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
  isNew?: boolean;
  condition?: string;
  decade?: string;
}

export interface ProductFilters {
  category?: string;
  decade?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
}

// Order Types
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Address Type
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Wishlist Types
export interface WishlistItem {
  productId: string;
  addedAt: string;
}

// API Error Type
export interface ApiError {
  status: number;
  message: string;
  code?: string;
} 