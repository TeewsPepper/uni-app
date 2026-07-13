import express, { Router, Request, Response } from 'express';
import BreakActivity, { IBreakActivity, BreakActivityType } from '../models/BreakActivity.js';
import { verificarToken } from './auth.js';

interface BreakFilters {
  tipo?: BreakActivityType;
  temaRelacionado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

interface BreakActivityBody {
  titulo?: string;
  descripcion?: string;
  tipo?: BreakActivityType;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  ubicacion?: string;
  maxParticipantes?: number;
  temaRelacionado?: string;
}

const router: Router = express.Router();
router.use(verificarToken);

// GET - Listar actividades
router.get('/actividades', async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.userId;
    
    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    const { tipo, temaRelacionado, fechaDesde, fechaHasta } = req.query;
    
    const filtro: any = {};
    
    if (tipo) filtro.tipo = tipo;
    if (temaRelacionado) filtro.temaRelacionado = { $regex: temaRelacionado, $options: 'i' };
    
    // ✅ Filtrar por string (comparación directa)
    if (fechaDesde) filtro.fecha = { ...filtro.fecha, $gte: fechaDesde as string };
    if (fechaHasta) filtro.fecha = { ...filtro.fecha, $lte: fechaHasta as string };
    
    const actividades = await BreakActivity.find(filtro).sort({ fecha: 1, horaInicio: 1 });
    
    // Enriquecer con información de participación
    const actividadesEnriquecidas = actividades.map((actividad: IBreakActivity) => {
      const actObj = actividad.toObject();
      return {
        ...actObj,
        esCreador: actObj.creadorId === usuarioId,
        estaParticipando: actObj.participantes.includes(usuarioId),
        cuposDisponibles: actObj.maxParticipantes ? actObj.maxParticipantes - actObj.participantes.length : undefined
      };
    });
    
    res.json(actividadesEnriquecidas);
  } catch (error: unknown) {
    console.error('Error GET /break/actividades:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ error: errorMessage });
  }
});

// POST - Crear actividad
router.post('/actividades', async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.userId;
    
    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    const body = req.body as BreakActivityBody;
    
    if (!body.titulo || !body.descripcion || !body.tipo || !body.fecha || !body.horaInicio || !body.horaFin || !body.ubicacion) {
      res.status(400).json({ error: 'Todos los campos son requeridos' });
      return;
    }
    
    // ✅ Guardar fecha como string (sin conversión)
    if (body.horaInicio >= body.horaFin) {
      res.status(400).json({ error: 'La hora de inicio debe ser anterior a la hora de fin' });
      return;
    }
    
    const actividad = new BreakActivity({
      titulo: body.titulo,
      descripcion: body.descripcion,
      tipo: body.tipo,
      creadorId: usuarioId,
      fecha: body.fecha, // ✅ String directo
      horaInicio: body.horaInicio,
      horaFin: body.horaFin,
      ubicacion: body.ubicacion,
      maxParticipantes: body.maxParticipantes || undefined,
      participantes: [usuarioId],
      temaRelacionado: body.temaRelacionado || undefined
    });
    
    await actividad.save();
    res.status(201).json(actividad);
  } catch (error: unknown) {
    console.error('Error POST /break/actividades:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(400).json({ error: errorMessage });
  }
});

// GET - Obtener una actividad por ID
router.get('/actividades/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.userId;
    
    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    const actividad = await BreakActivity.findOne({ 
      _id: req.params.id, 
      creadorId: usuarioId
    });
    
    if (!actividad) {
      res.status(404).json({ error: 'Actividad no encontrada' });
      return;
    }
    
    res.json(actividad);
  } catch (error: unknown) {
    console.error('Error GET /break/actividades/:id:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ error: errorMessage });
  }
});

// PUT - Editar actividad
router.put('/actividades/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.userId;
    
    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    const actividad = await BreakActivity.findOne({ 
      _id: req.params.id, 
      creadorId: usuarioId
    });
    
    if (!actividad) {
      res.status(404).json({ error: 'Actividad no encontrada' });
      return;
    }
    
    const body = req.body as BreakActivityBody;
    const updateData: Partial<IBreakActivity> = {};
    
    if (body.titulo !== undefined) updateData.titulo = body.titulo;
    if (body.descripcion !== undefined) updateData.descripcion = body.descripcion;
    if (body.tipo !== undefined) updateData.tipo = body.tipo;
    if (body.ubicacion !== undefined) updateData.ubicacion = body.ubicacion;
    if (body.maxParticipantes !== undefined) updateData.maxParticipantes = body.maxParticipantes;
    if (body.temaRelacionado !== undefined) updateData.temaRelacionado = body.temaRelacionado;
    if (body.horaInicio !== undefined) updateData.horaInicio = body.horaInicio;
    if (body.horaFin !== undefined) updateData.horaFin = body.horaFin;
    
    // ✅ Guardar fecha como string (sin conversión)
    if (body.fecha !== undefined) {
      updateData.fecha = body.fecha;
    }
    
    if (updateData.horaInicio && updateData.horaFin && updateData.horaInicio >= updateData.horaFin) {
      res.status(400).json({ error: 'La hora de inicio debe ser anterior a la hora de fin' });
      return;
    }
    
    const actividadActualizada = await BreakActivity.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json(actividadActualizada);
  } catch (error: unknown) {
    console.error('Error PUT /break/actividades/:id:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(400).json({ error: errorMessage });
  }
});

// DELETE - Eliminar actividad
router.delete('/actividades/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.userId;
    
    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    const actividad = await BreakActivity.findOne({ 
      _id: req.params.id, 
      creadorId: usuarioId
    });
    
    if (!actividad) {
      res.status(404).json({ error: 'Actividad no encontrada' });
      return;
    }
    
    await BreakActivity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Actividad eliminada correctamente' });
  } catch (error: unknown) {
    console.error('Error DELETE /break/actividades/:id:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ error: errorMessage });
  }
});

// POST - Unirse a actividad
router.post('/actividades/:id/unirse', async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.userId;
    
    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    const actividad = await BreakActivity.findById(req.params.id);
    
    if (!actividad) {
      res.status(404).json({ error: 'Actividad no encontrada' });
      return;
    }
    
    if (actividad.participantes.includes(usuarioId)) {
      res.status(400).json({ error: 'Ya estás participando en esta actividad' });
      return;
    }
    
    if (actividad.maxParticipantes && actividad.participantes.length >= actividad.maxParticipantes) {
      res.status(400).json({ error: 'La actividad ha alcanzado el límite de participantes' });
      return;
    }
    
    actividad.participantes.push(usuarioId);
    await actividad.save();
    res.json(actividad);
  } catch (error: unknown) {
    console.error('Error POST /break/actividades/:id/unirse:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ error: errorMessage });
  }
});

// POST - Salir de actividad
router.post('/actividades/:id/salir', async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.userId;
    
    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    const actividad = await BreakActivity.findById(req.params.id);
    
    if (!actividad) {
      res.status(404).json({ error: 'Actividad no encontrada' });
      return;
    }
    
    if (!actividad.participantes.includes(usuarioId)) {
      res.status(400).json({ error: 'No estás participando en esta actividad' });
      return;
    }
    
    if (actividad.creadorId === usuarioId) {
      res.status(400).json({ error: 'El creador no puede salirse de la actividad' });
      return;
    }
    
    actividad.participantes = actividad.participantes.filter(p => p !== usuarioId);
    await actividad.save();
    res.json(actividad);
  } catch (error: unknown) {
    console.error('Error POST /break/actividades/:id/salir:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;