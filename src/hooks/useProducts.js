// src/hooks/useProducts.js
// ============================================
// Hook de Productos — Firestore Service
// Sesión 11: Consulta de productos con Firebase
// ============================================
 
import { useCallback, useEffect, useState } from 'react';
import { CategoryService, ProductService } from '../services/firestoreService';
 
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
 
  // Cargar productos (opcionalmente filtrados por categoría)
  const loadProducts = useCallback(async (categoryId = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductService.getAll(categoryId);
      setProducts(data);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);
 
  // Cargar categorías
  const loadCategories = useCallback(async () => {
    try {
      const data = await CategoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  }, []);
 
  // Buscar productos por texto
  const searchProducts = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductService.search(query);
      setProducts(data);
    } catch (err) {
      console.error('Error buscando productos:', err);
      setError('Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  }, []);
 
  // Obtener producto por ID
  const getProductById = useCallback(async (productId) => {
    try {
      return await ProductService.getById(productId);
    } catch (err) {
      console.error('Error obteniendo producto:', err);
      return null;
    }
  }, []);
 
  // Filtrar por categoría
  const filterByCategory = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    loadProducts(categoryId);
  }, [loadProducts]);
 
  // Carga inicial
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);
 
  return {
    products,
    categories,
    loading,
    error,
    selectedCategory,
    loadProducts,
    searchProducts,
    getProductById,
    filterByCategory,
  };
}
