const API_BASE_URL = "https://likwapuecommerce.fly.dev";
export default API_BASE_URL;

export const API_ENDPOINTS = {
  // AUTH (Spring Boot)
  login: "/api/login",
  register: "/api/registration/register",

  // PRODUCTS
  products: "/api/products",
  product: (id: string) => `/api/products/${id}`,

  // CATEGORIES
  categories: "/api/categories",

  // CART
  cart: "/api/cart",
  addToCart: "/api/cart/add",
  updateCart: "/api/cart/update",
  removeFromCart: (itemId: string) => `/api/cart/remove/${itemId}`,

  // REVIEWS
  reviews: (productId: string) => `/api/products/${productId}/reviews`,
  addReview: (productId: string) => `/api/products/${productId}/reviews/add`,

  // ORDERS
  orders: "/api/orders",
  createOrder: "/api/orders/create",

  // USER PROFILE
  updateProfile: "/api/user/update",

  // WISHLIST
  wishlist: "/api/wishlist",
  wishlistAdd: "/api/wishlist/add",
  wishlistRemove: "/api/wishlist/remove",

  // CONTACT
  contact: "/api/contact",
};
