const express = require('express');
const router = express.Router();
const Tarea = require('../models/Tarea');
const { verificarToken } = require('./auth');

router.use(verificarToken);

// Obtener tareas del usuario autenticado
router.get('/', async (req, res) => {
  try {
    const usuarioId = req.userId; // Del token
    const { materiaId } = req.query;
    
    const filtro = { usuarioId };
    if (materiaId) {
      filtro.materiaId = materiaId;
    }
    
    const tareas = await Tarea.find(filtro).sort({ fechaEntrega: 1 });
    res.json(tareas);
  } catch (error) {
    console.error('Error GET /tareas:', error);
    res.status(500).json({ error: error.message });
  }
});

// Crear nueva tarea
router.post('/', async (req, res) => {
  try {
    const usuarioId = req.userId; // Del token
    const tarea = new Tarea({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion || '',
      materiaId: req.body.materiaId,
      fechaEntrega: req.body.fechaEntrega,
      prioridad: req.body.prioridad || 'media',
      completada: false,
      usuarioId
    });
    
    await tarea.save();
    res.status(201).json(tarea);
  } catch (error) {
    console.error('Error POST /tareas:', error);
    res.status(400).json({ error: error.message });
  }
});

// Marcar tarea como completada
router.patch('/:id/completar', async (req, res) => {
  try {
    const tarea = await Tarea.findOne({ 
      _id: req.params.id, 
      usuarioId: req.userId 
    });
    
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    tarea.completada = true;
    await tarea.save();
    res.json(tarea);
  } catch (error) {
    console.error('Error PATCH /tareas/:id/completar:', error);
    res.status(400).json({ error: error.message });
  }
});

// Eliminar tarea
router.delete('/:id', async (req, res) => {
  try {
    const tarea = await Tarea.findOne({ 
      _id: req.params.id, 
      usuarioId: req.userId 
    });
    
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    await Tarea.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error DELETE /tareas/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;