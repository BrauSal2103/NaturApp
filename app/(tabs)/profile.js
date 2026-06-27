import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useProfile } from '../../src/viewmodels/useProfile';

export default function ProfileScreen() {
  const { name, email, toggleTheme } = useProfile();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text>Nombre: {name}</Text>
      <Text>Email: {email}</Text>
      <Button title="Alternar Modo Oscuro" onPress={toggleTheme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 }
});