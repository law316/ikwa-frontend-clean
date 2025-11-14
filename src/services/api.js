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

// CSRF handling (best-effort across common frameworks)
let __CSRF_TOKEN = null;
let __CSRF_HEADER_NAME = null; // 'X-XSRF-TOKEN' | 'X-CSRFToken' | 'X-CSRF-Token'

function readCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

async function ensureCsrfToken() {
  // If already cached, skip network
  if (__CSRF_TOKEN) return __CSRF_TOKEN;

  const candidates = [
    '/sanctum/csrf-cookie', // Laravel Sanctum
    '/api/csrf-token',
    '/csrf-token',
    '/csrf',
  ];

  // Try to set cookies via GET and then read them
  for (const path of candidates) {
    try {
      await fetch(`${API_BASE_URL}${path}`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });
      // Check common cookie names
      const xsrf = readCookie('XSRF-TOKEN');
      const django = readCookie('csrftoken');
      const generic = readCookie('CSRF-TOKEN') || readCookie('csrfToken');
      const token = xsrf || django || generic;
      if (token) {
        __CSRF_TOKEN = token;
        __CSRF_HEADER_NAME = xsrf ? 'X-XSRF-TOKEN' : django ? 'X-CSRFToken' : 'X-CSRF-Token';
        return __CSRF_TOKEN;
      }
    } catch (_) {
      // ignore and try next
    }
  }
  return null;
}

function withCsrf(headers) {
  const next = { ...(headers || {}) };
  if (__CSRF_TOKEN && __CSRF_HEADER_NAME) {
    next[__CSRF_HEADER_NAME] = __CSRF_TOKEN;
  }
  return next;
}

// Normalize various backend auth payload shapes to a consistent contract
// { success: boolean, token?: string, user?: object, message?: string, data?: any }
function normalizeAuthPayload(raw) {
  const payload = raw?.data ?? raw;

  // Detect if payload itself looks like a user object (common for simple backends)
  const looksLikeUser = (
    payload && typeof payload === 'object' && !Array.isArray(payload) && !payload.user && (
      payload.id || payload.email || (payload.firstName && payload.lastName)
    )
  );

  // Extract token candidates
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

  // Detect success using common patterns and presence of token/user
  const successIndicators = [
    payload?.success === true,
    String(payload?.status || '').toLowerCase() === 'success',
    typeof payload?.message === 'string' && payload.message.toLowerCase().includes('success'),
    payload === true,
    Boolean(token),
    Boolean(looksLikeUser),
  ];
  const success = successIndicators.some(Boolean);

  // Extract user candidates, fall back to payload if it looks like a user
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

// Helper to extract data from various response formats
function extractDataFromResponse(responseData) {
  // Handle null or undefined
  if (!responseData) return null;
  
  // If it's already an array or object (direct response)
  if (Array.isArray(responseData)) return responseData;
  if (typeof responseData === 'object' && !responseData.data && !responseData.product && !responseData.products) {
    // Check if it's a single object response (like a product)
    if (responseData.id || responseData._id || responseData.productId || responseData.name) {
      return responseData;
    }
  }
  
  // Try common response wrapper patterns
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
  
  // Return the original if nothing found
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
  // Gracefully handle empty-body 200 OK responses
  return response.text().then(text => {
    if (!text) {
      // Return a normalized success payload so callers can treat it as success
      return { success: true, status: 'success' };
    }
    try {
      const parsed = JSON.parse(text);
      // Extract actual data from response wrappers
      return extractDataFromResponse(parsed);
    } catch (e) {
      // Non-JSON success responses
      return { success: true, data: text };
    }
  });
}

// Product data normalizers
export function normalizeProduct(p) {
  if (!p || typeof p !== 'object') {
    return {
      id: String(Math.random()),
      name: 'Untitled Product',
      description: '',
      price: 0,
      images: ['https://via.placeholder.com/800x800?text=Product'],
      image: 'https://via.placeholder.com/800x800?text=Product',
      era: 'Vintage',
      decade: 'Vintage',
      style: 'Vintage',
      condition: 'Good',
      colors: ['Black'],
      color: 'Black',
      sizes: ['M'],
      size: 'M',
      isNew: false,
      inStock: true,
      popularity: 0,
      eraYear: 1970,
      createdAt: new Date().toISOString(),
    };
  }

  const imagesArr = Array.isArray(p.images)
    ? p.images
    : p.gallery
    ? p.gallery
    : p.image
    ? [p.image]
    : [];

  const primaryImage = imagesArr.length > 0
    ? imagesArr[0]
    : (p.thumbnail || 'https://via.placeholder.com/800x800?text=Product');

  const colorsArr = Array.isArray(p.colors)
    ? p.colors
    : p.color
    ? [p.color]
    : ['Black'];

  const sizesArr = Array.isArray(p.sizes)
    ? p.sizes
    : p.size
    ? [p.size]
    : ['M'];

  const priceNum = typeof p.price === 'number' ? p.price : parseFloat(p.price);
  const eraYr = p.eraYear || p.year || (p.createdAt ? new Date(p.createdAt).getFullYear() : undefined) || 1970;

  return {
    id: p.id || p._id || p.productId || p.slug || String(Math.random()),
    name: p.name || p.title || 'Untitled Product',
    description: p.description || p.desc || '',
    price: Number.isFinite(priceNum) ? priceNum : 0,
    images: imagesArr.length > 0 ? imagesArr : [primaryImage],
    image: primaryImage,
    era: p.era || p.decade || p.category || 'Vintage',
    decade: p.decade || p.era || 'Vintage',
    style: p.style || p.category || 'Vintage',
    condition: p.condition || 'Good',
    colors: colorsArr,
    color: colorsArr[0],
    sizes: sizesArr,
    size: sizesArr[0],
    isNew: !!p.isNew,
    inStock: p.inStock !== undefined ? !!p.inStock : true,
    popularity: p.popularity || 0,
    eraYear: eraYr,
    createdAt: p.createdAt || new Date().toISOString(),
    category: p.category || p.style || undefined,
  };
}

export function normalizeProducts(items) {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeProduct);
}

// Attempt to extract an array of products from diverse API payload shapes
function extractProductsArray(payload) {
  if (Array.isArray(payload)) return payload;
  // Common top-level keys
  const topCandidates = [
    payload?.products,
    payload?.data,
    payload?.items,
    payload?.results,
    payload?.records,
    payload?.docs,
    payload?.list,
  ];
  for (const cand of topCandidates) {
    if (Array.isArray(cand)) return cand;
  }
  // Nested under data
  const dataObj = payload?.data;
  if (dataObj && typeof dataObj === 'object') {
    const nestedCandidates = [
      dataObj.products,
      dataObj.items,
      dataObj.results,
      dataObj.records,
      dataObj.docs,
      dataObj.list,
    ];
    for (const cand of nestedCandidates) {
      if (Array.isArray(cand)) return cand;
    }
  }
  return null;
}

// Auth services
export const authService = {
  // Try both payload formats to maximize compatibility with backend
  register: async (data) => {
    const token = localStorage.getItem('token');
    const pathsToTry = [
      API_ENDPOINTS.register,
    ];

    const jsonHeaders = token
      ? { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` }
      : { 'Content-Type': 'application/json', Accept: 'application/json' };

    let lastError;
    // Best-effort: establish CSRF token prior to POSTs (if backend requires it)
    try { await ensureCsrfToken(); } catch (_) {}
    for (const path of pathsToTry) {
      try {
        const url = `${API_BASE_URL}${path}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: withCsrf(jsonHeaders),
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify(data),
        });
        try { console.debug('[auth:register]', 'POST', url, 'status=', resp.status); } catch (_) {}
        const parsed = await handleResponse(resp);
        return normalizeAuthPayload(parsed);
      } catch (err) {
        lastError = err;
        // continue trying other paths on 404/Not Found-like errors
        if (err && (err.status === 404 || err.statusCode === 404)) continue;
      }
    }
    throw lastError || new Error('Registration request failed');
  },
  login: async (data) => {
    const pathsToTry = [
      API_ENDPOINTS.login,
      '/api/auth/login',
      '/api/registration/login',
    ];

    let lastError;
    try { await ensureCsrfToken(); } catch (_) {}
    for (const path of pathsToTry) {
      try {
        const url = `${API_BASE_URL}${path}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: withCsrf(getAuthHeaders()),
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify(data),
        });
        try { console.debug('[auth:login]', 'POST', url, 'status=', resp.status); } catch (_) {}

        // Extract potential token from headers
        const headerAuth =
          resp.headers.get('authorization') ||
          resp.headers.get('Authorization') ||
          resp.headers.get('x-access-token') ||
          resp.headers.get('x-auth-token');

        const parsed = await handleResponse(resp);

        if (headerAuth) {
          const cleaned = headerAuth.replace(/^Bearer\s+/i, '');
          try {
            localStorage.setItem('token', cleaned);
            localStorage.setItem('authToken', cleaned);
          } catch (_) {}
          if (parsed && typeof parsed === 'object') {
            parsed.authorization = headerAuth;
            if (!parsed.token) parsed.token = cleaned;
          }
        }

        const normalized = normalizeAuthPayload(parsed);
        if (headerAuth) {
          // Preserve raw header and cleaned token if available
          const cleaned = headerAuth.replace(/^Bearer\s+/i, '');
          try {
            localStorage.setItem('token', cleaned);
            localStorage.setItem('authToken', cleaned);
          } catch (_) {}
          normalized.authorization = headerAuth;
          if (!normalized.token) normalized.token = cleaned;
        }
        return normalized;
      } catch (err) {
        lastError = err;
        // continue trying other paths on 404/Not Found-like errors
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
        credentials: 'include',
        mode: 'cors',
      });
      const result = await handleResponse(response);
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return extractDataFromResponse(result) || result;
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear auth even on error
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { success: true };
    }
  },
  verifyEmail: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.verifyEmail}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data),
      });
      const result = await handleResponse(response);
      return extractDataFromResponse(result) || result;
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    }
  },
  resendVerification: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.resendVerification}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data),
      });
      const result = await handleResponse(response);
      return extractDataFromResponse(result) || result;
    } catch (error) {
      console.error('Resend verification failed:', error);
      throw error;
    }
  },
};

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
