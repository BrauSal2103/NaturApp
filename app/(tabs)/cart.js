// app/(tabs)/cart.js
import { View, Text, FlatList, TouchableOpacity,
         ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../src/hooks/useCart';
import CartItemRow from '../../src/components/CartItemRow';
import { Ionicons } from '@expo/vector-icons';


export default function CartScreen() {
  const { items, total, loading, updateQuantity,
          removeItem, clearCart } = useCart();
  const router = useRouter();


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1A5276" />
      </View>
    );
  }


  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="cart-outline" size={64}
          color="#BDC3C7" />
        <Text style={styles.emptyText}>
          Tu carrito está vacío
        </Text>
      </View>
    );
  }


  const handleCheckout = () => {
    router.push('/checkout');
  };


  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            onUpdateQty={(qty) =>
              updateQuantity(item.productId, qty)}
            onRemove={() => removeItem(item.productId)}
          />
        )}
        contentContainerStyle={styles.list}
      />


      {/* Resumen del carrito */}
      <View style={styles.summary}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>
            S/ {total.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn}
          onPress={handleCheckout}>
          <Text style={styles.checkoutText}>
            Proceder al Pago
          </Text>
          <Ionicons name="arrow-forward" size={20}
            color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearBtn}
          onPress={() => {
            Alert.alert('Vaciar carrito',
              '¿Estás seguro?',
              [{ text: 'Cancelar' },
               { text: 'Sí', onPress: clearCart }]);
          }}>
          <Text style={styles.clearText}>Vaciar carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center',
            alignItems: 'center' },
  emptyText: { marginTop: 16, fontSize: 16, color: '#95A5A6' },
  list: { padding: 12 },
  summary: { padding: 16, backgroundColor: '#FFF',
             borderTopWidth: 1, borderTopColor: '#ECF0F1' },
  totalRow: { flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16 },
  totalLabel: { fontSize: 18, fontWeight: '600',
                color: '#2C3E50' },
  totalAmount: { fontSize: 22, fontWeight: 'bold',
                 color: '#1A5276' },
  checkoutBtn: { flexDirection: 'row', backgroundColor: '#148F77',
                 padding: 16, borderRadius: 12,
                 justifyContent: 'center', alignItems: 'center' },
  checkoutText: { color: '#FFF', fontSize: 17,
                  fontWeight: 'bold', marginRight: 8 },
  clearBtn: { marginTop: 10, padding: 10,
              alignItems: 'center' },
  clearText: { color: '#E74C3C', fontSize: 14 }
});

