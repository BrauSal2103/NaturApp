import StorageService from './storageService';

// ============================================
// PERSISTENCIA REMOTA - API REST
// Conexión con backend Express/Node.js
// Usa fetch con async/await (asincronía)
// ============================================

const BASE_URL = 'http://192.168.1.100:9090/api';

// Helper para peticiones HTTP con manejo de errores
async function request(endpoint, options = {}) {
  try {
    const token = await StorageService.getToken();
    const response = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && {
            Authorization: `Bearer ${token}`
          }),
          ...options.headers,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

const ApiService = {
  // === PRODUCTOS (READ) ===
  async getProducts(category = null) {
    const query = category
      ? `?category=${category}` : '';
    return await request(`/products${query}`);
  },

  async getProductById(id) {
    return await request(`/products/${id}`);
  },

  async searchProducts(query) {
    return await request(
      `/products/search?q=${encodeURIComponent(query)}`
    );
  },

  // === PEDIDOS (CRUD completo) ===
  // CREATE: Crear nuevo pedido
  async createOrder(orderData) {
    return await request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // READ: Obtener historial de pedidos
  async getOrders() {
    return await request('/orders');
  },

  // READ: Detalle de un pedido
  async getOrderById(id) {
    return await request(`/orders/${id}`);
  },

  // === AUTENTICACIÓN ===
  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // Guarda token en persistencia básica
    if (data.token) {
      await StorageService.saveToken(data.token);
      await StorageService.saveUserProfile(
        data.user.name, data.user.email
      );
    }
    return data;
  },

  // === CATEGORÍAS ===
  async getCategories() {
    return await request('/categories');
  },
};

export default ApiService;
