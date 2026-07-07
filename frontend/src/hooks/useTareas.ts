import { useState, useCallback } from 'react';
import { tareasService } from '../services/api.js';
import type { Tarea, CreateTareaData } from '../types';

interface UseTareasReturn {
  tareas: Tarea[];
  cargando: boolean;
  cargarTareas: (materiaId?: string) => Promise<void>;
  agregarTarea: (titulo: string, materiaId: string, fechaEntrega: string, prioridad?: 'baja' | 'media' | 'alta') => Promise<Tarea>;
  completarTarea: (id: string) => Promise<Tarea>;
  eliminarTarea: (id: string) => Promise<void>;
}

export const useTareas = (): UseTareasReturn => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);

  const cargarTareas = useCallback(async (materiaId?: string): Promise<void> => {
    setCargando(true);
    try {
      const data = await tareasService.getAll(materiaId);
      setTareas(data);
    } catch (error) {
      console.error('Error cargando tareas:', error);
      throw error;
    } finally {
      setCargando(false);
    }
  }, []);

  const agregarTarea = useCallback(async (
    titulo: string,
    materiaId: string,
    fechaEntrega: string,
    prioridad: 'baja' | 'media' | 'alta' = 'media'
  ): Promise<Tarea> => {
    try {
      const data: CreateTareaData = { titulo, materiaId, fechaEntrega, prioridad };
      const nuevaTarea = await tareasService.create(data);
      setTareas(prev => [...prev, nuevaTarea]);
      return nuevaTarea;
    } catch (error) {
      console.error('Error agregando tarea:', error);
      throw error;
    }
  }, []);

  const completarTarea = useCallback(async (id: string): Promise<Tarea> => {
    try {
      const tareaActualizada = await tareasService.completar(id);
      setTareas(prev => prev.map(t => t._id === id ? tareaActualizada : t));
      return tareaActualizada;
    } catch (error) {
      console.error('Error completando tarea:', error);
      throw error;
    }
  }, []);

  const eliminarTarea = useCallback(async (id: string): Promise<void> => {
    try {
      await tareasService.delete(id);
      setTareas(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      throw error;
    }
  }, []);

  return {
    tareas,
    cargando,
    cargarTareas,
    agregarTarea,
    completarTarea,
    eliminarTarea,
  };
};