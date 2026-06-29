// src/services/firebaseConfig.js
// ============================================
// CONFIGURACIÓN DE FIREBASE
// Sesión 11: Integración de Firebase
// Auth + Firestore + Storage
// ============================================
//
// INSTRUCCIONES DE CONFIGURACIÓN:
// 1. Ir a https://console.firebase.google.com/
// 2. Crear un nuevo proyecto o seleccionar uno existente
// 3. Agregar una app web (icono </>)
// 4. Copiar la configuración de Firebase y reemplazar los valores abajo
// 5. Habilitar Authentication > Email/Password en la consola
// 6. Crear una base de datos Firestore
// 7. Habilitar Storage
// ============================================
 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
 
// ── Configuración de Firebase ──
// REEMPLAZAR con tus credenciales de Firebase Console
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};
 
// ── Inicializar Firebase ──
const app = initializeApp(firebaseConfig);
 
// ── Auth con persistencia en AsyncStorage ──
// Esto mantiene la sesión del usuario entre cierres de la app
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
 
// ── Firestore (Base de datos) ──
const db = getFirestore(app);
 
// ── Storage (Almacenamiento de archivos) ──
const storage = getStorage(app);

export { app, auth, db, storage };
export default app;
