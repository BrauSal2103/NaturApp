// app/(tabs)/cart.js
// ============================================
// Pantalla de Carrito
// Sesión 11: Carrito con Firestore subcollection
// ============================================
 
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CartItemRow from '../../src/components/CartItemRow';
import { useAuth } from '../../src/hooks/useAuth';
import { useCart } from '../../src/hooks/useCart';
 
export default function CartScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, total, itemCount, loading, updateQuantity, removeItem, clearCart } = useCart(user?.id);
 
  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>🔒</Text>
        <Text style={styles.emptyText}>Inicia sesión para ver tu carrito</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/auth/login')}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }
 
  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyText}>Tu carrito está vacío</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/(tabs)/home')}>
          <Text style={styles.loginButtonText}>Explorar Productos</Text>
        </TouchableOpacity>
      </View>
    );
  }
 
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        // 👇 ESTA ES LA LÍNEA MODIFICADA 👇
        keyExtractor={(item) => item.docId || item.productId || Math.random().toString()}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        )}
        contentContainerStyle={styles.list}
      />
 
      <View style={styles.footer}>
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Total ({itemCount} items)</Text>
          <Text style={styles.summaryTotal}>S/ {total.toFixed(2)}</Text>
        </View>
        <View style={styles.footerButtons}>
          <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
            <Text style={styles.clearButtonText}>Vaciar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => router.push('/checkout')}
          >
            <Text style={styles.checkoutButtonText}>Proceder al Pago</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  list: { padding: 16 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 17, color: '#888', marginBottom: 20 },
  loginButton: {
    backgroundColor: '#2d6a4f',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  loginButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 15, color: '#666' },
  summaryTotal: { fontSize: 20, fontWeight: '700', color: '#2d6a4f' },
  footerButtons: { flexDirection: 'row', gap: 10 },
  clearButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e63946',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearButtonText: { color: '#e63946', fontWeight: '600' },
  checkoutButton: {
    flex: 2,
    backgroundColor: '#2d6a4f',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  checkoutButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
