import React from 'react';
import { View, Text, Image,
  TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function ProductCard({
  product, onAddToCart }) {
  return (
    <View style={styles.card}>
      <Link href={`/product/${product.id}`}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
        />
      </Link>
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.category}>
        {product.category}
      </Text>
      <View style={styles.row}>
        <Text style={styles.price}>
          {product.getFormattedPrice()}
        </Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={onAddToCart}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#FFF',
    borderRadius: 12, margin: 6, padding: 10,
    elevation: 2, maxWidth: '48%' },
  image: { width: '100%', height: 120,
    borderRadius: 8 },
  name: { fontSize: 14, fontWeight: '600',
    color: '#333', marginTop: 8 },
  category: { fontSize: 11, color: '#888',
    textTransform: 'capitalize', marginTop: 2 },
  row: { flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', marginTop: 8 },
  price: { fontSize: 16, fontWeight: 'bold',
    color: '#148F77' },
  addBtn: { backgroundColor: '#148F77',
    borderRadius: 16, width: 32, height: 32,
    alignItems: 'center',
    justifyContent: 'center' },
  addText: { color: '#FFF', fontSize: 20,
    fontWeight: 'bold' },
});

