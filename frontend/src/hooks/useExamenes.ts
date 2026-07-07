import { useState, useCallback } from 'react';
import { examenesService } from '../services/api.js';
import type { Examen, CreateExamenData } from '../types';

interface UseExamenesReturn {
  examenes: Examen[];
  cargando: boolean;
  cargarExamenes: (materiaId?: string) => Promise<void>;
  agregarExamen: (data: CreateExamenData) => Promise<Examen>;
  actualizarExamen: (id: string, data: Partial<CreateExamenData>) => Promise<Examen>;
  eliminarExamen: (id: string) => Promise<void>;
  recargar: () => Promise<void>;
}

export const useExamenes = (): UseExamenesReturn => {
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);

  const cargarExamenes = useCallback(async (materiaId?: string): Promise<void> => {
    setCargando(true);
    try {
      const data = await examenesService.getAll(materiaId);
      setExamenes(data);
    } catch (error) {
      console.error('Error cargando exámenes:', error);
      throw error;
    } finally {
      setCargando(false);
    }
  }, []);

  const agregarExamen = useCallback(async (data: CreateExamenData): Promise<Examen> => {
    try {
      const nuevoExamen = await examenesService.create(data);
      setExamenes(prev => [...prev, nuevoExamen]);
      return nuevoExamen;
    } catch (error) {
      console.error('Error agregando examen:', error);
      throw error;
    }
  }, []);

  const actualizarExamen = useCallback(async (
    id: string,
    data: Partial<CreateExamenData>
  ): Promise<Examen> => {
    try {
      const examenActualizado = await examenesService.update(id, data);
      setExamenes(prev => prev.map(e => e._id === id ? examenActualizado : e));
      return examenActualizado;
    } catch (error) {
      console.error('Error actualizando examen:', error);
      throw error;
    }
  }, []);

  const eliminarExamen = useCallback(async (id: string): Promise<void> => {
    try {
      await examenesService.delete(id);
      setExamenes(prev => prev.filter(e => e._id !== id));
    } catch (error) {
      console.error('Error eliminando examen:', error);
      throw error;
    }
  }, []);

  const recargar = useCallback(async (): Promise<void> => {
    await cargarExamenes();
  }, [cargarExamenes]);

  return {
    examenes,
    cargando,
    cargarExamenes,
    agregarExamen,
    actualizarExamen,
    eliminarExamen,
    recargar,
  };
};