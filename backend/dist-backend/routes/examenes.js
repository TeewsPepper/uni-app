import express from 'express';
import Examen from '../models/Examen.js';
import { verificarToken } from './auth.js';
const router = express.Router();
// Aplicar verificarToken a todas las rutas de exámenes
router.use(verificarToken);
// Obtener exámenes del usuario autenticado
router.get('/', async (req, res) => {
    try {
        const usuarioId = req.userId;
        // Verificar que userId existe
        if (!usuarioId) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const { materiaId } = req.query;
        const filtro = { usuarioId };
        if (materiaId) {
            filtro.materiaId = materiaId;
        }
        const examenes = await Examen.find(filtro).sort({ fecha: 1 });
        res.json(examenes);
    }
    catch (error) {
        console.error('Error GET /examenes:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ error: errorMessage });
    }
});
// Crear nuevo examen
router.post('/', async (req, res) => {
    try {
        const usuarioId = req.userId;
        if (!usuarioId) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const body = req.body;
        const examen = new Examen({
            titulo: body.titulo,
            materiaId: body.materiaId,
            fecha: body.fecha,
            hora: body.hora || '',
            aula: body.aula || '',
            contenido: body.contenido || '',
            nota: body.nota !== undefined ? body.nota : null,
            usuarioId
        });
        await examen.save();
        res.status(201).json(examen);
    }
    catch (error) {
        console.error('Error POST /examenes:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(400).json({ error: errorMessage });
    }
});
// Obtener un examen por ID
router.get('/:id', async (req, res) => {
    try {
        const usuarioId = req.userId;
        if (!usuarioId) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const examen = await Examen.findOne({
            _id: req.params.id,
            usuarioId
        });
        if (!examen) {
            res.status(404).json({ error: 'Examen no encontrado' });
            return;
        }
        res.json(examen);
    }
    catch (error) {
        console.error('Error GET /examenes/:id:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ error: errorMessage });
    }
});
// Actualizar un examen
router.put('/:id', async (req, res) => {
    try {
        const usuarioId = req.userId;
        if (!usuarioId) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const examen = await Examen.findOne({
            _id: req.params.id,
            usuarioId
        });
        if (!examen) {
            res.status(404).json({ error: 'Examen no encontrado' });
            return;
        }
        const body = req.body;
        const updateData = {};
        if (body.titulo !== undefined)
            updateData.titulo = body.titulo;
        if (body.materiaId !== undefined)
            updateData.materiaId = body.materiaId;
        if (body.fecha !== undefined)
            updateData.fecha = body.fecha;
        if (body.hora !== undefined)
            updateData.hora = body.hora;
        if (body.aula !== undefined)
            updateData.aula = body.aula;
        if (body.contenido !== undefined)
            updateData.contenido = body.contenido;
        if (body.nota !== undefined)
            updateData.nota = body.nota;
        const examenActualizado = await Examen.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(examenActualizado);
    }
    catch (error) {
        console.error('Error PUT /examenes/:id:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(400).json({ error: errorMessage });
    }
});
// Eliminar examen
router.delete('/:id', async (req, res) => {
    try {
        const usuarioId = req.userId;
        if (!usuarioId) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const examen = await Examen.findOne({
            _id: req.params.id,
            usuarioId
        });
        if (!examen) {
            res.status(404).json({ error: 'Examen no encontrado' });
            return;
        }
        await Examen.findByIdAndDelete(req.params.id);
        res.json({ message: 'Examen eliminado correctamente' });
    }
    catch (error) {
        console.error('Error DELETE /examenes/:id:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ error: errorMessage });
    }
});
export default router;
//# sourceMappingURL=examenes.js.map