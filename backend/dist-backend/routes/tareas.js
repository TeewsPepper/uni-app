import express from 'express';
import Tarea from '../models/Tarea.js';
import { verificarToken } from './auth.js';
const router = express.Router();
// Aplicar verificarToken a todas las rutas de tareas
router.use(verificarToken);
// Obtener tareas del usuario autenticado
router.get('/', async (req, res) => {
    try {
        const usuarioId = req.userId;
        if (!usuarioId) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const { materiaId } = req.query;
        const filtro = { usuarioId };
        if (materiaId) {
            filtro.materiaId = materiaId;
        }
        const tareas = await Tarea.find(filtro).sort({ fechaEntrega: 1 });
        res.json(tareas);
    }
    catch (error) {
        console.error('Error GET /tareas:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ error: errorMessage });
    }
});
// Crear nueva tarea
router.post('/', async (req, res) => {
    try {
        const usuarioId = req.userId;
        if (!usuarioId) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const body = req.body;
        const tarea = new Tarea({
            titulo: body.titulo,
            descripcion: body.descripcion || '',
            materiaId: body.materiaId,
            fechaEntrega: body.fechaEntrega,
            prioridad: body.prioridad || 'media',
            completada: false,
            usuarioId
        });
        await tarea.save();
        res.status(201).json(tarea);
    }
    catch (error) {
        console.error('Error POST /tareas:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(400).json({ error: errorMessage });
    }
});
// Marcar tarea como completada
router.patch('/:id/completar', async (req, res) => {
    try {
        const usuarioId = req.userId;
        if (!usuarioId) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const tarea = await Tarea.findOne({
            _id: req.params.id,
            usuarioId
        });
        if (!tarea) {
            res.status(404).json({ error: 'Tarea no encontrada' });
            return;
        }
        tarea.completada = true;
        await tarea.save();
        res.json(tarea);
    }
    catch (error) {
        console.error('Error PATCH /tareas/:id/completar:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(400).json({ error: errorMessage });
    }
});
// Eliminar tarea
router.delete('/:id', async (req, res) => {
    try {
        const usuarioId = req.userId;
        if (!usuarioId) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const tarea = await Tarea.findOne({
            _id: req.params.id,
            usuarioId
        });
        if (!tarea) {
            res.status(404).json({ error: 'Tarea no encontrada' });
            return;
        }
        await Tarea.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tarea eliminada correctamente' });
    }
    catch (error) {
        console.error('Error DELETE /tareas/:id:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ error: errorMessage });
    }
});
export default router;
//# sourceMappingURL=tareas.js.map