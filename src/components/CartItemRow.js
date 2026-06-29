// src/components/CartItemRow.js
// ============================================
// Componente Fila del Carrito
// Sesión 11: Item individual con controles de cantidad
// ============================================
 
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
 
export default function CartItemRow({ item, onUpdateQuantity, onRemove }) {
  return (
    <View style={styles.row}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/60x60.png?text=Item' }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>S/ {(item.price || 0).toFixed(2)}</Text>
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => onUpdateQuantity?.(item.id, item.quantity - 1)}
          >
            <Text style={styles.qtyButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove?.(item.id)}
          >
            <Text style={styles.removeText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.subtotal}>
        S/ {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
      </Text>
    </View>
  );
}
 
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  price: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  qtyButton: {
    backgroundColor: '#e8f5e9',
    borderRadius: 6,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d6a4f',
  },
  quantity: {
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 10,
    color: '#1a1a2e',
  },
  removeButton: {
    marginLeft: 12,
  },
  removeText: {
    fontSize: 12,
    color: '#e63946',
  },
  subtotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d6a4f',
    marginLeft: 8,
  },
});
