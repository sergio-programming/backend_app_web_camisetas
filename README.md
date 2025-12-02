🛒 Backend – APP Web Camisetas

Este es el backend de la aplicación Blackened Camisetas, desarrollado con Node.js + Express, conectado a una base de datos MongoDB, autenticación con JWT y organizado bajo una arquitectura modular profesional.

🚀 Tecnologías utilizadas

Node.js

Express

MongoDB + Mongoose

JSON Web Tokens (JWT) para autenticación

bcryptjs para encriptar contraseñas

CORS

Dotenv para manejo de variables de entorno

📁 Estructura del proyecto

Tu backend está organizado así:

BACKEND_APP_WEB_CAMISETAS/
├── config/
│   └── db.js                # Conexión a la base de datos
├── controllers/
│   ├── auth.controller.js   # Login/Register
│   ├── product.controller.js
│   └── user.controller.js
├── middlewares/
│   └── auth.middleware.js   # Validación de token JWT
├── models/
│   ├── product.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── product.routes.js
│   └── user.routes.js
├── utils/
│   └── token.utils.js       # Funciones JWT
├── .env                     # Variables de entorno (no se sube al repo)
├── .gitignore
├── package.json
├── package-lock.json
└── server.js                # Punto de entrada del servidor

⚙️ Variables de entorno (archivo .env)

Debes crear un archivo .env en la raíz del backend:

PORT=3000
MONGO_URI=tu_conexion_de_mongo
JWT_SECRET=una_clave_segura


⚠️ Este archivo NO se debe subir al repositorio.

▶️ Cómo ejecutar el backend

Instala las dependencias:

npm install

Inicia el servidor en modo desarrollo:

npm run dev

El servidor quedará corriendo en:

http://localhost:3000

🔗 Endpoints principales
🔐 Autenticación

POST /api/auth/login

POST /api/auth/logout

👤 Usuarios

GET /api/users

GET /api/users/:id

POST /api/users

PUT /api/users/:id

DELETE /api/users/:id

👕 Productos

GET /api/products

GET /api/products/:id

POST /api/products

PUT /api/products/:id

DELETE /api/products/:id

🔒 Seguridad implementada

✔ Validación de token JWT
✔ Rutas protegidas con middleware auth.middleware.js
✔ Contraseñas encriptadas con bcrypt
✔ Roles

🛠️ Scripts disponibles

En package.json:

"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
}

