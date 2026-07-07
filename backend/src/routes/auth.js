import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; 

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambiame';

// Middleware para verificar token desde cookie
export const verificarToken = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'No autorizado - Token no encontrado' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // ✅ VERIFICAR QUE EL USUARIO EXISTE EN LA DB
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      // ❌ Usuario no existe (ej: fue eliminado de la DB)
      res.clearCookie('token'); // Limpiar cookie inválida
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    // ✅ Pasar usuario completo al request
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    res.clearCookie('token');
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const user = new User({
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Generar token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Enviar cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true, // No accesible desde JavaScript
      secure: false, // true en producción con HTTPS
      sameSite: 'lax', // Protección CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });
    
    res.status(201).json({ 
      message: 'Usuario creado exitosamente',
      user: { id: user._id, email: user.email }
    });
    
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }
    
    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Generar token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Enviar cookie httpOnly (misma configuración que en registro)
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({ 
      message: 'Login exitoso',
      user: { id: user._id, email: user.email }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// VERIFICAR SESIÓN ACTUAL


router.get('/me', verificarToken, async (req, res) => {
  try {
    // ✅ Ya no es necesario buscar, `req.user` viene del middleware
    res.json({ user: req.user });
  } catch (error) {
    console.error('Error en /me:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  });
  res.json({ message: 'Logout exitoso' });
});

export default router;
