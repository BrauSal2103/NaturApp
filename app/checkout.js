// app/checkout.js
import { useState } from 'react';
import { View, Text, TextInput, ScrollView,
         TouchableOpacity, Alert, ActivityIndicator,
         StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../src/hooks/useCart';
import { useOrders } from '../src/hooks/useOrders';
import { Ionicons } from '@expo/vector-icons';


export default function CheckoutScreen() {
  const { items, total, clearCart } = useCart();
  const { createOrder } = useOrders();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '', city: '', zipCode: ''
  });


  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.zipCode) {
      Alert.alert('Error',
        'Completa todos los campos de dirección');
      return;
    }
    setLoading(true);
    try {
      // POST al endpoint /api/orders
      const orderData = {
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity
        })),
        shippingAddress: address,
        paymentMethod: 'cash'
      };
      await createOrder(orderData);
      await clearCart(); // DELETE /api/cart
      Alert.alert('Pedido Creado',
        'Tu pedido ha sido registrado exitosamente',
        [{ text: 'OK',
           onPress: () => router.replace('/(tabs)/orders') }]
      );
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>
        Dirección de Envío
      </Text>
      <TextInput style={styles.input}
        placeholder="Calle y número"
        value={address.street}
        onChangeText={(t) => setAddress({...address, street: t})}
      />
      <TextInput style={styles.input}
        placeholder="Ciudad"
        value={address.city}
        onChangeText={(t) => setAddress({...address, city: t})}
      />
      <TextInput style={styles.input}
        placeholder="Código Postal"
        value={address.zipCode}
        onChangeText={(t) => setAddress({...address, zipCode: t})}
        keyboardType="numeric"
      />


      <Text style={styles.sectionTitle}>Resumen</Text>
      {items.map(item => (
        <View key={item.productId} style={styles.itemRow}>
          <Text style={styles.itemName}>
            {item.name} x{item.quantity}
          </Text>
          <Text style={styles.itemPrice}>
            S/ {(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      ))}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total a Pagar:</Text>
        <Text style={styles.totalAmount}>
          S/ {total.toFixed(2)}
        </Text>
      </View>


      <TouchableOpacity style={styles.placeOrderBtn}
        onPress={handlePlaceOrder} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <>
            <Ionicons name="checkmark-circle"
              size={22} color="#FFF" />
            <Text style={styles.placeOrderText}>
              Confirmar Pedido
            </Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold',
                  color: '#1C2833', marginTop: 16,
                  marginBottom: 12 },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1,
           borderColor: '#D5DBDB', borderRadius: 10,
           padding: 14, fontSize: 15, marginBottom: 12 },
  itemRow: { flexDirection: 'row',
             justifyContent: 'space-between', paddingVertical: 8,
             borderBottomWidth: 1, borderBottomColor: '#F2F3F4' },
  itemName: { fontSize: 14, color: '#2C3E50', flex: 1 },
  itemPrice: { fontSize: 14, fontWeight: '600',
               color: '#1A5276' },
  totalRow: { flexDirection: 'row',
              justifyContent: 'space-between', marginTop: 16,
              paddingTop: 16, borderTopWidth: 2,
              borderTopColor: '#1A5276' },
  totalLabel: { fontSize: 18, fontWeight: '600',
                color: '#1C2833' },
  totalAmount: { fontSize: 22, fontWeight: 'bold',
                 color: '#1A5276' },
  placeOrderBtn: { flexDirection: 'row',
                   backgroundColor: '#148F77', padding: 16,
                   borderRadius: 12, justifyContent: 'center',
                   alignItems: 'center', marginTop: 30 },
  placeOrderText: { color: '#FFF', fontSize: 18,
                    fontWeight: 'bold', marginLeft: 10 }
});

