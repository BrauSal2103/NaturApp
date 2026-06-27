// app/(tabs)/profile.js
import { View, Text, TouchableOpacity, StyleSheet,
         Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';


export default function ProfileScreen() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1A5276" />
      </View>
    );
  }


  if (!user) {
    return (
      <View style={styles.center}>
        <Ionicons name="person-circle-outline"
          size={80} color="#BDC3C7" />
        <Text style={styles.guestText}>
          Inicia sesión para ver tu perfil
        </Text>
        <TouchableOpacity style={styles.loginBtn}
          onPress={() => router.push('/auth/login')}>
          <Text style={styles.loginBtnText}>
            Iniciar Sesión
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/auth/register')}>
          <Text style={styles.registerLink}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>
      </View>
    );
  }


  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro?',
      [{ text: 'Cancelar' },
       { text: 'Sí', onPress: logout }]);
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>


      <View style={styles.menu}>
        <MenuItem icon="location" label="Mis Direcciones" />
        <MenuItem icon="heart" label="Favoritos" />
        <MenuItem icon="settings" label="Configuración" />
        <MenuItem icon="help-circle" label="Ayuda" />
      </View>


      <TouchableOpacity style={styles.logoutBtn}
        onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22}
          color="#E74C3C" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}


function MenuItem({ icon, label }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <Ionicons name={icon} size={22} color="#1A5276" />
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20}
        color="#BDC3C7" />
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center',
            alignItems: 'center', padding: 20 },
  guestText: { marginTop: 12, color: '#7F8C8D', fontSize: 15 },
  loginBtn: { backgroundColor: '#1A5276', paddingHorizontal: 40,
              paddingVertical: 14, borderRadius: 10,
              marginTop: 20 },
  loginBtnText: { color: '#FFF', fontSize: 16,
                  fontWeight: 'bold' },
  registerLink: { marginTop: 16, color: '#2E86C1',
                  fontSize: 14 },
  header: { backgroundColor: '#1A5276', paddingTop: 30,
            paddingBottom: 24, alignItems: 'center' },
  avatar: { width: 70, height: 70, borderRadius: 35,
            backgroundColor: '#148F77',
            justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 28,
                fontWeight: 'bold' },
  userName: { color: '#FFF', fontSize: 20, fontWeight: 'bold',
              marginTop: 10 },
  userEmail: { color: '#D5DBDB', fontSize: 14, marginTop: 4 },
  menu: { marginTop: 16, backgroundColor: '#FFF',
          borderRadius: 12, marginHorizontal: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center',
              padding: 16, borderBottomWidth: 1,
              borderBottomColor: '#F2F3F4' },
  menuLabel: { flex: 1, marginLeft: 14, fontSize: 15,
               color: '#2C3E50' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center',
               justifyContent: 'center', marginTop: 30 },
  logoutText: { color: '#E74C3C', fontSize: 15,
                fontWeight: '600', marginLeft: 8 }
});

