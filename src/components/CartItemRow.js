// src/components/CartItemRow.js
import { View, Text, Image, TouchableOpacity,
         StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function CartItemRow({ item, onUpdateQty,
                                      onRemove }) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: item.image }}
        style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.price}>
          S/ {item.price.toFixed(2)}
        </Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            onPress={() => onUpdateQty(item.quantity - 1)}
            style={styles.qtyBtn}>
            <Ionicons name="remove-circle-outline"
              size={24} color="#1A5276" />
          </TouchableOpacity>
          <Text style={styles.qty}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => onUpdateQty(item.quantity + 1)}
            style={styles.qtyBtn}>
            <Ionicons name="add-circle-outline"
              size={24} color="#1A5276" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.subtotal}>
          S/ {(item.price * item.quantity).toFixed(2)}
        </Text>
        <TouchableOpacity onPress={onRemove}
          style={styles.removeBtn}>
          <Ionicons name="trash-outline"
            size={20} color="#E74C3C" />
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  row: { flexDirection: 'row', backgroundColor: '#FFF',
         borderRadius: 10, padding: 12, marginBottom: 10,
         shadowColor: '#000', shadowOpacity: 0.05,
         shadowRadius: 4, elevation: 2 },
  image: { width: 70, height: 70, borderRadius: 8,
           backgroundColor: '#ECF0F1' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 14, fontWeight: '600', color: '#2C3E50' },
  price: { fontSize: 13, color: '#7F8C8D', marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center',
            marginTop: 6 },
  qtyBtn: { padding: 2 },
  qty: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 12,
         color: '#1C2833' },
  right: { alignItems: 'flex-end',
           justifyContent: 'space-between' },
  subtotal: { fontSize: 15, fontWeight: 'bold',
              color: '#1A5276' },
  removeBtn: { marginTop: 8 }
});

