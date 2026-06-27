// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthAPI, setToken, clearToken } from '../services/apiService';


export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Restaurar sesión al iniciar
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          setToken(token);
          const res = await AuthAPI.getProfile();
          setUser(res.data);
        }
      } catch (err) {
        await AsyncStorage.removeItem('auth_token');
        clearToken();
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);


  // Iniciar sesión
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthAPI.login(email, password);
      await AsyncStorage.setItem('auth_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  // Registrarse
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthAPI.register(userData);
      await AsyncStorage.setItem('auth_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  // Cerrar sesión
  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('auth_token');
    clearToken();
    setUser(null);
  }, []);


  return { user, loading, error, login, register, logout };
}

