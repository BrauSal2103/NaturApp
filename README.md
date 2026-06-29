La información de la documentación se puede encontrar tanto en este README como en [docs.google.com/document/d/1ElO5s31ZuzFxomG3ISmhyn-I5YT94V0lJExHUIWklf4/edit?tab=t.lkmbcs4vujg1](https://docs.google.com/document/d/1ElO5s31ZuzFxomG3ISmhyn-I5YT94V0lJExHUIWklf4/edit?tab=t.lkmbcs4vujg1)

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```
2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# NaturApp - Documentación de Resolución de Problemas (Sesión 11)

Este documento registra los desafíos arquitectónicos, de red y de base de datos encontrados durante la Sesión 11 del proyecto NaturApp, así como las soluciones implementadas para garantizar la correcta comunicación entre el Frontend (React Native/Expo) y el Backend (Node.js/Express/MongoDB).

## 1. Problemas de Infraestructura y Conectividad

### 1.1. Caídas del Túnel y Error 503 / 502

* **Síntoma:** El frontend arrojaba el error `Unexpected character in number: -` o `Unexpected character: B`.
* **Causa:** `localtunnel` devolvía páginas HTML de error (`503 Tunnel Unavailable` o `502 Bad Gateway`) cuando el servidor de desarrollo (`nodemon`) se reiniciaba al guardar cambios, cerrando temporalmente el puerto 9090. El frontend intentaba parsear este HTML como si fuera un JSON.
* **Solución:** * Reinicio manual del puente mediante `npx localtunnel --port 9090`.
  * Autorización de la IP visitante haciendo clic en "Click to Continue" en la advertencia de seguridad del navegador antes de consumir la API desde la app móvil.

### 1.2. Bloqueo de IP en MongoDB Atlas

* **Síntoma:** El servidor backend arrojaba errores de conexión (ej. `ECONNREFUSED` o el túnel devolvía `Bad Gateway` permanente).
* **Causa:** Cambio de IP pública dinámica del entorno de desarrollo (Fedora/Windows). El firewall de MongoDB Atlas bloqueaba automáticamente la nueva IP.
* **Solución:** Configuración temporal de la *IP Access List* en Atlas, añadiendo la dirección `0.0.0.0/0` para permitir pruebas durante la etapa de desarrollo y evaluación.

## 2. Problemas de Base de Datos y ORM (Mongoose)

### 2.1. Consultas que devolvían arreglos vacíos `[]`

* **Síntoma:** El backend conectaba con éxito, pero `Product.find({})` devolvía `[]` a pesar de que los documentos existían en MongoDB Atlas.
* **Causa:** La URI de conexión no especificaba la base de datos de destino. Mongoose se conectaba por defecto a la base de datos `test` en lugar de `naturapp`.
* **Solución:** Modificación del Connection String en el archivo `.env` / `server.js` para incluir el nombre exacto de la base de datos:
  ```env
  mongodb+srv://<user>:<password>@cluster.mongodb.net/naturapp?...
  ```

### 2.2. Conflicto de Tipos en el Esquema (Cast to ObjectId failed)

* **Síntoma:** La aplicación crasheaba al presionar "Confirmar Pedido" o al intentar cargar productos con el error `Product validation failed: category: Cast to ObjectId failed`.
* **Causa:** El esquema de Mongoose exigía que el campo `category` fuera una referencia `ObjectId`. Sin embargo, los datos inyectados para pruebas (dummies) contenían strings de texto simple (ej. `"Cuidado Personal"`). Al intentar descontar el stock y ejecutar `producto.save()`, la validación estricta fallaba.
* **Solución:** Relajación temporal del esquema en `models/Product.js`, cambiando el tipo de dato a `String` para acoplarse a los datos de prueba actuales:
  ```javascript
  category: { type: String, required: true }
  ```

## 3. Problemas de Autenticación y Backend

### 3.1. Falla en el Registro de Usuarios (`next is not a function`)

* **Síntoma:** Al intentar crear una cuenta en el frontend, la petición fallaba y el backend devolvía el error `next is not a function`.
* **Causa:** Uso de sintaxis obsoleta en los *hooks* de Mongoose (`pre-save`). Se estaba definiendo una función asíncrona que intentaba invocar `next()` de forma manual, lo cual genera un conflicto interno en las versiones modernas de Mongoose al manejar Promesas (específicamente al encriptar con `bcrypt`).
* **Solución:** Refactorización del hook en `models/User.js` para aprovechar `async/await` de forma nativa y eliminar la dependencia del parámetro `next`:
  ```javascript
  userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  ```

## 4. Problemas de Interfaz de Usuario (UI)

### 4.1. Advertencia de URI de Imagen Vacía

* **Síntoma:** Consola de Metro/Expo mostrando el aviso `WARN source.uri should not be an empty string`.
* **Causa:** Algunos documentos en MongoDB tenían el campo `image` como un string vacío `""`, lo cual rompe el componente estricto `<Image>` de React Native.
* **Solución:** Implementación de un renderizado condicional con una imagen *placeholder* de respaldo en el componente `ProductCard.js`.

## 5. Problemas de Integración Frontend-Backend

### 5.1. Parámetros malformados en el Hook de Registro

* **Síntoma:** El formulario de registro rechazaba la creación de cuenta instantáneamente, cayendo en el bloque `catch` del frontend sin mostrar un error claro del backend.
* **Causa:** La función `handleRegister` en la vista `register.js` enviaba los datos como tres argumentos separados (`await register(name, email, password)`). Sin embargo, el servicio `AuthAPI` y el hook `useAuth` estaban diseñados para recibir un único objeto estructurado (`userData`). Esto provocaba que el backend recibiera un cuerpo (`body`) vacío o malformado.
* **Solución:** Empaquetar los datos en un único objeto al momento de llamar a la función del hook, garantizando que el backend reciba el JSON correctamente estructurado:
  ```javascript
  // Solución aplicada en register.js
  await register({ name, email, password });
  ```

# Guía de Arranque del Proyecto (Sesión 11)

Para garantizar la correcta comunicación entre todas las capas de la aplicación (Base de Datos, Backend, Túnel y Frontend), el sistema debe inicializarse en el siguiente orden estricto.

## 1. Inicialización del Backend (Servidor Node.js/Express)

El backend debe ser el primero en arrancar para establecer la conexión con MongoDB Atlas.

1. Abre una terminal y navega hasta el directorio del backend (`naturapp-backend`).
2. Ejecuta el entorno de desarrollo:
   ```bash
   npm run dev
   ```

```

3. Verifica que la consola muestre los mensajes de confirmación:
* `Servidor NaturApp en puerto 9090`
* `MongoDB conectado a NaturApp`



## 2. Configuración del Puente de Red (Localtunnel)

Dado que la aplicación móvil de Expo necesita acceder al backend local desde una red externa o simulada, se requiere un túnel público.

1. Abre una **nueva terminal** (manteniendo el backend corriendo en la primera).
2. Ejecuta el comando de localtunnel apuntando al puerto del servidor:
```bash
npx localtunnel --port 9090
```

3. Copia la URL generada (ej. `https://tu-url.loca.lt`).
4. **Paso de Seguridad Obligatorio:** Abre esa URL en el navegador de tu computadora y haz clic en el botón azul **"Click to Continue"** para autorizar el tráfico de red.

## 3. Actualización de Credenciales en el Frontend

La aplicación móvil debe enterarse de cuál es la nueva ruta pública del backend.

1. Abre el archivo `src/services/apiService.js` en tu editor de código.
2. Actualiza la constante `BASE_URL` pegando la nueva URL generada en el paso anterior y agregando `/api` al final:

```javascript
const BASE_URL = '[https://tu-url.loca.lt/api](https://tu-url.loca.lt/api)';
```

3. Guarda el archivo.

## 4. Inicialización del Frontend (Aplicación React Native/Expo)

1. Abre una **tercera terminal** y navega al directorio raíz del frontend (`NaturApp`).
2. Ejecuta el servidor de Expo limpiando la caché y forzando la conexión por túnel:

```bash
npx expo start -c --tunnel
```

3. Escanea el código QR generado usando la aplicación Expo Go en tu dispositivo móvil.

**Nota Operativa:** Si durante el desarrollo se modifica un archivo del backend, `nodemon` reiniciará el servidor. Esto puede causar que Localtunnel se desconecte temporalmente arrojando un error `502 Bad Gateway`. En ese caso, basta con refrescar la aplicación en el móvil o reiniciar el comando de Localtunnel si el servicio se ha detenido por completo.

# Guía de Arranque del Proyecto (Sesión 11)

Para garantizar la correcta comunicación entre todas las capas de la aplicación (Base de Datos, Backend, Túnel y Frontend), el sistema debe inicializarse en el siguiente orden estricto.

## 1. Inicialización del Backend (Servidor Node.js/Express)

El backend debe ser el primero en arrancar para establecer la conexión con MongoDB Atlas.

1. Abre una terminal y navega hasta el directorio del backend (`naturapp-backend`).
2. Ejecuta el entorno de desarrollo:
   ```bash
   npm run dev
   ```
3. Verifica que la consola muestre los mensajes de confirmación:

* `Servidor NaturApp en puerto 9090`
* `MongoDB conectado a NaturApp`

## 2. Configuración del Puente de Red (Localtunnel)

Dado que la aplicación móvil de Expo necesita acceder al backend local desde una red externa o simulada, se requiere un túnel público.

1. Abre una **nueva terminal** (manteniendo el backend corriendo en la primera).
2. Ejecuta el comando de localtunnel apuntando al puerto del servidor:

```bash
npx localtunnel --port 9090
```

3. Copia la URL generada (ej. `https://tu-url.loca.lt`).
4. **Paso de Seguridad Obligatorio:** Abre esa URL en el navegador de tu computadora y haz clic en el botón azul **"Click to Continue"** para autorizar el tráfico de red.

## 3. Actualización de Credenciales en el Frontend

La aplicación móvil debe enterarse de cuál es la nueva ruta pública del backend.

1. Abre el archivo `src/services/apiService.js` en tu editor de código.
2. Actualiza la constante `BASE_URL` pegando la nueva URL generada en el paso anterior y agregando `/api` al final:

```javascript
const BASE_URL = '[https://tu-url.loca.lt/api](https://tu-url.loca.lt/api)';
```

3. Guarda el archivo.

## 4. Inicialización del Frontend (Aplicación React Native/Expo)

1. Abre una **tercera terminal** y navega al directorio raíz del frontend (`NaturApp`).
2. Ejecuta el servidor de Expo limpiando la caché y forzando la conexión por túnel:

```bash
npx expo start -c --tunnel
```

3. Escanea el código QR generado usando la aplicación Expo Go en tu dispositivo móvil.

**Nota Operativa:** Si durante el desarrollo se modifica un archivo del backend, `nodemon` reiniciará el servidor. Esto puede causar que Localtunnel se desconecte temporalmente arrojando un error `502 Bad Gateway`. En ese caso, basta con refrescar la aplicación en el móvil o reiniciar el comando de Localtunnel si el servicio se ha detenido por completo.

---



# NaturApp - Registro de Solución de Errores y Modificaciones (Sesión 12)

Este documento registra los problemas encontrados y las soluciones implementadas durante la migración del proyecto a Firebase y la estabilización del entorno de desarrollo en React Native (Expo).

---

## 1. Configuración del Entorno y Expo

### 1.1. Error de React Native web/Analytics

* **Problema:** Errores fatales (`invalid-analytics-context`, `Cannot read property 'getElementsByTagName'`) al iniciar la app.
* **Causa:** Firebase Analytics intentaba acceder a elementos del DOM (cookies/HTML) que no existen en el entorno nativo de React Native.
* **Solución:** Se eliminó la importación y la inicialización de `getAnalytics` en `src/services/firebaseConfig.js`.

### 1.2. Advertencia de Expo Router (`index.js` vacío)

* **Problema:** Advertencia `Route "./index.js" is missing the required default export`.
* **Causa:** Expo Router exige que todos los archivos de rutas exporten un componente por defecto.
* **Solución:** Se creó una estructura básica de React exportando una vista por defecto en `index.js`.

### 1.3. Conexión LAN vs Tunnel (Ngrok)

* **Problema:** Error de Ngrok `reading 'body'` y error de Java `Failed to download remote update` en el dispositivo físico; bloqueo de antivirus (`FileRepPup`).
* **Causa:** Restricciones de red aislaron el dispositivo móvil. Ngrok bloqueó conexiones anónimas y el antivirus detectó un falso positivo.
* **Solución:** 1. Se creó una cuenta en Ngrok y se vinculó el authtoken (`npx ngrok config add-authtoken`).
  2. Se instaló globalmente `@expo/ngrok`.
  3. Se añadió `ngrok.exe` a las excepciones del antivirus.

---

## 2. Configuración de Firebase y Base de Datos

### 2.1. Error de Registro de Usuarios

* **Problema:** Error `auth/operation-not-allowed` al intentar registrar una cuenta nueva.
* **Causa:** El proveedor de autenticación por correo no estaba habilitado en la consola web.
* **Solución:** Se activó el método de inicio de sesión "Email/Password" en Firebase Authentication.

### 2.2. Sembrado de Datos (Seed Script)

* **Problema:** Los productos insertados mediante `scripts/seedFirestore.js` no aparecían en la app.
* **Causa:** El script guardaba el estado del producto bajo la propiedad `active: true`, pero la aplicación consultaba mediante `isActive: true`.
* **Solución:** Se unificó la nomenclatura modificando el script para insertar `isActive: true`.

### 2.3. Índices Compuestos Faltantes en Firestore

* **Problema:** Fallaban las consultas que combinaban múltiples filtros y ordenamientos (ej. productos activos + orden alfabético; pedidos del usuario + orden por fecha).
* **Causa:** Firestore exige índices explícitos para consultas complejas.
* **Solución:** * Se creó un índice para `products` (`isActive` Ascendente, `name` Ascendente).
  * Se creó un índice para `orders` (`userId` Ascendente, `createdAt` Descendente).

---

## 3. Módulo del Carrito de Compras (`useCart`)

### 3.1. Crash en la Pantalla Principal (`reduce is not a function`)

* **Problema:** La aplicación colapsaba con `TypeError: items.reduce is not a function`.
* **Causa:** El servicio `CartService.get` devolvía un objeto `{ items, total, count }`, pero `useCart` lo guardaba directamente en el estado, intentando iterar sobre el objeto en lugar del arreglo.
* **Solución:** Se corrigió el seteo del estado para extraer específicamente el arreglo: `setItems(data.items || [])` y se agregó protección `Array.isArray()`.

### 3.2. Productos no se guardaban en el carrito

* **Problema:** Al presionar "Agregar", no sucedía nada y se ejecutaba el fallback local.
* **Causa:** Discrepancia en las variables del ID. El servicio buscaba `item.productId`, pero el componente enviaba `item.id`.
* **Solución:** Se robusteció `CartService.addItem` para aceptar ambas variables: `const pId = item.productId || item.id;`.

### 3.3. Advertencia de Keys en Listas (Cart y Checkout)

* **Problema:** Advertencia roja de React: `Each child in a list should have a unique "key" prop`.
* **Causa:** Los componentes iteraban (`FlatList` y `.map()`) usando `item.id`, pero los documentos venían de Firestore con `docId` o `productId`.
* **Solución:** Se actualizó la propiedad `keyExtractor` en `cart.js` y `key` en `checkout.js` utilizando una estrategia de respaldo: `item.docId || item.productId || index`.

---

## 4. Módulo de Pedidos (`useOrders` y Checkout)

### 4.1. Error al crear pedido (`Cannot read property 'items' of undefined`)

* **Problema:** Error silencioso que impedía registrar compras en la nube.
* **Causa:** La función en `useOrders.js` empaquetaba los parámetros en un solo objeto `OrderService.create({ ...orderData, userId })`, mientras que el servicio esperaba dos parámetros separados.
* **Solución:** Se separaron los argumentos en la llamada: `OrderService.create(userId, orderData)`.

### 4.2. Error de campos faltantes en Firestore

* **Problema:** El pedido seguía sin guardarse incluso con los parámetros corregidos.
* **Causa:** El servicio de Firebase exigía el campo `shippingAddress`, pero `app/checkout.js` lo estaba enviando como `address`. Firestore cancelaba la escritura por recibir un valor `undefined`.
* **Solución:** Se renombró la propiedad al construir el objeto de la orden: `shippingAddress: address.trim()`. También se añadió un respaldo seguro para las imágenes (`image: i.image || ''`).


# Guía de Inicio de Proyecto - NaturApp (Sesión 12)

Esta guía detalla los pasos necesarios para inicializar, configurar y ejecutar la aplicación NaturApp en un entorno de desarrollo local utilizando Expo y Firebase.

### Requisitos Previos

* **Node.js** (v18 o superior)
* **npm** (incluido con Node.js)
* Cuenta gratuita en **Firebase** y **Ngrok**
* Aplicación **Expo Go** instalada en tu dispositivo móvil (Android/iOS)

---

### Paso 1: Instalación de Dependencias

Abre tu terminal en la carpeta raíz del proyecto (`NaturApp`) y ejecuta el siguiente comando para descargar todos los paquetes necesarios de React Native, Expo y Firebase:

```powershell
npm install
```

### Paso 2: Configuración de Firebase

La aplicación requiere credenciales válidas de Firebase para funcionar.

1. Ve a la consola de [Firebase](https://console.firebase.google.com/).
2. Copia las credenciales de tu aplicación web (Configuración del proyecto > General).
3. Abre el archivo `src/services/firebaseConfig.js` y reemplaza el objeto `firebaseConfig` con tus credenciales reales.
4. Asegúrate de habilitar **Authentication (Email/Password)** y **Firestore Database** en la consola de Firebase.

### Paso 3: Población de Datos (Opcional pero recomendado)

Si tu base de datos Firestore está vacía, puedes inyectar el catálogo inicial de productos y categorías utilizando el script de sembrado automatizado.

1. Abre el archivo `scripts/seedFirestore.js` y pega tus credenciales de Firebase en la constante `firebaseConfig` (solo es necesario para el entorno de desarrollo).
2. Ejecuta el script desde la terminal:

```powershell
node scripts/seedFirestore.js
```

*Nota: Revisa tu consola web de Firebase para confirmar que las colecciones `products` y `categories` se crearon correctamente.*

### Paso 4: Preparación del Túnel (Ngrok)

Debido a posibles bloqueos de red local (ej. aislamiento de clientes en Wi-Fi), el proyecto se ejecuta a través de un túnel de Ngrok para garantizar la conexión entre la computadora y el celular.

1. Inicia sesión en [ngrok.com](https://ngrok.com/) y copia tu Authtoken.
2. Abre la terminal y vincula tu cuenta (solo se hace una vez):

```powershell
npx ngrok config add-authtoken TU_TOKEN_AQUI
```

3. Asegúrate de tener el paquete de Expo para Ngrok instalado globalmente:

```powershell
npm install -g @expo/ngrok
```

### Paso 5: Levantar el Servidor de Desarrollo

Una vez configurado todo, arranca el servidor de Expo limpiando la caché para evitar que lea versiones antiguas de tus archivos:

```powershell
npx expo start -c --tunnel
```

### Paso 6: Ejecutar en el Dispositivo

1. Asegúrate de tener conexión a internet en tu celular.
2. Abre la aplicación **Expo Go**.
3. Escanea el **código QR** que apareció en tu terminal (o ingresa el enlace de Ngrok manualmente).
4. La aplicación compilará el paquete de JavaScript (Bundling) y se mostrará en tu pantalla lista para usar.

