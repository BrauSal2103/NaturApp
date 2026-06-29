// src/services/firestoreService.js
// ============================================
// SERVICIO FIRESTORE — CRUD de Datos
// Sesión 11: Del Módulo a la App con Firebase
// Reemplaza el backend Express con Firestore
// ============================================
 
import {
    addDoc,
    collection,
    deleteDoc,
    doc, getDoc, getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from './firebaseConfig';
 
// ── Catálogo local (fallback cuando Firebase no está configurado) ──
const LOCAL_PRODUCTS = [
  { id: '1', name: 'Maca Negra en Polvo', description: 'Maca negra orgánica de Junín. Superalimento andino rico en aminoácidos, vitaminas y minerales. Ideal para aumentar la energía y vitalidad.', price: 45.90, category: 'superfoods', categoryName: 'Superfoods', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&h=300&fit=crop', stock: 25, isActive: true, rating: 4.8, tags: ['energía', 'andino'], benefits: ['Aumenta la energía', 'Mejora la resistencia', 'Rico en hierro', 'Fortalece el sistema inmune'] },
  { id: '2', name: 'Aceite de Sacha Inchi', description: 'Aceite extra virgen de Sacha Inchi prensado en frío. Rico en Omega 3, 6 y 9. Proveniente de la Amazonía peruana.', price: 38.50, category: 'aceites', categoryName: 'Aceites', image: 'https://images.unsplash.com/photo-1474979266404-7eaabdf50494?w=300&h=300&fit=crop', stock: 18, isActive: true, rating: 4.6, tags: ['omega', 'amazónico'], benefits: ['Rico en Omega 3', 'Antiinflamatorio natural', 'Mejora la piel', 'Salud cardiovascular'] },
  { id: '3', name: 'Cápsulas de Cúrcuma', description: 'Cápsulas de cúrcuma orgánica con pimienta negra para mejor absorción. Potente antiinflamatorio y antioxidante natural.', price: 32.00, category: 'capsulas', categoryName: 'Cápsulas', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop', stock: 40, isActive: true, rating: 4.5, tags: ['antiinflamatorio'], benefits: ['Antiinflamatorio', 'Antioxidante', 'Mejora la digestión', 'Salud articular'] },
  { id: '4', name: 'Infusión de Muña', description: 'Infusión de muña andina en bolsitas filtrantes. Planta medicinal tradicional de los Andes peruanos.', price: 12.90, category: 'infusiones', categoryName: 'Infusiones', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=300&h=300&fit=crop', stock: 60, isActive: true, rating: 4.3, tags: ['digestivo', 'andino'], benefits: ['Digestivo natural', 'Alivia gases', 'Refrescante', 'Sin cafeína'] },
  { id: '5', name: 'Miel de Abeja Orgánica', description: 'Miel pura de abeja de los bosques de Oxapampa. Sin aditivos ni procesamiento industrial. 100% natural.', price: 28.00, category: 'miel', categoryName: 'Miel', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop', stock: 30, isActive: true, rating: 4.7, tags: ['natural', 'endulzante'], benefits: ['Energía natural', 'Antibacteriano', 'Alivia la garganta', 'Endulzante natural'] },
  { id: '6', name: 'Quinua Tricolor', description: 'Quinua tricolor orgánica: blanca, roja y negra. Grano andino con proteína completa y aminoácidos esenciales.', price: 18.50, category: 'superfoods', categoryName: 'Superfoods', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop', stock: 35, isActive: true, rating: 4.4, tags: ['proteína', 'andino'], benefits: ['Proteína completa', 'Libre de gluten', 'Rico en fibra', 'Alto en hierro'] },
  { id: '7', name: 'Aceite de Coco Virgen', description: 'Aceite de coco extra virgen prensado en frío. Versátil para cocina, cuidado personal y salud.', price: 29.90, category: 'aceites', categoryName: 'Aceites', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&h=300&fit=crop', stock: 22, isActive: true, rating: 4.5, tags: ['versátil', 'hidratante'], benefits: ['Energía rápida', 'Hidratante natural', 'Antimicrobiano', 'Versátil'] },
  { id: '8', name: 'Cápsulas de Uña de Gato', description: 'Cápsulas de uña de gato de la Amazonía. Propiedades inmunoestimulantes reconocidas.', price: 25.00, category: 'capsulas', categoryName: 'Cápsulas', image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop', stock: 0, isActive: true, rating: 4.2, tags: ['defensas', 'amazónico'], benefits: ['Fortalece defensas', 'Antiinflamatorio', 'Antioxidante', 'Tradición amazónica'] },
  { id: '9', name: 'Infusión de Manzanilla y Anís', description: 'Mezcla relajante de manzanilla y anís en bolsitas filtrantes. Ideal para tomar antes de dormir.', price: 10.50, category: 'infusiones', categoryName: 'Infusiones', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop', stock: 45, isActive: true, rating: 4.6, tags: ['relajante', 'digestivo'], benefits: ['Relajante', 'Ayuda a dormir', 'Digestivo', 'Sin cafeína'] },
  { id: '10', name: 'Miel con Polen', description: 'Miel de abeja enriquecida con polen de flores silvestres. Doble beneficio nutricional en un solo producto.', price: 35.00, category: 'miel', categoryName: 'Miel', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&h=300&fit=crop', stock: 15, isActive: true, rating: 4.8, tags: ['nutritivo', 'energía'], benefits: ['Nutritivo', 'Energía sostenida', 'Vitaminas B', 'Antioxidante'] },
];
 
const LOCAL_CATEGORIES = [
  { id: 'superfoods', name: 'Superfoods', icon: 'leaf', description: 'Superalimentos andinos y amazónicos' },
  { id: 'aceites', name: 'Aceites', icon: 'water', description: 'Aceites naturales prensados en frío' },
  { id: 'capsulas', name: 'Cápsulas', icon: 'medical', description: 'Suplementos en cápsulas naturales' },
  { id: 'infusiones', name: 'Infusiones', icon: 'cafe', description: 'Infusiones y tés naturales' },
  { id: 'miel', name: 'Miel', icon: 'nutrition', description: 'Mieles y derivados de abeja' },
];
 
// Detectar si Firebase está configurado
function isFirebaseConfigured() {
  try {
    return db && db.type === 'firestore';
  } catch {
    return false;
  }
}
 
// ============================================
// MÓDULO DE PRODUCTOS (Firestore: colección "products")
// ============================================
export const ProductService = {
  // Obtener todos los productos (con filtro opcional por categoría)
  getAll: async (categoryFilter = null) => {
    try {
      let q;
      if (categoryFilter) {
        q = query(
          collection(db, 'products'),
          where('isActive', '==', true),
          where('category', '==', categoryFilter),
          orderBy('name')
        );
      } else {
        q = query(
          collection(db, 'products'),
          where('isActive', '==', true),
          orderBy('name')
        );
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.log('ProductService.getAll fallback:', err.message);
      let data = LOCAL_PRODUCTS;
      if (categoryFilter) data = data.filter(p => p.category === categoryFilter);
      return data;
    }
  },
 
  // Obtener un producto por ID
  getById: async (id) => {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error('Producto no encontrado');
      return { id: docSnap.id, ...docSnap.data() };
    } catch (err) {
      const product = LOCAL_PRODUCTS.find(p => p.id === id);
      if (product) return product;
      throw new Error('Producto no encontrado');
    }
  },
 
  // Buscar productos por texto
  search: async (term) => {
    try {
      // Firestore no soporta búsqueda full-text nativa
      // Se obtienen todos y se filtran en el cliente
      const all = await ProductService.getAll();
      const q = term.toLowerCase();
      return all.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    } catch (err) {
      const q = term.toLowerCase();
      return LOCAL_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
  },
 
  // Crear producto (admin)
  create: async (productData) => {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      isActive: true,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...productData };
  },
 
  // Actualizar producto
  update: async (id, data) => {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    return { id, ...data };
  },
 
  // Eliminar producto (eliminación lógica)
  delete: async (id) => {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, { isActive: false });
  },
};
 
// ============================================
// MÓDULO DE CATEGORÍAS (Firestore: colección "categories")
// ============================================
export const CategoryService = {
  getAll: async () => {
    try {
      const q = query(collection(db, 'categories'), orderBy('name'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.log('CategoryService.getAll fallback:', err.message);
      return LOCAL_CATEGORIES;
    }
  },
};
 
// ============================================
// MÓDULO DE PEDIDOS (Firestore: colección "orders")
// ============================================
const localOrders = [];
 
export const OrderService = {
  // Crear pedido
  create: async (userId, orderData) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        userId,
        items: orderData.items,
        total: orderData.total,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod || 'cash',
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...orderData, status: 'pending', createdAt: new Date().toISOString() };
    } catch (err) {
      const order = {
        id: String(localOrders.length + 1),
        userId,
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      localOrders.unshift(order);
      return order;
    }
  },
 
  // Obtener pedidos del usuario
  getByUser: async (userId) => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        };
      });
    } catch (err) {
      return localOrders.filter(o => o.userId === userId);
    }
  },
 
  // Cancelar pedido
  cancel: async (orderId) => {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, { status: 'cancelled' });
      return { id: orderId, status: 'cancelled' };
    } catch (err) {
      const order = localOrders.find(o => o.id === orderId);
      if (order) order.status = 'cancelled';
      return order;
    }
  },
};
 
// ============================================
// MÓDULO DE CARRITO (Firestore: subcolección "cart" dentro del usuario)
// ============================================
let localCart = { items: [] };
 
export const CartService = {
  // Obtener carrito del usuario
  get: async (userId) => {
    try {
      const q = query(collection(db, 'users', userId, 'cart'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(d => ({ docId: d.id, ...d.data() }));
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { items, total, count: items.length };
    } catch (err) {
      const total = localCart.items.reduce((s, i) => s + i.price * i.quantity, 0);
      return { items: localCart.items, total, count: localCart.items.length };
    }
  },
 
  // Agregar al carrito
  addItem: async (userId, item) => {
    try {
      // Verificar si ya existe
      const q = query(
        collection(db, 'users', userId, 'cart'),
        where('productId', '==', item.productId)
      );
      const snapshot = await getDocs(q);
 
      if (!snapshot.empty) {
        // Actualizar cantidad
        const existingDoc = snapshot.docs[0];
        const existingData = existingDoc.data();
        await updateDoc(doc(db, 'users', userId, 'cart', existingDoc.id), {
          quantity: existingData.quantity + (item.quantity || 1),
        });
      } else {
        // Agregar nuevo
        await addDoc(collection(db, 'users', userId, 'cart'), {
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity || 1,
        });
      }
    } catch (err) {
      const existing = localCart.items.find(i => i.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        localCart.items.push({ ...item, quantity: item.quantity || 1 });
      }
    }
  },
 
  // Actualizar cantidad
  updateQuantity: async (userId, productId, quantity) => {
    try {
      const q = query(
        collection(db, 'users', userId, 'cart'),
        where('productId', '==', productId)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const cartDoc = snapshot.docs[0];
        if (quantity <= 0) {
          await deleteDoc(doc(db, 'users', userId, 'cart', cartDoc.id));
        } else {
          await updateDoc(doc(db, 'users', userId, 'cart', cartDoc.id), { quantity });
        }
      }
    } catch (err) {
      const item = localCart.items.find(i => i.productId === productId);
      if (item) {
        item.quantity = quantity;
        if (quantity <= 0) localCart.items = localCart.items.filter(i => i.productId !== productId);
      }
    }
  },
 
  // Eliminar del carrito
  removeItem: async (userId, productId) => {
    try {
      const q = query(
        collection(db, 'users', userId, 'cart'),
        where('productId', '==', productId)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        await deleteDoc(doc(db, 'users', userId, 'cart', snapshot.docs[0].id));
      }
    } catch (err) {
      localCart.items = localCart.items.filter(i => i.productId !== productId);
    }
  },
 
  // Vaciar carrito
  clear: async (userId) => {
    try {
      const q = query(collection(db, 'users', userId, 'cart'));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(d =>
        deleteDoc(doc(db, 'users', userId, 'cart', d.id))
      );
      await Promise.all(deletePromises);
    } catch (err) {
      localCart = { items: [] };
    }
  },
};
