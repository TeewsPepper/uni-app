import express, { Router, Request, Response } from 'express';
import Examen, { IExamen } from '../models/Examen.js';
import { verificarToken } from './auth.js';

// Definir tipos para los filtros
interface ExamenFilters {
  usuarioId: string;
  materiaId?: string;
}

// Definir tipo para el body de creación/actualización
interface ExamenBody {
  titulo?: string;
  materiaId?: string;
  fecha?: Date;
  hora?: string;
  aula?: string;
  contenido?: string;
  nota?: number | null;
}

const router: Router = express.Router();

// Aplicar verificarToken a todas las rutas de exámenes
router.use(verificarToken);

// Obtener exámenes del usuario autenticado
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.userId;
    
    // Verificar que userId existe
    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    const { materiaId } = req.query;
    
    const filtro: ExamenFilters = { usuarioId };
    if (materiaId) {
      filtro.materiaId = materiaId as string;
    }
    
    const examenes = await Examen.find(filtro).sort({ fecha: 1 });
    res.json(examenes);
  } catch (error: unknown) {
    console.error('Error GET /examenes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ error: errorMessage });
  }
});

// Crear nuevo examen
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.userId;
    
    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    const body = req.body as ExamenBody;
    
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
  } catch (error: unknown) {
    console.error('Error POST /examenes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(400).json({ error: errorMessage });
  }
});

// Obtener un examen por ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
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
  } catch (error: unknown) {
    console.error('Error GET /examenes/:id:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ error: errorMessage });
  }
});

// Actualizar un examen
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
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
    
    const body = req.body as ExamenBody;
    const updateData: Partial<IExamen> = {};
    
    if (body.titulo !== undefined) updateData.titulo = body.titulo;
    if (body.materiaId !== undefined) updateData.materiaId = body.materiaId as any;
    if (body.fecha !== undefined) updateData.fecha = body.fecha;
    if (body.hora !== undefined) updateData.hora = body.hora;
    if (body.aula !== undefined) updateData.aula = body.aula;
    if (body.contenido !== undefined) updateData.contenido = body.contenido;
    if (body.nota !== undefined) updateData.nota = body.nota;
    
    const examenActualizado = await Examen.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json(examenActualizado);
  } catch (error: unknown) {
    console.error('Error PUT /examenes/:id:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(400).json({ error: errorMessage });
  }
});

// Eliminar examen
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
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
  } catch (error: unknown) {
    console.error('Error DELETE /examenes/:id:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;