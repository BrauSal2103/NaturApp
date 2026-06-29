// app/(tabs)/home.js
// ============================================
// Pantalla de Inicio — Lista de Productos
// Sesión 11: Home con Firebase Firestore
// ============================================
 
import { useRouter } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import CategoryChips from '../../src/components/CategoryChips';
import ProductCard from '../../src/components/ProductCard';
import { useAuth } from '../../src/hooks/useAuth';
import { useCart } from '../../src/hooks/useCart';
import { useProducts } from '../../src/hooks/useProducts';
 
export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { products, categories, loading, error, selectedCategory, loadProducts, filterByCategory } = useProducts();
  const { addItem } = useCart(user?.id);
 
  const handleProductPress = (product) => {
    router.push(`/product/${product.id}`);
  };
 
  const handleAddToCart = async (product) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    await addItem(product);
  };
 
  return (
    <View style={styles.container}>
      <CategoryChips
        categories={categories}
        selected={selectedCategory}
        onSelect={filterByCategory}
      />
 
      {error && <Text style={styles.error}>{error}</Text>}
 
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={handleProductPress}
            onAddToCart={handleAddToCart}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => loadProducts(selectedCategory)}
            colors={['#2d6a4f']}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🌱</Text>
              <Text style={styles.emptyText}>No hay productos disponibles</Text>
            </View>
          )
        }
      />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16 },
  error: {
    color: '#e63946',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#fdecea',
    marginHorizontal: 16,
    borderRadius: 8,
  },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#888' },
});
