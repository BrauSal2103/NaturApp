import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useOrders } from '../../src/viewmodels/useOrders';

export default function OrdersScreen() {
  const { orders, loading } = useOrders();

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>Pedido #{item.id}</Text>
            <Text>Total: {item.total}</Text>
            <Text style={{ color: item.getStatusColor() }}>Estado: {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay pedidos aún.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  orderCard: { padding: 16, backgroundColor: '#FFF', marginBottom: 10, borderRadius: 8 },
  orderTitle: { fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 20 }
});