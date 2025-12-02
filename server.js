import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { userRoutes } from './routes/user.routes.js';
import { productRoutes } from './routes/product.routes.js';
import { authRoutes } from './routes/auth.routes.js';


// Instancia de express
const app = express();

// Configuración de Middlewares
app.use(express.json()); // Permite el analisis de solicitudes en formato JSON
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
})); // Habilita CORS para permitir peticiones externas

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Conexión a la base de datos
connectDB();

// Configuración para levantar el servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});