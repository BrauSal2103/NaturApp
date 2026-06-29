// src/hooks/useCart.js
// ============================================
// Hook de Carrito — Firestore Subcollection
// Sesión 11: Carrito por usuario con Firebase
// ============================================
 
import { useCallback, useEffect, useState } from 'react';
import { CartService } from '../services/firestoreService';
 
export function useCart(userId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  // Total calculado (con protección asegurando que sea un arreglo)
  const safeItems = Array.isArray(items) ? items : [];
  const total = safeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = safeItems.reduce((sum, item) => sum + item.quantity, 0);
 
  // Cargar carrito del usuario desde Firestore
  const loadCart = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await CartService.get(userId);
      // SOLUCIÓN: Extraer específicamente el arreglo 'items' del objeto que devuelve el servicio
      setItems(data.items || []);
    } catch (err) {
      console.error('Error cargando carrito:', err);
      setError('No se pudo cargar el carrito');
    } finally {
      setLoading(false);
    }
  }, [userId]);
 
  // Agregar producto al carrito
  const addItem = useCallback(async (product) => {
    if (!userId) return;
    try {
      await CartService.addItem(userId, product);
      await loadCart(); // Recargar desde Firestore
    } catch (err) {
      console.error('Error agregando al carrito:', err);
      setError('No se pudo agregar el producto');
    }
  }, [userId, loadCart]);
 
  // Actualizar cantidad
  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (!userId) return;
    try {
      if (quantity <= 0) {
        await CartService.removeItem(userId, itemId);
      } else {
        await CartService.updateQuantity(userId, itemId, quantity);
      }
      await loadCart();
    } catch (err) {
      console.error('Error actualizando cantidad:', err);
    }
  }, [userId, loadCart]);
 
  // Eliminar item del carrito
  const removeItem = useCallback(async (itemId) => {
    if (!userId) return;
    try {
      await CartService.removeItem(userId, itemId);
      await loadCart();
    } catch (err) {
      console.error('Error eliminando item:', err);
    }
  }, [userId, loadCart]);
 
  // Vaciar carrito completo
  const clearCart = useCallback(async () => {
    if (!userId) return;
    try {
      await CartService.clear(userId);
      setItems([]);
    } catch (err) {
      console.error('Error vaciando carrito:', err);
    }
  }, [userId]);
 
  // Cargar carrito cuando cambia el userId
  useEffect(() => {
    if (userId) {
      loadCart();
    } else {
      setItems([]);
    }
  }, [userId, loadCart]);
 
  return {
    items: safeItems,
    total,
    itemCount,
    loading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    loadCart,
  };
}