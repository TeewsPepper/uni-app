import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambiame';
// ✅ Configuración de cookies para producción (mismo dominio)
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
};
// Middleware para verificar token desde cookie
export const verificarToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ error: 'No autorizado - Token no encontrado' });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            res.clearCookie('token', cookieOptions);
            res.status(401).json({ error: 'Usuario no encontrado' });
            return;
        }
        req.user = user;
        req.userId = user._id.toString();
        next();
    }
    catch (error) {
        console.error('Error verificando token:', error);
        res.clearCookie('token', cookieOptions);
        res.status(401).json({ error: 'Token inválido' });
    }
};
// REGISTRO
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email y contraseña requeridos' });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
            return;
        }
        const usuarioExistente = await User.findOne({ email });
        if (usuarioExistente) {
            res.status(400).json({ error: 'El email ya está registrado' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, cookieOptions);
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: { id: user._id, email: user.email }
        });
    }
    catch (error) {
        console.error('Error en registro:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
        res.status(500).json({ error: errorMessage });
    }
});
// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email y contraseña requeridos' });
            return;
        }
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }
        const passwordValida = await bcrypt.compare(password, user.password);
        if (!passwordValida) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, cookieOptions);
        res.json({
            message: 'Login exitoso',
            user: { id: user._id, email: user.email }
        });
    }
    catch (error) {
        console.error('Error en login:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
        res.status(500).json({ error: errorMessage });
    }
});
// VERIFICAR SESIÓN ACTUAL
router.get('/me', verificarToken, async (req, res) => {
    try {
        res.json({ user: req.user });
    }
    catch (error) {
        console.error('Error en /me:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});
// LOGOUT
router.post('/logout', (req, res) => {
    res.clearCookie('token', cookieOptions);
    res.json({ message: 'Logout exitoso' });
});
export default router;
//# sourceMappingURL=auth.js.map