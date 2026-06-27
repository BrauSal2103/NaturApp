// src/hooks/useOrders.js
import { useState, useCallback } from 'react';
import { OrderAPI } from '../services/apiService';


export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Cargar pedidos del usuario
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await OrderAPI.getAll();
      setOrders(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);


  // Crear nuevo pedido
  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    try {
      const res = await OrderAPI.create(orderData);
      setOrders(prev => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  // Cancelar pedido
  const cancelOrder = useCallback(async (orderId) => {
    try {
      const res = await OrderAPI.cancel(orderId);
      setOrders(prev => prev.map(o =>
        o._id === orderId ? res.data : o
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);


  return { orders, loading, error,
    loadOrders, createOrder, cancelOrder };
}

