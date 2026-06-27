// src/components/CategoryChips.js
import { ScrollView, TouchableOpacity, Text,
         StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const ICONS = { 'Superalimentos': 'nutrition', 'Infusiones': 'cafe',
  'Suplementos': 'fitness', 'Cuidado Personal': 'flower',
  'Snacks': 'fast-food' };


export default function CategoryChips({ categories, selected,
                                        onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}>
      <TouchableOpacity
        style={[styles.chip, !selected && styles.chipActive]}
        onPress={() => onSelect(null)}>
        <Ionicons name="grid" size={16}
          color={!selected ? '#FFF' : '#1A5276'} />
        <Text style={[styles.chipText,
          !selected && styles.chipTextActive]}>Todos</Text>
      </TouchableOpacity>


      {categories.map((cat) => (
        <TouchableOpacity key={cat._id}
          style={[styles.chip,
            selected === cat._id && styles.chipActive]}
          onPress={() => onSelect(cat._id)}>
          <Ionicons
            name={ICONS[cat.name] || 'leaf'}
            size={16}
            color={selected === cat._id ? '#FFF' : '#1A5276'} />
          <Text style={[styles.chipText,
            selected === cat._id && styles.chipTextActive]}>
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { maxHeight: 52, backgroundColor: '#FFF',
               borderBottomWidth: 1,
               borderBottomColor: '#ECF0F1' },
  content: { paddingHorizontal: 12, paddingVertical: 8,
             alignItems: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 14, paddingVertical: 8,
          borderRadius: 20, backgroundColor: '#EBF5FB',
          marginRight: 8 },
  chipActive: { backgroundColor: '#1A5276' },
  chipText: { marginLeft: 6, fontSize: 13, fontWeight: '600',
              color: '#1A5276' },
  chipTextActive: { color: '#FFF' }
});

