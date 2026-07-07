import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import materiasRoutes from './routes/materias.js';
import tareasRoutes from './routes/tareas.js';
import examenesRoutes from './routes/examenes.js';
import connectDB from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3001', 10);

// CORS
const allowedOrigins: string[] = process.env.NODE_ENV === 'production'
  ? ['https://uni-app-lux3.onrender.com']
  : ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Conectar a MongoDB
connectDB();

// ===== RUTAS =====

// ✅ RUTA DE HEALTH CHECK (pública)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: 'connected'
  });
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/examenes', examenesRoutes);

// ===== SERVICIO DE ARCHIVOS ESTÁTICOS (SOLO PRODUCCIÓN) =====
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));
}

// ===== MANEJO DE RUTAS =====
// Las rutas API no encontradas devuelven 404
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// En producción, servir index.html para cualquier otra ruta
if (process.env.NODE_ENV === 'production') {
  app.use((req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
} else {
  // En desarrollo, 404 para rutas no API
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });
}

// ===== MIDDLEWARE DE ERRORES =====
interface IAppError extends Error {
  status?: number;
  statusCode?: number;
}

app.use((err: IAppError, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  
  const statusCode = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Something went wrong!';
  
  res.status(statusCode).json({ 
    error: message
  });
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});