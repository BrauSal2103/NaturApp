// src/hooks/useOrders.js
// ============================================
// Hook de Pedidos — Firestore Service
// Sesión 11: Gestión de órdenes con Firebase
// ============================================
 
import { useCallback, useState } from 'react';
import { OrderService } from '../services/firestoreService';
 
export function useOrders(userId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  // Cargar pedidos del usuario
  const loadOrders = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await OrderService.getByUser(userId);
      setOrders(data);
    } catch (err) {
      console.error('Error cargando pedidos:', err);
      setError('No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, [userId]);
 
  // Crear nuevo pedido
  const createOrder = useCallback(async (orderData) => {
    if (!userId) return null;
    setLoading(true);
    setError(null);
    try {
      const order = await OrderService.create({
        ...orderData,
        userId,
      });
      await loadOrders(); // Recargar lista
      return order;
    } catch (err) {
      console.error('Error creando pedido:', err);
      setError('No se pudo crear el pedido');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, loadOrders]);
 
  // Cancelar pedido
  const cancelOrder = useCallback(async (orderId) => {
    setLoading(true);
    try {
      await OrderService.cancel(orderId);
      await loadOrders();
    } catch (err) {
      console.error('Error cancelando pedido:', err);
      setError('No se pudo cancelar el pedido');
    } finally {
      setLoading(false);
    }
  }, [loadOrders]);
 
  return {
    orders,
    loading,
    error,
    loadOrders,
    createOrder,
    cancelOrder,
  };
}
