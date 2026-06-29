// src/services/apiService.js
// Módulo centralizado de comunicación con el backend


const BASE_URL = 'https://tame-lands-shout.loca.lt/api';
let authToken = null;


export const setToken = (token) => { authToken = token; };
export const clearToken = () => { authToken = null; };


// ── Función genérica de solicitud HTTP ──
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers,
  };


  try {
    const response = await fetch(url, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json();

/*     // ── CAMBIO TEMPORAL PARA DEPURACIÓN ──
    const textData = await response.text(); 
    console.log("TEXTO REAL DEVUELTO POR EL SERVIDOR:", textData);
    const data = JSON.parse(textData);
 */

    if (!response.ok) {
      throw new Error(data.message || `Error HTTP ${response.status}`);
    }
    return data;
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Error de conexión con el servidor');
    }
    throw error;
  }
};


// ── Módulo de Productos ──
export const ProductAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products?${query}`);
  },
  getById: (id) => request(`/products/${id}`),
  search: (term) => request(`/products?search=${term}`),
};


// ── Módulo de Categorías ──
export const CategoryAPI = {
  getAll: () => request('/categories'),
};


// ── Módulo de Autenticación ──
export const AuthAPI = {
  login: (email, password) =>
    request('/users/login', {
      method: 'POST', body: { email, password }
    }),
  register: (userData) =>
    request('/users/register', {
      method: 'POST', body: userData
    }),
  getProfile: () => request('/users/profile'),
  updateProfile: (data) =>
    request('/users/profile', {
      method: 'PUT', body: data
    }),
};


// ── Módulo de Carrito ──
export const CartAPI = {
  get: () => request('/cart'),
  addItem: (item) =>
    request('/cart/add', { method: 'POST', body: item }),
  updateQuantity: (productId, quantity) =>
    request(`/cart/${productId}`, {
      method: 'PUT', body: { quantity }
    }),
  removeItem: (productId) =>
    request(`/cart/${productId}`, { method: 'DELETE' }),
  clear: () => request('/cart', { method: 'DELETE' }),
};


// ── Módulo de Pedidos ──
export const OrderAPI = {
  create: (orderData) =>
    request('/orders', { method: 'POST', body: orderData }),
  getAll: () => request('/orders'),
  getById: (id) => request(`/orders/${id}`),
  cancel: (id) =>
    request(`/orders/${id}/cancel`, { method: 'PUT' }),
};

