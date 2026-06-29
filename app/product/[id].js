// app/product/[id].js
// ============================================
// Pantalla de Detalle de Producto
// Sesión 11: Vista detallada con Firestore
// ============================================
 
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../src/hooks/useAuth';
import { useCart } from '../../src/hooks/useCart';
import { useProducts } from '../../src/hooks/useProducts';
 
export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getProductById } = useProducts();
  const { addItem } = useCart(user?.id);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const load = async () => {
      const p = await getProductById(id);
      setProduct(p);
      setLoading(false);
    };
    load();
  }, [id, getProductById]);
 
  const handleAddToCart = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    await addItem(product);
    Alert.alert('Agregado', `${product.name} se agregó al carrito`);
  };
 
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2d6a4f" />
      </View>
    );
  }
 
  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Producto no encontrado</Text>
      </View>
    );
  }
 
  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: product.image || 'https://via.placeholder.com/400x300.png?text=Producto' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.category}>{product.category || 'General'}</Text>
          <Text style={[styles.stockBadge, product.stock <= 0 && styles.outOfStock]}>
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
          </Text>
        </View>
 
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>S/ {(product.price || 0).toFixed(2)}</Text>
 
        <Text style={styles.descTitle}>Descripción</Text>
        <Text style={styles.description}>{product.description || 'Sin descripción disponible.'}</Text>
 
        {product.benefits && (
          <>
            <Text style={styles.descTitle}>Beneficios</Text>
            <Text style={styles.description}>{product.benefits}</Text>
          </>
        )}
 
        {product.stock > 0 && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
            <Text style={styles.addButtonText}>🛒 Agregar al Carrito</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 280, backgroundColor: '#f0f0f0' },
  content: { padding: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 13,
    color: '#2d6a4f',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '500',
  },
  stockBadge: { fontSize: 12, color: '#666' },
  outOfStock: { color: '#e63946', fontWeight: '600' },
  name: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', marginBottom: 6 },
  price: { fontSize: 24, fontWeight: '700', color: '#2d6a4f', marginBottom: 16 },
  descTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a2e', marginBottom: 6, marginTop: 10 },
  description: { fontSize: 14, color: '#555', lineHeight: 22 },
  addButton: {
    backgroundColor: '#2d6a4f',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  addButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  errorText: { fontSize: 16, color: '#888' },
});
