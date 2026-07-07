import express from 'express';
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
const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
// CORS - Configurado para producción
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://uni-app-lux3.onrender.com']
    : ['http://localhost:5173'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
// Middlewares
app.use(express.json());
app.use(cookieParser());
// Logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
// Conectar a MongoDB
connectDB();
// ===== RUTAS API =====
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        mongodb: 'connected'
    });
});
app.use('/api/auth', authRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/examenes', examenesRoutes);
// ===== SERVIDOR DE FRONTEND EN PRODUCCIÓN =====
if (process.env.NODE_ENV === 'production') {
    // ✅ Servir archivos estáticos desde dist/ (frontend compilado)
    app.use(express.static(path.join(__dirname, '../dist')));
    app.use((req, res) => {
        if (req.path.startsWith('/api')) {
            res.status(404).json({ error: 'API endpoint not found' });
            return;
        }
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}
// ===== MANEJO DE ERRORES =====
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
}
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    const statusCode = err.statusCode || err.status || 500;
    const message = process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong!';
    res.status(statusCode).json({
        error: message
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
//# sourceMappingURL=server.js.map