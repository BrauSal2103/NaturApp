// src/components/ProductCard.js
// ============================================
// Componente Tarjeta de Producto
// Sesión 11: UI reutilizable
// ============================================
 
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
 
export default function ProductCard({ product, onPress, onAddToCart }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(product)} activeOpacity={0.7}>
      <Image
        source={{ uri: product.image || 'https://via.placeholder.com/150x150.png?text=Producto' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.category}>{product.category || 'General'}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>S/ {(product.price || 0).toFixed(2)}</Text>
          {product.stock !== undefined && (
            <Text style={[styles.stock, product.stock <= 0 && styles.outOfStock]}>
              {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
            </Text>
          )}
        </View>
        {onAddToCart && product.stock > 0 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={(e) => { e.stopPropagation?.(); onAddToCart(product); }}
          >
            <Text style={styles.addButtonText}>+ Agregar</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}
 
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 110,
    height: 110,
    backgroundColor: '#f0f0f0',
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d6a4f',
  },
  stock: {
    fontSize: 11,
    color: '#666',
  },
  outOfStock: {
    color: '#e63946',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#2d6a4f',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
