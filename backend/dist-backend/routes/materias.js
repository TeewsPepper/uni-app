import express from 'express';
import Materia from '../models/Materia.js';
import Tarea from '../models/Tarea.js';
import Examen from '../models/Examen.js';
import { verificarToken } from './auth.js';
const router = express.Router();
// Aplicar verificarToken a todas las rutas de materias
router.use(verificarToken);
// Obtener todas las materias del usuario autenticado
router.get('/', async (req, res) => {
    try {
        const usuarioId = req.userId;
        if (!usuarioId) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        console.log('📌 Materias - userId recibido:', usuarioId);
        const materias = await Materia.find({ usuarioId });
        console.log(`📚 Encontradas ${materias.length} materias para usuario ${usuarioId}`);
        res.json(materias);
    }
    catch (error) {
        console.error('Error en GET /materias:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ error: errorMessage });
    }
});
// Crear una nueva materia
router.post('/', async (req, res) => {
    try {
        const usuarioId = req.userId;
        if (!usuarioId) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const { nombre, profesor, color, horarios } = req.body;
        console.log('📥 Creando materia - horarios:', horarios);
        // Asegurar que los horarios tengan aula
        const horariosConAula = horarios?.map(horario => ({
            ...horario,
            aula: horario.aula || '' // Si no viene aula, poner string vacío
        })) || [];
        const materia = new Materia({
            nombre,
            profesor: profesor || '',
            color: color || '#4CAF50',
            horarios: horariosConAula,
            usuarioId,
        });
        await materia.save();
        console.log('✅ Materia creada con horarios:', materia.horarios);
        res.status(201).json(materia);
    }
    catch (error) {
        console.error('Error en POST /materias:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(400).json({ error: errorMessage });
    }
});
// Obtener una materia por ID
router.get('/:id', async (req, res) => {
    try {
        const usuarioId = req.userId;
        if (!usuarioId) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const materia = await Materia.findOne({
            _id: req.params.id,
            usuarioId
        });
        if (!materia) {
            res.status(404).json({ error: 'Materia no encontrada' });
            return;
        }
        res.json(materia);
    }
    catch (error) {
        console.error('Error en GET /materias/:id:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ error: errorMessage });
    }
});
// Eliminar una materia y todas sus tareas y exámenes asociados
router.delete('/:id', async (req, res) => {
    try {
        const usuarioId = req.userId;
        if (!usuarioId) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const materia = await Materia.findOne({
            _id: req.params.id,
            usuarioId,
        });
        if (!materia) {
            res.status(404).json({ error: 'Materia no encontrada' });
            return;
        }
        console.log(`🗑️ Eliminando materia: ${materia.nombre}`);
        console.log(`   - Buscando tareas con materiaId: ${req.params.id}`);
        const tareasEliminadas = await Tarea.deleteMany({ materiaId: req.params.id });
        console.log(`   - Tareas eliminadas: ${tareasEliminadas.deletedCount}`);
        const examenesEliminados = await Examen.deleteMany({ materiaId: req.params.id });
        console.log(`   - Exámenes eliminados: ${examenesEliminados.deletedCount}`);
        await Materia.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Materia eliminada correctamente',
            tareasEliminadas: tareasEliminadas.deletedCount,
            examenesEliminados: examenesEliminados.deletedCount
        });
    }
    catch (error) {
        console.error('Error en DELETE /materias/:id', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ error: errorMessage });
    }
});
// Actualizar una materia
router.put('/:id', async (req, res) => {
    try {
        const usuarioId = req.userId;
        if (!usuarioId) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const { nombre, profesor, color, horarios } = req.body;
        const materia = await Materia.findOne({
            _id: req.params.id,
            usuarioId,
        });
        if (!materia) {
            res.status(404).json({ error: 'Materia no encontrada' });
            return;
        }
        const updateData = {};
        if (nombre !== undefined)
            updateData.nombre = nombre;
        if (profesor !== undefined)
            updateData.profesor = profesor;
        if (color !== undefined)
            updateData.color = color;
        if (horarios !== undefined) {
            // Asegurar que los horarios tengan aula
            updateData.horarios = horarios.map(horario => ({
                ...horario,
                aula: horario.aula || ''
            }));
        }
        const materiaActualizada = await Materia.findByIdAndUpdate(req.params.id, updateData, { new: true });
        console.log('✅ Materia actualizada:', materiaActualizada?.nombre, 'Horarios:', materiaActualizada?.horarios);
        res.json(materiaActualizada);
    }
    catch (error) {
        console.error('Error en PUT /materias/:id', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(400).json({ error: errorMessage });
    }
});
export default router;
//# sourceMappingURL=materias.js.map