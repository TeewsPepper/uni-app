import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// Importar rutas
import authRoutes from './routes/auth.js';

// Configurar __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

const app = express();

// 🔧 Middlewares
app.use(express.json());
app.use(cookieParser());

// Configurar CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://uni-app-lux3.onrender.com' 
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 🗄️ Conectar a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agenda-universitaria';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err: Error) => console.error('❌ MongoDB connection error:', err));

// 📦 Servir archivos estáticos del frontend (en producción)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Para SPA: manejar todas las rutas que no sean API
  app.get('/:path(.*)?', (req: Request, res: Response) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
  });
}

// 🛣️ Rutas de la API
app.use('/api/auth', authRoutes);

// Ejemplo de ruta de prueba
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', environment: process.env.NODE_ENV });
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;