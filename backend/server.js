// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import materiasRoutes from './routes/materias.js';
import tareasRoutes from './routes/tareas.js';
import examenesRoutes from './routes/examenes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// IMPORTANTE: CORS debe configurarse ANTES que las rutas
app.use(cors({
  origin: 'http://localhost:5173', // URL de Vite
  credentials: true, // PERMITE cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(cookieParser()); // Necesario para leer cookies

// Logging para debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Cookies:`, req.cookies);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/examenes', examenesRoutes);

// Conexión MongoDB
mongoose.connect('mongodb://localhost:27017/agenda_universitaria')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});