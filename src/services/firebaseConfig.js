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
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
 
// ── Configuración de Firebase ──
// REEMPLAZAR con tus credenciales de Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDAVwTh9Ilt8NPTn8gQADwWwbxRYLlDNAk",
  authDomain: "naturapp-ac741.firebaseapp.com",
  projectId: "naturapp-ac741",
  storageBucket: "naturapp-ac741.firebasestorage.app",
  messagingSenderId: "944060337699",
  appId: "1:944060337699:web:49e6e5478c1acc4c3a2b96",
  measurementId: "G-BMR63ER1YC"
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

const analytics = getAnalytics(app);

export { analytics, app, auth, db, storage };
export default app;
