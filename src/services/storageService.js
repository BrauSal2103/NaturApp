import AsyncStorage from
  '@react-native-async-storage/async-storage';

// ============================================
// PERSISTENCIA BÁSICA - AsyncStorage
// Equivale a SharedPreferences / UserDefaults
// Para datos pequeños: preferencias, tokens, config
// ============================================

const KEYS = {
  USER_NAME: '@naturapp_user_name',
  USER_EMAIL: '@naturapp_user_email',
  AUTH_TOKEN: '@naturapp_auth_token',
  THEME_DARK: '@naturapp_theme_dark',
  NOTIFICATIONS: '@naturapp_notifications',
  LAST_CATEGORY: '@naturapp_last_category',
  ONBOARDING_DONE: '@naturapp_onboarding',
};

const StorageService = {
  // --- GUARDAR datos (Create/Update) ---
  async saveUserProfile(name, email) {
    try {
      // multiSet guarda múltiples pares clave-valor
      await AsyncStorage.multiSet([
        [KEYS.USER_NAME, name],
        [KEYS.USER_EMAIL, email],
      ]);
      return true;
    } catch (error) {
      console.error('Error guardando perfil:', error);
      return false;
    }
  },

  // --- LEER datos (Read) ---
  async getUserProfile() {
    try {
      const values = await AsyncStorage.multiGet([
        KEYS.USER_NAME,
        KEYS.USER_EMAIL,
      ]);
      return {
        name: values[0][1] || '',
        email: values[1][1] || '',
      };
    } catch (error) {
      console.error('Error leyendo perfil:', error);
      return { name: '', email: '' };
    }
  },

  // --- Preferencias booleanas ---
  async setDarkTheme(enabled) {
    await AsyncStorage.setItem(
      KEYS.THEME_DARK, JSON.stringify(enabled)
    );
  },

  async isDarkTheme() {
    const val = await AsyncStorage.getItem(
      KEYS.THEME_DARK
    );
    return val ? JSON.parse(val) : false;
  },

  async setNotifications(enabled) {
    await AsyncStorage.setItem(
      KEYS.NOTIFICATIONS, JSON.stringify(enabled)
    );
  },

  async getNotifications() {
    const val = await AsyncStorage.getItem(
      KEYS.NOTIFICATIONS
    );
    return val ? JSON.parse(val) : true;
  },

  // --- Token de autenticación ---
  async saveToken(token) {
    await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
  },

  async getToken() {
    return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
  },

  // --- ELIMINAR datos (Delete) ---
  async logout() {
    await AsyncStorage.multiRemove([
      KEYS.AUTH_TOKEN,
      KEYS.USER_NAME,
      KEYS.USER_EMAIL,
    ]);
  },

  // Guardar última categoría visitada
  async saveLastCategory(category) {
    await AsyncStorage.setItem(
      KEYS.LAST_CATEGORY, category
    );
  },

  async getLastCategory() {
    return await AsyncStorage.getItem(
      KEYS.LAST_CATEGORY
    ) || 'todos';
  },
};

export default StorageService;
