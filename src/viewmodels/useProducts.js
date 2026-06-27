import { useState, useEffect, useCallback } from 'react';
import ApiService from '../services/apiService';
import StorageService from '../services/storageService';
import { Product } from '../models/Product';

// ============================================
// VIEWMODEL: Gestiona lógica de productos
// Conecta View (pantallas) con Data (API)
// ============================================
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Cargar productos desde la API (persistencia remota)
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cat = category === 'todos'
        ? null : category;
      const data = await ApiService.getProducts(cat);
      // Convertir JSON a instancias del Modelo
      const mapped = data.map(p => Product.fromJSON(p));
      setProducts(mapped);
      // Guardar última categoría (persist. básica)
      await StorageService.saveLastCategory(category);
    } catch (err) {
      setError('No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Búsqueda de productos
  const search = useCallback(async (query) => {
    if (!query.trim()) {
      loadProducts();
      return;
    }
    setLoading(true);
    try {
      const data = await ApiService.searchProducts(query);
      setProducts(data.map(p => Product.fromJSON(p)));
    } catch (err) {
      setError('Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  }, []);

  // Restaurar última categoría al iniciar
  useEffect(() => {
    StorageService.getLastCategory()
      .then(cat => setCategory(cat));
  }, []);

  // Recargar cuando cambia la categoría
  useEffect(() => { loadProducts(); }, [loadProducts]);

  return {
    products, loading, error,
    category, setCategory,
    searchQuery, setSearchQuery,
    search, refresh: loadProducts,
  };
}

