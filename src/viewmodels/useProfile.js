import { useState, useEffect, useCallback } from 'react';
import StorageService from '../services/storageService';

export function useProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [darkTheme, setDarkTheme] = useState(false);
  const [notifications, setNotifications] =
    useState(true);

  const loadProfile = useCallback(async () => {
    const profile = await StorageService.getUserProfile();
    setName(profile.name);
    setEmail(profile.email);
    setDarkTheme(await StorageService.isDarkTheme());
    setNotifications(
      await StorageService.getNotifications()
    );
  }, []);

  const saveProfile = useCallback(async () => {
    await StorageService.saveUserProfile(name, email);
  }, [name, email]);

  const toggleTheme = useCallback(async () => {
    const newVal = !darkTheme;
    setDarkTheme(newVal);
    await StorageService.setDarkTheme(newVal);
  }, [darkTheme]);

  const toggleNotifications = useCallback(async () => {
    const newVal = !notifications;
    setNotifications(newVal);
    await StorageService.setNotifications(newVal);
  }, [notifications]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  return {
    name, setName, email, setEmail,
    darkTheme, notifications,
    saveProfile, toggleTheme,
    toggleNotifications,
  };
}

