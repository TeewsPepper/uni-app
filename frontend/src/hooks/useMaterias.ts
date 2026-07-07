import { useState, useCallback } from 'react';
import { materiasService } from '../services/api.js';
import type { Materia, Horario, CreateMateriaData } from '../types';

interface UseMateriasReturn {
  materias: Materia[];
  cargando: boolean;
  cargarMaterias: () => Promise<void>;
  agregarMateria: (nombre: string, profesor: string, color: string, horarios: Horario[]) => Promise<void>;
  actualizarProfesor: (id: string, profesor: string) => Promise<void>;
  actualizarMateria: (id: string, nombre: string, profesor: string, horarios: Horario[], color: string) => Promise<void>;
  eliminarMateria: (id: string) => Promise<void>;
}

export const useMaterias = (): UseMateriasReturn => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);

  const cargarMaterias = useCallback(async (): Promise<void> => {
    setCargando(true);
    try {
      const data = await materiasService.getAll();
      setMaterias(data);
    } catch (error) {
      console.error('Error cargando materias:', error);
      throw error;
    } finally {
      setCargando(false);
    }
  }, []);

  const agregarMateria = useCallback(async (
    nombre: string,
    profesor: string,
    color: string,
    horarios: Horario[]
  ): Promise<void> => {
    try {
      const data: CreateMateriaData = { nombre, profesor, color, horarios };
      const nuevaMateria = await materiasService.create(data);
      setMaterias(prev => [...prev, nuevaMateria]);
    } catch (error) {
      console.error('Error agregando materia:', error);
      throw error;
    }
  }, []);

  const actualizarProfesor = useCallback(async (id: string, profesor: string): Promise<void> => {
    try {
      const materiaActualizada = await materiasService.update(id, { profesor });
      setMaterias(prev => prev.map(m => m._id === id ? materiaActualizada : m));
    } catch (error) {
      console.error('Error actualizando profesor:', error);
      throw error;
    }
  }, []);

  const actualizarMateria = useCallback(async (
    id: string,
    nombre: string,
    profesor: string,
    horarios: Horario[],
    color: string
  ): Promise<void> => {
    try {
      const materiaActualizada = await materiasService.update(id, {
        nombre,
        profesor,
        horarios,
        color
      });
      setMaterias(prev => prev.map(m => m._id === id ? materiaActualizada : m));
    } catch (error) {
      console.error('Error actualizando materia:', error);
      throw error;
    }
  }, []);

  const eliminarMateria = useCallback(async (id: string): Promise<void> => {
    try {
      await materiasService.delete(id);
      setMaterias(prev => prev.filter(m => m._id !== id));
    } catch (error) {
      console.error('Error eliminando materia:', error);
      throw error;
    }
  }, []);

  return {
    materias,
    cargando,
    cargarMaterias,
    agregarMateria,
    actualizarProfesor,
    actualizarMateria,
    eliminarMateria,
  };
};