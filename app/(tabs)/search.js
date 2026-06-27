// app/(tabs)/search.js
import { useState, useCallback } from 'react';
import { View, TextInput, FlatList, ActivityIndicator,
         StyleSheet, Text } from 'react-native';
import { ProductAPI } from '../../src/services/apiService';
import ProductCard from '../../src/components/ProductCard';
import { useCart } from '../../src/hooks/useCart';
import { Ionicons } from '@expo/vector-icons';


export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { addItem } = useCart();


  // Búsqueda con debounce manual
  const handleSearch = useCallback(async (text) => {
    setQuery(text);
    if (text.length < 2) { setResults([]); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await ProductAPI.search(text);
      setResults(res.data);
    } catch (err) {
      console.error('Error en búsqueda:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#95A5A6" />
        <TextInput style={styles.input}
          placeholder="Buscar productos naturales..."
          value={query}
          onChangeText={handleSearch}
          placeholderTextColor="#95A5A6"
        />
      </View>


      {loading ? (
        <ActivityIndicator style={styles.loader}
          size="large" color="#1A5276" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProductCard product={item}
              onAddToCart={() => addItem(item)} />
          )}
          ListEmptyComponent={searched ? (
            <Text style={styles.empty}>
              No se encontraron resultados
            </Text>
          ) : null}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  searchBar: { flexDirection: 'row', alignItems: 'center',
               backgroundColor: '#FFF', margin: 12, padding: 12,
               borderRadius: 10, shadowColor: '#000',
               shadowOpacity: 0.08, shadowRadius: 4,
               elevation: 2 },
  input: { flex: 1, marginLeft: 10, fontSize: 16,
           color: '#2C3E50' },
  loader: { marginTop: 40 },
  list: { padding: 8 },
  empty: { textAlign: 'center', marginTop: 40,
           color: '#95A5A6', fontSize: 15 }
});

