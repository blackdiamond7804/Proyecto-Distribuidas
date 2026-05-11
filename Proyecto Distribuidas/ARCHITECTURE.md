# Arquitectura del Proyecto

## Visión general

El proyecto está separado en dos capas principales:

- `chat_backend`: servidor REST + Socket.IO, lógica de negocio, persistencia y validación.
- `chat_frontend`: aplicación React que consume el backend y se conecta por WebSockets.

# Tecnologías utilizadas

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT
- bcryptjs
- multer
- worker_threads

## Frontend
- React.js
- Vite
- TailwindCSS
- Axios
- Socket.IO Client

## Comunicación en tiempo real: 
- WebSockets con Socket.IO

## Concurrencia: 
- Worker Threads

## Seguridad: 
- JWT
- Helmet
- Rate Limiting
- XSS Clean

# Componentes

## Backend

- `server.js`: configuración de Express, Socket.IO, middlewares y rutas.
- `routes/*.js`: rutas de admin, salas y uploads.
- `controllers/*.js`: lógica de endpoints.
- `middleware/*.js`: seguridad, rate limiting, sanitización y autenticación.
- `models/*.js`: esquemas de MongoDB para admin, room, message y sesiones.
- `services/*.js`: lógica de room, auth y workers.
- `sockets/socketHandler.js`: manejo de eventos en tiempo real.
- `workers/*`: procesamiento asíncrono con `worker_threads`.

## Frontend

- `src/pages/AdminLogin.jsx`: login de administrador.
- `src/pages/Dashboard.jsx`: creación de salas.
- `src/pages/JoinRoom.jsx`: ingreso de usuarios por PIN y nickname.
- `src/pages/ChatRoom.jsx`: sala de chat en tiempo real.
- `src/components/ChatBox.jsx`: renderizado de mensajes.
- `src/components/UploadButton.jsx`: carga de archivos.
- `src/components/Sidebar.jsx`: lista de usuarios conectados.

# Diagrama de arquitectura
![Arquitectura del sistema](./Image/Actualizado%20diagrama.png)

# Flujo de datos
1. El administrador inicia sesión y obtiene un token JWT.
2. El administrador crea una sala, backend genera `roomId` y PIN hasheado.
3. El usuario ingresa PIN y nickname, backend valida y registra `UserSession`.
4. El usuario se conecta por Socket.IO y recibe mensajes anteriores + lista de usuarios.
5. Los mensajes y archivos en salas multimedia viajan por Socket.IO.
6. El backend puede procesar uploads y mensajes con `worker_threads`.

# Requisitos cubiertos
- Autenticación de admin segura.
- Salas únicas con PIN encriptado.
- Acceso anónimo limitado por dispositivo.
- Mensajería instantánea por WebSockets.
- Subida y visualización de archivos multimedia.
- Validaciones de entrada y sanitización.
- Diseño frontend responsive.

# Manejo de concurrencia

El sistema implementa concurrencia utilizando:

- Worker Threads de Node.js.
- Procesamiento asíncrono de mensajes.
- Broadcast simultáneo con Socket.IO.
- Manejo paralelo de subida de archivos.
- Operaciones no bloqueantes del Event Loop.
Esto permite soportar múltiples usuarios concurrentes sin degradar el rendimiento.

# Mensajes temporales

El sistema soporta mensajes temporales autodestructivos:

- Texto
- Imágenes
- Archivos multimedia

Los mensajes:
- se activan al ser leídos,
- muestran countdown en tiempo real,
- se eliminan automáticamente del frontend y MongoDB.

# Escalabilidad

La arquitectura está preparada para:

- múltiples salas simultáneas,
- más de 50 usuarios concurrentes,
- procesamiento paralelo,
- separación frontend/backend,
- futura integración con Redis o Docker.