# Proyecto de Chat en Tiempo Real
Aplicación web de chat en tiempo real desarrollada con arquitectura cliente-servidor utilizando Node.js, Express, MongoDB, Socket.IO y React.

El sistema permite crear salas de conversación seguras con soporte para mensajes en tiempo real, archivos multimedia y mensajes temporales autodestructivos.

## Estructura del proyecto
- `chat_backend/`: backend en Node.js + Express + MongoDB.
- `chat_frontend/`: frontend en React + Vite.

## Características principales

## Autenticación de administrador
- Login seguro con JWT.
- Contraseñas encriptadas con bcrypt.
- Protección de rutas administrativas.

## Gestión de salas
- Creación de salas únicas.
- PIN de acceso encriptado.
- Soporte para:
  - Salas de texto.
  - Salas multimedia.

## Acceso de usuarios
- Acceso anónimo mediante:
  - PIN
  - nickname
- nickname único dentro de la sala.
- una sola sesión por dispositivo.

## Comunicación en tiempo real
- Mensajería instantánea con Socket.IO.
- Broadcast de mensajes sin recargar página.
- Lista de usuarios conectados en tiempo real.
- Desconexión automática por inactividad.

## Multimedia
- Subida de imágenes y documentos.
- Visualización de imágenes directamente en el chat.
- Archivos permitidos:
  - JPG
  - PNG
  - WEBP
  - PDF
  - DOCX

## Mensajes temporales
- Mensajes autodestructivos.
- Configuración de duración:
  - 10 segundos
  - 1 minuto
  - 5 minutos
- Eliminación automática tras ser leídos.
- Compatible con:
  - texto
  - imágenes
  - archivos

## Seguridad
- Helmet.
- Rate limiting.
- Sanitización XSS.
- Validación de entradas.
- JWT Authentication.
- Validación de tipos de archivos.
- Restricción de tamaño de archivos.

## Concurrencia
El proyecto implementa concurrencia utilizando:
- Socket.IO asíncrono.
- Worker Threads de Node.js.
- Procesamiento paralelo de mensajes.
- Manejo concurrente de uploads.

## Requisitos
- Node.js v18+ recomendado
- MongoDB en ejecución

## Configuración
1. Clona el repositorio.
2. Crea un `.env` en `chat_backend/` con estas variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/chatdb
JWT_SECRET=supersecret
MAX_FILE_SIZE=10485760
```

3. Instala dependencias en backend y frontend:

```bash
cd chat_backend
npm install express mongoose dotenv cors helmet morgan bcryptjs jsonwebtoken multer socket.io uuid express-rate-limit xss-clean validator
npm install --save-dev nodemon

cd chat_frontend
npm install react-router-dom axios socket.io-client
npm install -D tailwindcss postcss autoprefixer
```

## Ejecución

Inicia el backend:

```bash
cd chat_backend
npm run dev
```

Inicia el frontend:

```bash
cd chat_frontend
npm run dev
```

## Flujo de uso

1. Abre `http://localhost:5173` en el navegador.
2. Ingresa a `/admin` para iniciar sesión como administrador.
3. Crea una sala de tipo `text` o `multimedia`.
4. Copia el PIN generado.
5. Abre la página principal `/` para unirse a la sala con PIN y nickname.

## Validaciones implementadas

- PIN de sala de 4 dígitos.
- nickname único dentro de la sala.
- deviceId único por dispositivo durante la sesión.
- Validación de tipo de sala (`text`, `multimedia`).
- Sanitización XSS en entradas del backend.
- Límites de archivos: JPG, PNG, PDF y DOCX hasta 10 MB.

## Responsividad

El frontend ahora es más responsivo:

- formularios `max-w-md` y `w-full`
- layout del chat se adapta en pantallas pequeñas
- sidebar usa ancho completo en móviles y ancho fijo en escritorio

## Documentación y arquitectura

La arquitectura del sistema está descrita en `ARCHITECTURE.md`.

## Notas

- Si el backend o el frontend usan puertos distintos, ajusta la URL en `chat_frontend/src/api/axios.js`.
- Asegúrate de tener MongoDB corriendo en el URI configurado.
