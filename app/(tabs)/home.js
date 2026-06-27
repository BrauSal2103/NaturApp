// app/(tabs)/home.js
import { View, FlatList, ActivityIndicator, StyleSheet,
         RefreshControl, Text } from 'react-native';
import { useProducts } from '../../src/hooks/useProducts';
import { useCart } from '../../src/hooks/useCart';
import ProductCard from '../../src/components/ProductCard';
import CategoryChips from '../../src/components/CategoryChips';


export default function HomeScreen() {
  const {
    products, categories, selectedCategory,
    loading, refreshing, hasMore,
    filterByCategory, loadMore, refresh
  } = useProducts();
  const { addItem } = useCart();


  // Spinner de carga inicial
  if (loading && products.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1A5276" />
        <Text style={styles.loadingText}>
          Cargando productos...
        </Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      {/* Filtros de categoría */}
      <CategoryChips
        categories={categories}
        selected={selectedCategory}
        onSelect={filterByCategory}
      />


      {/* Lista de productos con paginación */}
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onAddToCart={() => addItem(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing}
            onRefresh={refresh} colors={['#1A5276']} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore ? (
            <ActivityIndicator style={styles.footer}
              color="#1A5276" />
          ) : null
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            No se encontraron productos
          </Text>
        }
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center',
            alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#7F8C8D',
                 fontSize: 14 },
  list: { padding: 8 },
  footer: { paddingVertical: 20 },
  empty: { textAlign: 'center', marginTop: 40,
           color: '#95A5A6', fontSize: 16 }
});

