import { useState, useEffect, useCallback } from 'react';
import DatabaseService from '../services/databaseService';
import ApiService from '../services/apiService';
import { CartItem } from '../models/CartItem';

// ============================================
// VIEWMODEL: Gestiona lógica del carrito
// Conecta View con SQLite (local) y API (remoto)
// ============================================
export function useCart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await DatabaseService.getCartItems();
      setItems(rows.map(r => CartItem.fromRow(r)));
      const t = await DatabaseService.getCartTotal();
      setTotal(t);
      const c = await DatabaseService.getCartCount();
      setCount(c);
    } finally {
      setLoading(false);
    }
  }, []);

  // AGREGAR producto (validación + persistencia)
  const addItem = useCallback(async (product) => {
    // VALIDACIÓN: Lógica de negocio
    if (!product.isAvailable()) {
      throw new Error('Producto sin stock');
    }
    await DatabaseService.addToCart(product);
    await loadCart();  // Actualizar estado
  }, [loadCart]);

  // ACTUALIZAR cantidad
  const updateQuantity = useCallback(
    async (productId, qty) => {
      // VALIDACIÓN: no permitir negativos
      if (qty < 0) return;
      await DatabaseService.updateCartQuantity(
        productId, qty
      );
      await loadCart();
    }, [loadCart]
  );

  // ELIMINAR item
  const removeItem = useCallback(
    async (productId) => {
      await DatabaseService.removeFromCart(productId);
      await loadCart();
    }, [loadCart]
  );

  // CHECKOUT: Envía pedido a la API remota
  const checkout = useCallback(
    async (address) => {
      // VALIDACIÓN
      if (items.length === 0) {
        throw new Error('El carrito está vacío');
      }
      if (!address.trim()) {
        throw new Error('Ingrese una dirección');
      }
      // Enviar a API remota (persistencia remota)
      const order = await ApiService.createOrder({
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        total,
        address,
      });
      // Limpiar carrito local (SQLite)
      await DatabaseService.clearCart();
      await loadCart();
      return order;
    }, [items, total, loadCart]
  );

  useEffect(() => {
    DatabaseService.init().then(loadCart);
  }, [loadCart]);

  return {
    items, total, count, loading,
    addItem, updateQuantity, removeItem,
    checkout, refresh: loadCart,
  };
}

