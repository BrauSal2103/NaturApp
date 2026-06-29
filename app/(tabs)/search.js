// app/(tabs)/search.js
// ============================================
// Pantalla de Búsqueda
// Sesión 11: Búsqueda client-side con Firestore
// ============================================
 
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ProductCard from '../../src/components/ProductCard';
import { useAuth } from '../../src/hooks/useAuth';
import { useCart } from '../../src/hooks/useCart';
import { useProducts } from '../../src/hooks/useProducts';
 
export default function SearchScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { products, loading, searchProducts, loadProducts } = useProducts();
  const { addItem } = useCart(user?.id);
  const [query, setQuery] = useState('');
 
  const handleSearch = () => {
    if (query.trim()) {
      searchProducts(query.trim());
    } else {
      loadProducts();
    }
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
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Buscar productos naturales..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>
 
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={(p) => router.push(`/product/${p.id}`)}
            onAddToCart={handleAddToCart}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>
                {query ? 'No se encontraron resultados' : 'Escribe para buscar productos'}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchButton: {
    backgroundColor: '#2d6a4f',
    borderRadius: 12,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: { fontSize: 20 },
  list: { padding: 16, paddingTop: 0 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#888', textAlign: 'center' },
});
