import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#148F77',
      headerStyle: {
        backgroundColor: '#1A5276' },
      headerTintColor: '#FFF',
    }}>
      <Tabs.Screen name='home' options={{
        title: 'NaturApp',
        tabBarIcon: ({ color, size }) =>
          <Ionicons name='leaf' size={size}
            color={color} /> }} />
      <Tabs.Screen name='cart' options={{
        title: 'Carrito',
        tabBarIcon: ({ color, size }) =>
          <Ionicons name='cart' size={size}
            color={color} /> }} />
      <Tabs.Screen name='orders' options={{
        title: 'Pedidos',
        tabBarIcon: ({ color, size }) =>
          <Ionicons name='receipt' size={size}
            color={color} /> }} />
      <Tabs.Screen name='profile' options={{
        title: 'Perfil',
        tabBarIcon: ({ color, size }) =>
          <Ionicons name='person' size={size}
            color={color} /> }} />
    </Tabs>
  );
}

