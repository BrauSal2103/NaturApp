// app/product/[id].js
import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity,
         ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ProductAPI } from '../../src/services/apiService';
import { useCart } from '../../src/hooks/useCart';
import { Ionicons } from '@expo/vector-icons';


export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();


  // Consumo del endpoint GET /products/:id
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await ProductAPI.getById(id);
        setProduct(res.data);
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1A5276" />
      </View>
    );
  }


  if (!product) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={48}
          color="#E74C3C" />
        <Text style={styles.errorText}>
          Producto no encontrado
        </Text>
      </View>
    );
  }


  const handleAddToCart = async () => {
    try {
      await addItem(product);
      Alert.alert('Agregado',
        `${product.name} agregado al carrito`);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }}
        style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.category}>
          {product.category?.name}
        </Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>
          S/ {product.price.toFixed(2)}
        </Text>
        <Text style={styles.description}>
          {product.description}
        </Text>


        {product.nutritionalInfo && (
          <View style={styles.nutritionBox}>
            <Text style={styles.nutritionTitle}>
              Información Nutricional
            </Text>
            <Text>Calorías: {product.nutritionalInfo.calories}</Text>
            <Text>Proteína: {product.nutritionalInfo.protein}</Text>
            <Text>Fibra: {product.nutritionalInfo.fiber}</Text>
          </View>
        )}


        <View style={styles.stockRow}>
          <Ionicons name={product.stock > 0
            ? "checkmark-circle" : "close-circle"}
            size={20}
            color={product.stock > 0 ? "#148F77" : "#E74C3C"} />
          <Text style={[styles.stock,
            { color: product.stock > 0 ? "#148F77" : "#E74C3C" }]}>
            {product.stock > 0
              ? `${product.stock} disponibles`
              : 'Agotado'}
          </Text>
        </View>


        <TouchableOpacity style={[styles.addButton,
          !product.stock && styles.disabledButton]}
          onPress={handleAddToCart}
          disabled={!product.stock}>
          <Ionicons name="cart" size={22} color="#FFF" />
          <Text style={styles.addButtonText}>
            Agregar al Carrito
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  center: { flex: 1, justifyContent: 'center',
            alignItems: 'center' },
  image: { width: '100%', height: 300 },
  content: { padding: 20 },
  category: { fontSize: 13, color: '#148F77',
              textTransform: 'uppercase', fontWeight: '600' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1C2833',
          marginTop: 8 },
  price: { fontSize: 28, fontWeight: 'bold', color: '#1A5276',
           marginTop: 8 },
  description: { fontSize: 15, color: '#566573', marginTop: 16,
                 lineHeight: 22 },
  nutritionBox: { marginTop: 16, padding: 12,
                  backgroundColor: '#E8F8F5', borderRadius: 8 },
  nutritionTitle: { fontWeight: 'bold', marginBottom: 8,
                    color: '#148F77' },
  stockRow: { flexDirection: 'row', alignItems: 'center',
              marginTop: 16 },
  stock: { marginLeft: 8, fontSize: 14 },
  addButton: { flexDirection: 'row', backgroundColor: '#148F77',
               padding: 16, borderRadius: 12, alignItems: 'center',
               justifyContent: 'center', marginTop: 24 },
  disabledButton: { backgroundColor: '#BDC3C7' },
  addButtonText: { color: '#FFF', fontSize: 18,
                   fontWeight: 'bold', marginLeft: 10 },
  errorText: { marginTop: 12, color: '#E74C3C', fontSize: 16 }
});

