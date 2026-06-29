// app/checkout.js
// ============================================
// Pantalla de Checkout
// Sesión 11: Confirmar pedido → Firestore
// ============================================
 
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../src/hooks/useAuth';
import { useCart } from '../src/hooks/useCart';
import { useOrders } from '../src/hooks/useOrders';
 
export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, total, clearCart } = useCart(user?.id);
  const { createOrder } = useOrders(user?.id);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
 
  const handleSubmit = async () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Ingresa una dirección de entrega');
      return;
    }
    if (items.length === 0) {
      Alert.alert('Error', 'Tu carrito está vacío');
      return;
    }
 
    setSubmitting(true);
    try {
      const order = await createOrder({
        items: items.map((i) => ({
          productId: i.productId || i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        total,
        address: address.trim(),
        notes: notes.trim(),
        status: 'pending',
      });
 
      if (order) {
        await clearCart();
        Alert.alert(
          'Pedido Confirmado',
          'Tu pedido ha sido registrado en Firebase exitosamente.',
          [{ text: 'Ver Pedidos', onPress: () => router.replace('/(tabs)/orders') }]
        );
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear el pedido');
    } finally {
      setSubmitting(false);
    }
  };
 
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
            <Text style={styles.itemPrice}>S/ {(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View style={[styles.itemRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>S/ {total.toFixed(2)}</Text>
        </View>
      </View>
 
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos de Entrega</Text>
        <TextInput
          style={styles.input}
          placeholder="Dirección de entrega"
          value={address}
          onChangeText={setAddress}
          multiline
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Notas adicionales (opcional)"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>
 
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cliente</Text>
        <Text style={styles.clientInfo}>{user?.name} — {user?.email}</Text>
      </View>
 
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Confirmar Pedido</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2d6a4f', marginBottom: 12 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  itemName: { fontSize: 14, color: '#333', flex: 1 },
  itemPrice: { fontSize: 14, fontWeight: '600', color: '#333' },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 10,
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#2d6a4f' },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  clientInfo: { fontSize: 14, color: '#555' },
  submitButton: {
    backgroundColor: '#2d6a4f',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
