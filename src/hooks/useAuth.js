// src/hooks/useAuth.js
// ============================================
// Hook de Autenticación — Firebase Auth
// Sesión 11: Login, Registro, Logout con Firebase
// ============================================
 
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { auth, db } from '../services/firebaseConfig';
 
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  // Escuchar cambios de estado de autenticación (Firebase observer)
  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Usuario autenticado — obtener datos adicionales de Firestore
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || userData.name || 'Usuario',
              phone: userData.phone || '',
              role: userData.role || 'customer',
              photoURL: firebaseUser.photoURL || userData.photoURL || null,
            });
          } catch (err) {
            // Si Firestore falla, usar datos básicos de Auth
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'Usuario',
              role: 'customer',
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    } catch (err) {
      // Firebase no configurado — modo offline
      console.log('Firebase Auth no disponible:', err.message);
      setLoading(false);
    }
    return () => unsubscribe && unsubscribe();
  }, []);
 
  // Iniciar sesión con Firebase Auth
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      let message = 'Error de inicio de sesión';
      switch (err.code) {
        case 'auth/user-not-found':
          message = 'No existe una cuenta con este email';
          break;
        case 'auth/wrong-password':
          message = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          message = 'Email inválido';
          break;
        case 'auth/too-many-requests':
          message = 'Demasiados intentos. Intenta más tarde';
          break;
        case 'auth/invalid-credential':
          message = 'Credenciales inválidas';
          break;
        default:
          // Fallback para modo desarrollo sin Firebase configurado
          if (err.message?.includes('auth/configuration-not-found') || err.code === 'auth/api-key-not-valid') {
            setUser({
              id: 'local-1',
              email,
              name: 'Usuario Demo',
              role: 'customer',
            });
            setLoading(false);
            return { uid: 'local-1', email };
          }
          message = err.message;
      }
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  }, []);
 
  // Registrar usuario nuevo con Firebase Auth + guardar perfil en Firestore
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // Crear cuenta en Firebase Auth
      const result = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
 
      // Actualizar displayName en Auth
      await updateProfile(result.user, { displayName: userData.name });
 
      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        role: 'customer',
        createdAt: new Date().toISOString(),
      });
 
      return result.user;
    } catch (err) {
      let message = 'Error de registro';
      switch (err.code) {
        case 'auth/email-already-in-use':
          message = 'Este email ya está registrado';
          break;
        case 'auth/weak-password':
          message = 'La contraseña es muy débil (mínimo 6 caracteres)';
          break;
        case 'auth/invalid-email':
          message = 'Email inválido';
          break;
        default:
          if (err.message?.includes('configuration-not-found') || err.code === 'auth/api-key-not-valid') {
            setUser({
              id: 'local-1',
              email: userData.email,
              name: userData.name,
              role: 'customer',
            });
            setLoading(false);
            return { uid: 'local-1', email: userData.email };
          }
          message = err.message;
      }
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  }, []);
 
  // Cerrar sesión
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      // Modo offline
      setUser(null);
    }
  }, []);
 
  return { user, loading, error, login, register, logout };
}
