import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
// Asumiendo que crearás un hook o usarás una lógica simple para buscar el producto
export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del Producto</Text>
      <Text>ID del producto: {id}</Text>
      {/* Aquí cargarías el producto específico usando el ID */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold' }
});