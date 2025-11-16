const API_BASE_URL = "https://likwapuecommerce.fly.dev";
export default API_BASE_URL;

export const API_ENDPOINTS = {
  // Auth
  login: "/api/login",
  register: "/api/registration/register",

  // Products
  products: "/api/products",
  product: (id: string) => `/api/products/${id}`,

  // Categories
  categories: "/api/categories",

  // Cart
  cart: "/api/cart",
  addToCart: "/api/cart/add",
  updateCart: "/api/cart/update",
  removeFromCart: (itemId: string) => `/api/cart/remove/${itemId}`,

  // Reviews
  reviews: (productId: string) => `/api/products/${productId}/reviews`,
  addReview: (productId: string) => `/api/products/${productId}/reviews/add`,

  // Orders (your api.ts calls these)
  orders: "/api/orders",
  createOrder: "/api/orders/create",

  // User profile
  updateProfile: "/api/user/update",

  // Wishlist
  wishlist: "/api/wishlist",
  wishlistAdd: "/api/wishlist/add",
  wishlistRemove: "/api/wishlist/remove",

  // Contact
  contact: "/api/contact",
};
