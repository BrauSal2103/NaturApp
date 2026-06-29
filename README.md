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



