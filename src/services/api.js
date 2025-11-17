// Centralized Fetch API Service for Lace and Legacy
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';
import { mockProducts } from '../data/mockProducts';
import * as monitor from './monitor';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

// Removed all CSRF token logic
// --------------------------------------
// Removed: readCookie, ensureCsrfToken, withCsrf
// --------------------------------------

// Normalize various backend auth payload shapes
function normalizeAuthPayload(raw) {
  const payload = raw?.data ?? raw;

  const looksLikeUser = (
    payload && typeof payload === 'object' && !Array.isArray(payload) && !payload.user && (
      payload.id || payload.email || (payload.firstName && payload.lastName)
    )
  );

  const tokenCandidates = [
    payload?.token,
    payload?.accessToken,
    payload?.access_token,
    payload?.jwt,
    typeof payload?.authorization === 'string' ? payload?.authorization.replace(/^Bearer\s+/i, '') : undefined,
    payload?.data?.token,
    payload?.data?.accessToken,
    payload?.data?.access_token,
  ].filter(Boolean);
  const token = tokenCandidates[0];

  const successIndicators = [
    payload?.success === true,
    String(payload?.status || '').toLowerCase() === 'success',
    typeof payload?.message === 'string' && payload.message.toLowerCase().includes('success'),
    payload === true,
    Boolean(token),
    Boolean(looksLikeUser),
  ];
  const success = successIndicators.some(Boolean);

  const userCandidates = [
    payload?.user,
    payload?.data?.user,
    payload?.userData,
    payload?.data?.userInfo,
    payload?.profile,
    payload?.data?.profile,
    looksLikeUser ? payload : undefined,
  ].filter(Boolean);
  const user = userCandidates[0];

  const message = payload?.message || payload?.error || undefined;

  return { success, token, user, message, data: payload };
}

function extractDataFromResponse(responseData) {
  if (!responseData) return null;
  if (Array.isArray(responseData)) return responseData;
  if (typeof responseData === 'object' && !responseData.data && !responseData.product && !responseData.products) {
    if (responseData.id || responseData._id || responseData.productId || responseData.name) {
      return responseData;
    }
  }

  const candidates = [
    responseData.data,
    responseData.product,
    responseData.products,
    responseData.items,
    responseData.results,
    responseData.payload,
    responseData.content,
    responseData.body,
  ];

  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null) {
      return candidate;
    }
  }

  return responseData;
}

function handleResponse(response) {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return response.text().then(text => {
      try {
        const error = text ? JSON.parse(text) : { message: 'Request failed', status: response.status };
        return Promise.reject(error);
      } catch (e) {
        return Promise.reject({ message: text || 'Request failed', status: response.status });
      }
    });
  }
  return response.text().then(text => {
    if (!text) return { success: true, status: 'success' };
    try {
      const parsed = JSON.parse(text);
      return extractDataFromResponse(parsed);
    } catch (e) {
      return { success: true, data: text };
    }
  });
}

// Normalizers unchanged
export function normalizeProduct(p) { /* ... unchanged ... */ }
export function normalizeProducts(items) { /* ... unchanged ... */ }

function extractProductsArray(payload) { /* ... unchanged ... */ }

// Auth services
export const authService = {
  register: async (data) => {
    const token = localStorage.getItem('token');
    const pathsToTry = [API_ENDPOINTS.register];

    const headers = token
      ? { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` }
      : { 'Content-Type': 'application/json', Accept: 'application/json' };

    let lastError;
    for (const path of pathsToTry) {
      try {
        const url = `${API_BASE_URL}${path}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers,
          mode: 'cors',
          body: JSON.stringify(data),
        });
        const parsed = await handleResponse(resp);
        return normalizeAuthPayload(parsed);
      } catch (err) {
        lastError = err;
        if (err && (err.status === 404 || err.statusCode === 404)) continue;
      }
    }
    throw lastError || new Error('Registration request failed');
  },

  login: async (data) => {
    const pathsToTry = [API_ENDPOINTS.login, '/api/login'];

    let lastError;
    for (const path of pathsToTry) {
      try {
        const url = `${API_BASE_URL}${path}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: getAuthHeaders(),
          mode: 'cors',
          body: JSON.stringify(data),
        });

        const headerAuth =
          resp.headers.get('authorization') ||
          resp.headers.get('Authorization') ||
          resp.headers.get('x-access-token') ||
          resp.headers.get('x-auth-token');

        const parsed = await handleResponse(resp);

        if (headerAuth) {
          const cleaned = headerAuth.replace(/^Bearer\s+/i, '');
          localStorage.setItem('token', cleaned);
          localStorage.setItem('authToken', cleaned);
          parsed.authorization = headerAuth;
          if (!parsed.token) parsed.token = cleaned;
        }

        const normalized = normalizeAuthPayload(parsed);
        return normalized;
      } catch (err) {
        lastError = err;
        if (err && (err.status === 404 || err.statusCode === 404)) continue;
      }
    }
    throw lastError || new Error('Login request failed');
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.logout}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        mode: 'cors',
      });
      const result = await handleResponse(response);
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return extractDataFromResponse(result) || result;
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { success: true };
    }
  },

  verifyEmail: async (data) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.verifyEmail}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      mode: 'cors',
      body: JSON.stringify(data),
    });
    const result = await handleResponse(response);
    return extractDataFromResponse(result) || result;
  },

  resendVerification: async (data) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.resendVerification}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      mode: 'cors',
      body: JSON.stringify(data),
    });
    const result = await handleResponse(response);
    return extractDataFromResponse(result) || result;
  },
};

// Remaining services (userService, productService, reviewService, wishlistService, cartService, orderService, contactService)
// All should use `headers: getAuthHeaders()` and `mode: 'cors'` only — remove `credentials: 'include'` from all of them.

// User services
export const userService = {
  getProfile: async () => {
    const pathsToTry = [
      API_ENDPOINTS.profile,
      '/api/auth/profile',
      '/api/profile',
      '/api/users/me',
      '/api/user/me',
      '/api/me',
    ];

    let lastError;
    for (const path of pathsToTry) {
      try {
        const resp = await fetch(`${API_BASE_URL}${path}`, {
          headers: getAuthHeaders(),
          credentials: 'include',
          mode: 'cors',
        });
        const data = await handleResponse(resp);
        const profile = extractDataFromResponse(data);
        return profile || data;
      } catch (err) {
        lastError = err;
        if (err && (err.status === 404 || err.statusCode === 404)) {
          continue; // try next path on 404
        }
      }
    }
    throw lastError || { message: 'Profile endpoint not found', status: 404 };
  },
  updateProfile: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.updateProfile}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data),
      });
      const result = await handleResponse(response);
      return extractDataFromResponse(result) || result;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },
  updatePreferences: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.preferences}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data),
      });
      const result = await handleResponse(response);
      return extractDataFromResponse(result) || result;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  },
};

// Product services
export const productService = {
  getProducts: async (params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}`, Accept: 'application/json' } : { Accept: 'application/json' };

    const primaryUrl = `${API_BASE_URL}${API_ENDPOINTS.products}${query}`;
    const aliasPaths = [
      API_ENDPOINTS.products,
      '/api/products',
      // Avoid non-API front-end routes that may return HTML
    ];

    const startTime = Date.now();
    const isNetworkError = (err) => {
      if (!err) return false;
      const msg = String(err.message || '').toLowerCase();
      return (
        err.name === 'TypeError' ||
        msg.includes('failed to fetch') ||
        msg.includes('networkerror') ||
        msg.includes('net::err_failed') ||
        msg.includes('aborted') ||
        msg.includes('request was aborted')
      );
    };

    try {
      const resp = await fetch(primaryUrl, {
        headers,
        mode: 'cors',
        credentials: 'include',
      });
      const data = await handleResponse(resp);
      const productsArr = extractProductsArray(data);
      if (productsArr) {
        const normalized = normalizeProducts(productsArr);
        monitor.logInfo('productService.getProducts success', {
          url: primaryUrl,
          duration_ms: Date.now() - startTime,
          count: normalized.length,
        });
        return normalized;
      }
      // Invalid payload that cannot be parsed into products -> offline fallback
      try {
        window.dispatchEvent(new CustomEvent('likwapu:offline-fallback', { detail: { resource: 'products' } }));
      } catch (_) {}
      try { window.__LIK_OFFLINE_PRODUCTS__ = true; } catch (_) {}
      monitor.logWarn('productService.getProducts invalid payload fallback', {
        url: primaryUrl,
        duration_ms: Date.now() - startTime,
        payload_keys: Object.keys(data || {}),
      });
      return mockProducts;
    } catch (err) {
      monitor.logError('productService.getProducts error', {
        url: primaryUrl,
        duration_ms: Date.now() - startTime,
        error_message: err?.message,
        error_name: err?.name,
        online: typeof navigator !== 'undefined' ? navigator.onLine : undefined,
      });

      // Try alias endpoints on network errors or 404s
      let lastError = err;
      for (const path of aliasPaths) {
        const altUrl = `${API_BASE_URL}${path}${query}`;
        try {
          const altStart = Date.now();
          const r = await fetch(altUrl, { headers, mode: 'cors', credentials: 'include' });
          const d = await handleResponse(r);
          const arr = extractProductsArray(d);
          if (arr) {
            const normalized = normalizeProducts(arr);
            monitor.logWarn('productService.getProducts alias success', {
              url: altUrl,
              duration_ms: Date.now() - altStart,
              count: normalized.length,
            });
            return normalized;
          }
          // Alias returned a non-product payload -> fallback
          try {
            window.dispatchEvent(new CustomEvent('likwapu:offline-fallback', { detail: { resource: 'products' } }));
          } catch (_) {}
          try { window.__LIK_OFFLINE_PRODUCTS__ = true; } catch (_) {}
          monitor.logWarn('productService.getProducts alias invalid payload fallback', {
            url: altUrl,
            duration_ms: Date.now() - altStart,
            payload_keys: Object.keys(d || {}),
          });
          return mockProducts;
        } catch (err2) {
          lastError = err2;
          // Continue trying other aliases only for network-like failures
          if (!(isNetworkError(err2) || (err2 && (err2.status === 404 || err2.statusCode === 404)))) {
            break;
          }
        }
      }

      // Fallback to local mock products for any fetch failure to keep UX resilient
      try {
        window.dispatchEvent(new CustomEvent('likwapu:offline-fallback', { detail: { resource: 'products' } }));
      } catch (_) {}
      try { window.__LIK_OFFLINE_PRODUCTS__ = true; } catch (_) {}
      monitor.logWarn('productService.getProducts fallback to mockProducts', {
        reason: (lastError?.status || lastError?.name || lastError?.message || 'unknown'),
        count: Array.isArray(mockProducts) ? mockProducts.length : 0,
      });
      return mockProducts;
    }
  },
  getProduct: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.product(id)}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
      });
      const data = await handleResponse(response);
      // Extract product from response if wrapped
      const product = extractDataFromResponse(data);
      return normalizeProduct(product || data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      throw error;
    }
  },
  searchProducts: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.search}?q=${encodeURIComponent(query)}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
      });
      const data = await handleResponse(response);
      const products = extractDataFromResponse(data);
      return normalizeProducts(Array.isArray(products) ? products : []);
    } catch (error) {
      console.error('Failed to search products:', error);
      return [];
    }
  },
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.categories}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
      });
      const data = await handleResponse(response);
      return extractDataFromResponse(data) || [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  },
  getFilters: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.filters}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
      });
      const data = await handleResponse(response);
      return extractDataFromResponse(data) || {};
    } catch (error) {
      console.error('Failed to fetch filters:', error);
      return {};
    }
  },
};

// Review services
export const reviewService = {
  getReviews: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.reviews(productId)}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
      });
      const data = await handleResponse(response);
      return extractDataFromResponse(data) || [];
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      return [];
    }
  },
  addReview: async (productId, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.addReview(productId)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data),
      });
      const result = await handleResponse(response);
      return extractDataFromResponse(result) || result;
    } catch (error) {
      console.error('Failed to add review:', error);
      throw error;
    }
  },
};

// Wishlist services
export const wishlistService = {
  getWishlist: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.wishlist}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
      });
      const data = await handleResponse(response);
      const products = extractDataFromResponse(data);
      return normalizeProducts(Array.isArray(products) ? products : []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      return [];
    }
  },
  addToWishlist: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.wishlistAdd}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({ productId }),
      });
      const result = await handleResponse(response);
      return extractDataFromResponse(result) || result;
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      throw error;
    }
  },
  removeFromWishlist: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.wishlistRemove}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({ productId }),
      });
      const result = await handleResponse(response);
      return extractDataFromResponse(result) || result;
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      throw error;
    }
  },
};

// Cart services
export const cartService = {
  getCart: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.cart}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
      });
      const data = await handleResponse(response);
      return extractDataFromResponse(data) || { items: [], total: 0 };
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      return { items: [], total: 0 };
    }
  },
  addToCart: async (data) => {
    try {
      const addToCartEndpoint = typeof API_ENDPOINTS.addToCart === 'string'
        ? (API_ENDPOINTS.addToCart.startsWith('http://') || API_ENDPOINTS.addToCart.startsWith('https://')
            ? API_ENDPOINTS.addToCart
            : `${API_BASE_URL}${API_ENDPOINTS.addToCart}`)
        : `${API_BASE_URL}${API_ENDPOINTS.addToCart}`;

      const response = await fetch(addToCartEndpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data),
      });
      const result = await handleResponse(response);
      return extractDataFromResponse(result) || result;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  },
  updateCart: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.updateCart}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data),
      });
      const result = await handleResponse(response);
      return extractDataFromResponse(result) || result;
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  },
  removeFromCart: async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.removeFromCart(itemId)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
      });
      const result = await handleResponse(response);
      return extractDataFromResponse(result) || result;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  },
};

// Order services
export const orderService = {
  getOrders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.orders}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
      });
      const data = await handleResponse(response);
      return extractDataFromResponse(data) || [];
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      return [];
    }
  },
  getOrder: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.order(id)}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
      });
      const data = await handleResponse(response);
      return extractDataFromResponse(data) || null;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      throw error;
    }
  },
  createOrder: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.createOrder}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data),
      });
      const result = await handleResponse(response);
      return extractDataFromResponse(result) || result;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  },
};

// Contact services
export const contactService = {
  sendMessage: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.contact}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data),
      });
      const result = await handleResponse(response);
      return extractDataFromResponse(result) || result;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },
};
