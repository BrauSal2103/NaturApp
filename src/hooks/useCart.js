// src/hooks/useCart.js
import { useState, useEffect, useCallback } from 'react';
import { CartAPI } from '../services/apiService';


export function useCart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Cargar carrito desde el servidor
  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CartAPI.get();
      setItems(res.data.items);
      setTotal(res.data.total);
      setCount(res.data.count);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => { loadCart(); }, [loadCart]);


  // Agregar producto al carrito
  const addItem = useCallback(async (product) => {
    try {
      const res = await CartAPI.addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      await loadCart(); // Recargar para sincronizar
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadCart]);


  // Actualizar cantidad
  const updateQuantity = useCallback(async (productId, qty) => {
    try {
      await CartAPI.updateQuantity(productId, qty);
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  }, [loadCart]);


  // Eliminar producto
  const removeItem = useCallback(async (productId) => {
    try {
      await CartAPI.removeItem(productId);
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  }, [loadCart]);


  // Vaciar carrito
  const clearCart = useCallback(async () => {
    try {
      await CartAPI.clear();
      setItems([]);
      setTotal(0);
      setCount(0);
    } catch (err) {
      setError(err.message);
    }
  }, []);


  return {
    items, total, count, loading, error,
    addItem, updateQuantity, removeItem, clearCart, loadCart
  };
}

