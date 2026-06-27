import React from 'react';
import {
  View, Text, FlatList, TextInput,
  StyleSheet, ActivityIndicator,
  ScrollView, RefreshControl,
} from 'react-native';
import { useProducts } from
  '../../src/viewmodels/useProducts';
import { useCart } from
  '../../src/viewmodels/useCart';
import ProductCard from
  '../../src/components/ProductCard';
import CategoryChip from
  '../../src/components/CategoryChip';

const CATEGORIES = [
  'todos', 'superfoods', 'aceites',
  'capsulas', 'infusiones', 'miel',
];

export default function HomeScreen() {
  // Obtener datos del ViewModel (NO del servicio)
  const {
    products, loading, error,
    category, setCategory,
    searchQuery, setSearchQuery,
    search, refresh,
  } = useProducts();
  const { addItem } = useCart();

  const handleAddToCart = async (product) => {
    try {
      await addItem(product);
      alert(`${product.name} agregado al carrito`);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <TextInput
        style={styles.searchBar}
        placeholder='Buscar productos naturales...'
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={() => search(searchQuery)}
      />

      {/* Chips de categorías */}
      <ScrollView horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}>
        {CATEGORIES.map(cat => (
          <CategoryChip
            key={cat}
            label={cat}
            active={category === cat}
            onPress={() => setCategory(cat)}
          />
        ))}
      </ScrollView>

      {/* Lista de productos */}
      {loading ? (
        <ActivityIndicator size='large'
          color='#148F77' />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onAddToCart={() =>
                handleAddToCart(item)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5',
    padding: 12 },
  searchBar: { backgroundColor: '#FFF',
    borderRadius: 10, padding: 12,
    fontSize: 15, marginBottom: 10,
    borderWidth: 1, borderColor: '#E0E0E0' },
  categories: { marginBottom: 10,
    maxHeight: 44 },
  error: { color: '#E74C3C', textAlign: 'center',
    marginTop: 40, fontSize: 16 },
});

