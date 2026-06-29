// src/components/ProductCard.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';


export default function ProductCard({ product, onAddToCart }) {
  const router = useRouter();


  return (
    <TouchableOpacity style={styles.card}
      onPress={() => router.push(`/product/${product._id}`)}
      activeOpacity={0.7}>
      <Image source={{ uri: product.image }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category?.name}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.row}>
          <Text style={styles.price}>
            S/ {product.price.toFixed(2)}
          </Text>
          <TouchableOpacity style={styles.addBtn}
            onPress={onAddToCart}>
            <Ionicons name="add-circle"
              size={28} color="#148F77" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  card: {
    flex: 1, margin: 6, backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
    overflow: 'hidden', maxWidth: '48%'
  },
  image: { width: '100%', height: 140,
           backgroundColor: '#ECF0F1' },
  info: { padding: 10 },
  category: { fontSize: 11, color: '#148F77',
              textTransform: 'uppercase', fontWeight: '600' },
  name: { fontSize: 14, fontWeight: 'bold', color: '#2C3E50',
          marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between',
         alignItems: 'center', marginTop: 8 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#1A5276' },
  addBtn: { padding: 4 }
});

