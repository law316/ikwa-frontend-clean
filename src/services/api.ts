import {
  ApiResponse,
  Product,
  ProductFilters,
  Order,
  CreateOrderRequest,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  WishlistItem,
  ApiError
} from '../types/api';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    const err = await response.json();
    throw err;
  }
  const data = await response.json();
  return data as ApiResponse<T>;
}

export const apiService = {
  // Product methods
  getProducts: (params: ProductFilters = {}): Promise<ApiResponse<Product[]>> => {
    const query = Object.keys(params).length ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetch(`${API_BASE_URL}${API_ENDPOINTS.products}${query}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse<Product[]>);
  },
  getProduct: (id: string): Promise<ApiResponse<Product>> =>
    fetch(`${API_BASE_URL}${API_ENDPOINTS.product(id)}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse<Product>),
  // Order methods
  getOrders: (): Promise<ApiResponse<Order[]>> =>
    fetch(`${API_BASE_URL}${API_ENDPOINTS.orders}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse<Order[]>),
  createOrder: (orderData: CreateOrderRequest): Promise<ApiResponse<Order>> =>
    fetch(`${API_BASE_URL}${API_ENDPOINTS.createOrder}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    }).then(handleResponse<Order>),
  // Auth methods
  login: (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
    fetch(`${API_BASE_URL}${API_ENDPOINTS.login}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(credentials),
    }).then(handleResponse<AuthResponse>),
  register: (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> =>
    fetch(`${API_BASE_URL}${API_ENDPOINTS.register}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    }).then(handleResponse<AuthResponse>),
  // User methods
  updateProfile: (userData: Partial<User>): Promise<ApiResponse<User>> =>
    fetch(`${API_BASE_URL}${API_ENDPOINTS.updateProfile}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    }).then(handleResponse<User>),
  // Wishlist methods
  getWishlist: (): Promise<ApiResponse<Product[]>> =>
    fetch(`${API_BASE_URL}${API_ENDPOINTS.wishlist}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse<Product[]>),
  addToWishlist: (productId: string): Promise<ApiResponse<{ success: boolean }>> =>
    fetch(`${API_BASE_URL}${API_ENDPOINTS.wishlistAdd}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId }),
    }).then(handleResponse<{ success: boolean }>),
  removeFromWishlist: (productId: string): Promise<ApiResponse<{ success: boolean }>> =>
    fetch(`${API_BASE_URL}${API_ENDPOINTS.wishlistRemove}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId }),
    }).then(handleResponse<{ success: boolean }>),
  // Cart methods
  getCart: (): Promise<ApiResponse<any>> =>
    fetch(`${API_BASE_URL}${API_ENDPOINTS.cart}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse<any>),
  addToCart: (data: any): Promise<ApiResponse<any>> =>
    fetch((typeof API_ENDPOINTS.addToCart === 'string'
      ? (API_ENDPOINTS.addToCart.startsWith('http://') || API_ENDPOINTS.addToCart.startsWith('https://')
        ? API_ENDPOINTS.addToCart
        : `${API_BASE_URL}${API_ENDPOINTS.addToCart}`)
      : `${API_BASE_URL}${API_ENDPOINTS.addToCart}`), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse<any>),
  updateCart: (data: any): Promise<ApiResponse<any>> =>
    fetch(`${API_BASE_URL}${API_ENDPOINTS.updateCart}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse<any>),
  removeFromCart: (itemId: string): Promise<ApiResponse<any>> =>
    fetch(`${API_BASE_URL}${API_ENDPOINTS.removeFromCart(itemId)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse<any>),
  // Review methods
  getReviews: (productId: string): Promise<ApiResponse<any>> =>
    fetch(`${API_BASE_URL}${API_ENDPOINTS.reviews(productId)}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse<any>),
  addReview: (productId: string, data: any): Promise<ApiResponse<any>> =>
    fetch(`${API_BASE_URL}${API_ENDPOINTS.addReview(productId)}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse<any>),
  // Contact
  sendMessage: (data: any): Promise<ApiResponse<any>> =>
    fetch(`${API_BASE_URL}${API_ENDPOINTS.contact}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse<any>),
};
