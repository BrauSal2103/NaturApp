// app/auth/login.js
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,
         ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const router = useRouter();


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    try {
      await login(email, password);
      router.replace('/(tabs)/home');
    } catch (err) {
      Alert.alert('Error de autenticación', err.message);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a NaturApp</Text>
      <Text style={styles.subtitle}>
        Inicia sesión para continuar
      </Text>


      <TextInput style={styles.input}
        placeholder="Correo electrónico"
        value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" />


      <TextInput style={styles.input}
        placeholder="Contraseña" value={password}
        onChangeText={setPassword} secureTextEntry />


      <TouchableOpacity style={styles.button}
        onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>


      <TouchableOpacity
        onPress={() => router.push('/auth/register')}>
        <Text style={styles.link}>
          ¿No tienes cuenta? Regístrate aquí
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF',
               padding: 24, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold',
           color: '#1A5276', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#7F8C8D',
              textAlign: 'center', marginTop: 8,
              marginBottom: 32 },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1,
           borderColor: '#D5DBDB', borderRadius: 10,
           padding: 14, fontSize: 16, marginBottom: 14 },
  button: { backgroundColor: '#1A5276', padding: 16,
            borderRadius: 12, alignItems: 'center',
            marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 17,
                fontWeight: 'bold' },
  link: { color: '#2E86C1', textAlign: 'center',
          marginTop: 24, fontSize: 14 }
});

