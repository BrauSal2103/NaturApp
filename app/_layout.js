import { useEffect } from 'react';
import { Stack } from 'expo-router';
import DatabaseService from
  '../src/services/databaseService';

export default function RootLayout() {
  // Inicializar SQLite al arrancar la app
  useEffect(() => {
    DatabaseService.init()
      .then(() => console.log('DB lista'))
      .catch(err => console.error(
        'Error DB:', err));
  }, []);

  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#1A5276' },
      headerTintColor: '#FFF',
    }}>
      <Stack.Screen name='(tabs)'
        options={{ headerShown: false }} />
      <Stack.Screen name='product/[id]'
        options={{ title: 'Detalle' }} />
    </Stack>
  );
}

