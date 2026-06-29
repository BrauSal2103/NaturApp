// scripts/seedFirestore.js
// ============================================
// Script para poblar Firestore con datos iniciales
// Ejecutar: node scripts/seedFirestore.js
// Requiere: npm install firebase
// ============================================
 
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } = require('firebase/firestore');
 
// ── CONFIGURACIÓN ──
// Reemplazar con las credenciales de tu proyecto Firebase
const firebaseConfig = {
  apiKey: 'TU_API_KEY_AQUI',
  authDomain: 'tu-proyecto.firebaseapp.com',
  projectId: 'tu-proyecto-id',
  storageBucket: 'tu-proyecto.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456',
};
 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
 
// ── DATOS DE CATEGORÍAS ──
const categories = [
  { id: 'herbal', name: 'Hierbas', icon: '🌿', description: 'Hierbas medicinales y aromáticas' },
  { id: 'oils', name: 'Aceites', icon: '🫒', description: 'Aceites esenciales y naturales' },
  { id: 'teas', name: 'Infusiones', icon: '🍵', description: 'Tés e infusiones naturales' },
  { id: 'supplements', name: 'Suplementos', icon: '💊', description: 'Suplementos naturales' },
  { id: 'superfoods', name: 'Superalimentos', icon: '🥑', description: 'Superalimentos nutritivos' },
];
 
// ── DATOS DE PRODUCTOS ──
const products = [
  {
    name: 'Manzanilla Orgánica',
    description: 'Manzanilla orgánica cultivada en los Andes peruanos. Ideal para infusiones relajantes y digestivas.',
    price: 12.50,
    category: 'herbal',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400',
    benefits: 'Propiedades relajantes, mejora la digestión, antiinflamatoria natural.',
    active: true,
  },
  {
    name: 'Aceite de Eucalipto',
    description: 'Aceite esencial de eucalipto 100% puro. Aroma refrescante con propiedades descongestionantes.',
    price: 28.00,
    category: 'oils',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400',
    benefits: 'Descongestionante, antiséptico, alivia dolores musculares.',
    active: true,
  },
  {
    name: 'Té Verde Matcha',
    description: 'Matcha premium de grado ceremonial. Energía sostenida y alto contenido de antioxidantes.',
    price: 45.00,
    category: 'teas',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400',
    benefits: 'Antioxidante, mejora el enfoque, acelera el metabolismo.',
    active: true,
  },
  {
    name: 'Espirulina en Polvo',
    description: 'Espirulina orgánica en polvo. Superalimento rico en proteínas, vitaminas y minerales.',
    price: 38.50,
    category: 'supplements',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1622467827417-bbe6e3b18018?w=400',
    benefits: 'Alta en proteínas, desintoxicante, fortalece el sistema inmune.',
    active: true,
  },
  {
    name: 'Quinua Real Orgánica',
    description: 'Quinua real boliviana orgánica. Grano ancestral con proteína completa.',
    price: 22.00,
    category: 'superfoods',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    benefits: 'Proteína completa, rico en fibra, libre de gluten.',
    active: true,
  },
  {
    name: 'Maca Negra en Cápsulas',
    description: 'Cápsulas de maca negra premium de Junín. Energía y vitalidad natural.',
    price: 55.00,
    category: 'supplements',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
    benefits: 'Aumenta la energía, mejora la resistencia, equilibrio hormonal.',
    active: true,
  },
  {
    name: 'Aceite de Coco Virgen',
    description: 'Aceite de coco virgen extra prensado en frío. Uso culinario y cosmético.',
    price: 32.00,
    category: 'oils',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400',
    benefits: 'Hidratante natural, ácidos grasos saludables, antimicrobiano.',
    active: true,
  },
  {
    name: 'Muña Silvestre',
    description: 'Muña silvestre de las alturas del Perú. Hierba andina con propiedades digestivas.',
    price: 10.00,
    category: 'herbal',
    stock: 55,
    image: 'https://images.unsplash.com/photo-1530968033775-2c92736b131e?w=400',
    benefits: 'Digestiva, carminativa, aroma mentolado natural.',
    active: true,
  },
  {
    name: 'Infusión de Uña de Gato',
    description: 'Uña de Gato de la selva amazónica. Hierba tradicional para el sistema inmune.',
    price: 18.00,
    category: 'teas',
    stock: 38,
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
    benefits: 'Fortalece el sistema inmune, antiinflamatorio, antioxidante.',
    active: true,
  },
  {
    name: 'Semillas de Chía Orgánica',
    description: 'Semillas de chía orgánica. Ricas en Omega-3, fibra y proteínas vegetales.',
    price: 15.50,
    category: 'superfoods',
    stock: 70,
    image: 'https://images.unsplash.com/photo-1514995669114-6081e934b693?w=400',
    benefits: 'Rico en Omega-3, alto en fibra, fuente de proteína vegetal.',
    active: true,
  },
];
 
// ── FUNCIONES DE SEED ──
async function clearCollection(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  const deletes = snapshot.docs.map((d) => deleteDoc(doc(db, collectionName, d.id)));
  await Promise.all(deletes);
  console.log(`  Colección '${collectionName}' limpiada (${snapshot.size} documentos)`);
}
 
async function seedCategories() {
  console.log('\nSembrando categorías...');
  for (const cat of categories) {
    const docRef = await addDoc(collection(db, 'categories'), cat);
    console.log(`  + ${cat.name} (${docRef.id})`);
  }
}
 
async function seedProducts() {
  console.log('\nSembrando productos...');
  for (const prod of products) {
    const docRef = await addDoc(collection(db, 'products'), {
      ...prod,
      createdAt: new Date().toISOString(),
    });
    console.log(`  + ${prod.name} (${docRef.id})`);
  }
}
 
async function main() {
  console.log('=== NaturApp Firestore Seed ===');
  console.log('Proyecto:', firebaseConfig.projectId);
 
  try {
    // Limpiar colecciones existentes
    console.log('\nLimpiando colecciones...');
    await clearCollection('categories');
    await clearCollection('products');
 
    // Sembrar datos
    await seedCategories();
    await seedProducts();
 
    console.log('\n✅ Seed completado exitosamente');
    console.log(`   ${categories.length} categorías`);
    console.log(`   ${products.length} productos`);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('api-key-not-valid') || error.message.includes('configuration')) {
      console.log('\n⚠️  Debes configurar las credenciales de Firebase en este archivo.');
      console.log('   Ir a https://console.firebase.google.com/ y copiar tu config.');
    }
  }
  process.exit(0);
}
 
main();
