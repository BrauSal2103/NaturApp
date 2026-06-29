// src/services/storageService.js
// ============================================
// SERVICIO FIREBASE STORAGE
// Sesión 11: Almacenamiento de imágenes
// Subir y obtener URLs de imágenes de productos
// ============================================
 
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebaseConfig';
 
const StorageService = {
  // Subir imagen de producto
  uploadProductImage: async (productId, imageUri) => {
    try {
      // Convertir URI local a blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
 
      // Determinar extensión
      const extension = imageUri.split('.').pop()?.split('?')[0] || 'jpg';
      const fileName = `products/${productId}_${Date.now()}.${extension}`;
 
      // Crear referencia y subir
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, blob);
 
      // Obtener URL de descarga pública
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Imagen subida:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw new Error('No se pudo subir la imagen: ' + error.message);
    }
  },
 
  // Subir avatar de usuario
  uploadUserAvatar: async (userId, imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
 
      const extension = imageUri.split('.').pop()?.split('?')[0] || 'jpg';
      const fileName = `avatars/${userId}.${extension}`;
 
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
 
      return downloadURL;
    } catch (error) {
      console.error('Error subiendo avatar:', error);
      throw new Error('No se pudo subir el avatar: ' + error.message);
    }
  },
 
  // Obtener URL de descarga de una imagen
  getImageURL: async (path) => {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error obteniendo URL:', error);
      return null;
    }
  },
 
  // Eliminar imagen
  deleteImage: async (path) => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error eliminando imagen:', error);
    }
  },
};
 
export default StorageService;
