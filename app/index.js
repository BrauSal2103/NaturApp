import { Redirect } from 'expo-router';

export default function Index() {
  // Redirige automáticamente a la pestaña principal dentro del (tabs) layout
  return <Redirect href="/(tabs)/home" />;
}