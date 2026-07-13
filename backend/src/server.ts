import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// Importar rutas
import authRoutes from './routes/auth.js';
import materiasRoutes from './routes/materias.js';
import tareasRoutes from './routes/tareas.js';      
import examenesRoutes from './routes/examenes.js';  
import breakRoutes from './routes/break.js';

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
  
  // ✅ Middleware que captura TODAS las rutas (sin usar path-to-regexp)
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Si la ruta no empieza con /api y no es un archivo estático
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    } else {
      next();
    }
  });
}

// 🛣️ Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/materias', materiasRoutes);   
app.use('/api/tareas', tareasRoutes);       
app.use('/api/examenes', examenesRoutes);  
app.use('/api/break', breakRoutes);

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