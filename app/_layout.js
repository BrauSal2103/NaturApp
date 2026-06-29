// app/_layout.js
// ============================================
// Layout Principal — Expo Router
// Sesión 11: Navegación raíz con Firebase
// ============================================
 
import { Stack } from 'expo-router';
 
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="product/[id]"
        options={{ headerShown: true, title: 'Detalle', headerTintColor: '#2d6a4f' }}
      />
      <Stack.Screen
        name="checkout"
        options={{ headerShown: true, title: 'Confirmar Pedido', headerTintColor: '#2d6a4f' }}
      />
      <Stack.Screen
        name="auth/login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/register"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
