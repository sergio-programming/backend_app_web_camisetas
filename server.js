import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './config/db.js';
import { userRoutes } from './routes/user.routes.js';
import { productRoutes } from './routes/product.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';


// Instancia de express
const app = express();

// Configuración de las variables de entorno
dotenv.config();

// Configuración de Middlewares
app.use(express.json()); // Permite el analisis de solicitudes en formato JSON
app.use(cookieParser());
app.use(cors({
    origin: [
        'http://localhost:4200',
        'https://app-web-camisetas.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); // Habilita CORS para permitir peticiones externas

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Manejador de errores
app.use(errorHandler);

// Conexión a la base de datos
connectToDatabase();

// Configuración para levantar el servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});