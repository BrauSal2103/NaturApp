import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CategoryChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, active && styles.textActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EBF5FB', // Azul muy claro
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#148F77', // Verde característico de NaturApp
  },
  text: {
    fontSize: 14,
    color: '#1A5276',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  textActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});