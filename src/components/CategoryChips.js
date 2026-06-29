// src/components/CategoryChips.js
// ============================================
// Componente Chips de Categorías
// Sesión 11: Filtro horizontal de categorías
// ============================================
 
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
 
export default function CategoryChips({ categories, selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[styles.chip, !selected && styles.chipActive]}
        onPress={() => onSelect?.(null)}
      >
        <Text style={[styles.chipText, !selected && styles.chipTextActive]}>Todos</Text>
      </TouchableOpacity>
      {(categories || []).map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.chip, selected === cat.id && styles.chipActive]}
          onPress={() => onSelect?.(cat.id)}
        >
          <Text style={[styles.chipText, selected === cat.id && styles.chipTextActive]}>
            {cat.icon ? `${cat.icon} ` : ''}{cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#2d6a4f',
  },
  chipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
