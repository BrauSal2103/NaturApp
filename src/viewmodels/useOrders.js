import { useState, useCallback } from 'react';
import ApiService from '../services/apiService';
import { Order } from '../models/Order';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getOrders();
      setOrders(data.map(o => Order.fromJSON(o)));
    } catch (err) {
      setError('No se pudo cargar el historial');
    } finally {
      setLoading(false);
    }
  }, []);

  return { orders, loading, error,
           refresh: loadOrders };
}

