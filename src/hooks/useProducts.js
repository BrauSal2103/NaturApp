// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import { ProductAPI, CategoryAPI } from '../services/apiService';


export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);


  // Carga inicial de productos y categorías (paralelo)
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        ProductAPI.getAll({ page: 1, limit: 20 }),
        CategoryAPI.getAll()
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setHasMore(prodRes.pagination.page
                 < prodRes.pagination.pages);
      setPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => { loadInitialData(); }, [loadInitialData]);


  // Filtrar por categoría
  const filterByCategory = useCallback(async (categoryId) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    try {
      const params = categoryId
        ? { category: categoryId, page: 1 }
        : { page: 1 };
      const res = await ProductAPI.getAll(params);
      setProducts(res.data);
      setHasMore(res.pagination.page < res.pagination.pages);
      setPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);


  // Buscar productos
  const searchProducts = useCallback(async (term) => {
    if (!term.trim()) { loadInitialData(); return; }
    setLoading(true);
    try {
      const res = await ProductAPI.search(term);
      setProducts(res.data);
      setHasMore(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadInitialData]);


  // Cargar más productos (paginación)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    try {
      const params = { page: nextPage, limit: 20 };
      if (selectedCategory) params.category = selectedCategory;
      const res = await ProductAPI.getAll(params);
      setProducts(prev => [...prev, ...res.data]);
      setHasMore(res.pagination.page < res.pagination.pages);
      setPage(nextPage);
    } catch (err) {
      setError(err.message);
    }
  }, [hasMore, loading, page, selectedCategory]);


  // Pull-to-refresh
  const refresh = useCallback(async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  }, [loadInitialData]);


  return {
    products, categories, selectedCategory, loading,
    refreshing, error, hasMore,
    filterByCategory, searchProducts, loadMore, refresh
  };
}

