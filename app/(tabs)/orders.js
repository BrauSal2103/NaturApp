// app/(tabs)/orders.js
import { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator,
         TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useOrders } from '../../src/hooks/useOrders';
import { Ionicons } from '@expo/vector-icons';


const STATUS_MAP = {
  pending:   { label: 'Pendiente', color: '#F39C12', icon: 'time' },
  confirmed: { label: 'Confirmado', color: '#2E86C1', icon: 'checkmark' },
  shipped:   { label: 'Enviado', color: '#8E44AD', icon: 'airplane' },
  delivered: { label: 'Entregado', color: '#148F77', icon: 'checkmark-done' },
  cancelled: { label: 'Cancelado', color: '#E74C3C', icon: 'close' },
};


export default function OrdersScreen() {
  const { orders, loading, loadOrders, cancelOrder } = useOrders();


  useEffect(() => { loadOrders(); }, [loadOrders]);


  if (loading && orders.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1A5276" />
      </View>
    );
  }


  const handleCancel = (orderId) => {
    Alert.alert('Cancelar Pedido', '¿Estás seguro?',
      [{ text: 'No' },
       { text: 'Sí', style: 'destructive',
         onPress: () => cancelOrder(orderId) }]);
  };


  const renderOrder = ({ item }) => {
    const status = STATUS_MAP[item.status] || STATUS_MAP.pending;
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.orderId}>
            Pedido #{item._id.slice(-6).toUpperCase()}
          </Text>
          <View style={[styles.badge,
            { backgroundColor: status.color }]}>
            <Ionicons name={status.icon}
              size={14} color="#FFF" />
            <Text style={styles.badgeText}>
              {status.label}
            </Text>
          </View>
        </View>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString('es-PE')}
        </Text>
        <Text style={styles.items}>
          {item.items.length} producto(s)
        </Text>
        <View style={styles.footer}>
          <Text style={styles.total}>
            S/ {item.total.toFixed(2)}
          </Text>
          {item.status === 'pending' && (
            <TouchableOpacity
              onPress={() => handleCancel(item._id)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="receipt-outline" size={48}
              color="#BDC3C7" />
            <Text style={styles.emptyText}>
              No tienes pedidos aún
            </Text>
          </View>
        }
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center',
            alignItems: 'center', paddingTop: 60 },
  list: { padding: 12 },
  card: { backgroundColor: '#FFF', borderRadius: 12,
          padding: 16, marginBottom: 12,
          shadowColor: '#000', shadowOpacity: 0.06,
          shadowRadius: 4, elevation: 2 },
  header: { flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center' },
  orderId: { fontSize: 15, fontWeight: 'bold',
             color: '#1C2833' },
  badge: { flexDirection: 'row', alignItems: 'center',
           paddingHorizontal: 8, paddingVertical: 4,
           borderRadius: 12 },
  badgeText: { color: '#FFF', fontSize: 12,
               fontWeight: '600', marginLeft: 4 },
  date: { fontSize: 13, color: '#7F8C8D', marginTop: 6 },
  items: { fontSize: 13, color: '#566573', marginTop: 2 },
  footer: { flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center', marginTop: 12,
            paddingTop: 12, borderTopWidth: 1,
            borderTopColor: '#ECF0F1' },
  total: { fontSize: 18, fontWeight: 'bold', color: '#1A5276' },
  cancelText: { color: '#E74C3C', fontSize: 14,
                fontWeight: '600' },
  emptyText: { marginTop: 12, color: '#95A5A6', fontSize: 15 }
});

