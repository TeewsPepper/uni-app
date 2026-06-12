// frontend/src/hooks/useExamenes.ts
import { useState, useEffect } from 'react';
import type { Examen } from '../types';

interface UseExamenesReturn {
  examenes: Examen[];
  cargando: boolean;
  agregarExamen: (examen: Omit<Examen, '_id' | 'materiaId'> & { materiaId: string }) => Promise<any>;
  actualizarExamen: (id: string, datos: Partial<Examen>) => Promise<void>;
  eliminarExamen: (id: string) => Promise<void>;
  recargar: () => Promise<void>;
}

export const useExamenes = (): UseExamenesReturn => {
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarExamenes = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/examenes', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Error al cargar exámenes');
      const data = await res.json();
      setExamenes(data);
    } catch (error) {
      console.error('Error cargando exámenes:', error);
    } finally {
      setCargando(false);
    }
  };

  const agregarExamen = async (examen: Omit<Examen, '_id' | 'materiaId'> & { materiaId: string }) => {
    try {
      const res = await fetch('http://localhost:3001/api/examenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(examen)
      });
      if (!res.ok) throw new Error('Error al agregar examen');
      const nuevoExamen = await res.json();
      setExamenes([...examenes, nuevoExamen]);
      return nuevoExamen;
    } catch (error) {
      console.error('Error agregando examen:', error);
      throw error;
    }
  };

  // NUEVA FUNCIÓN: Actualizar examen
  const actualizarExamen = async (id: string, datos: Partial<Examen>) => {
    try {
      const res = await fetch(`http://localhost:3001/api/examenes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(datos)
      });
      if (!res.ok) throw new Error('Error al actualizar examen');
      const examenActualizado = await res.json();
      setExamenes(examenes.map(e => e._id === id ? examenActualizado : e));
    } catch (error) {
      console.error('Error actualizando examen:', error);
      throw error;
    }
  };

  const eliminarExamen = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/examenes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Error al eliminar examen');
      setExamenes(examenes.filter(e => e._id !== id));
    } catch (error) {
      console.error('Error eliminando examen:', error);
    }
  };

  useEffect(() => {
    cargarExamenes();
  }, []);

  return { 
    examenes, 
    cargando, 
    agregarExamen, 
    actualizarExamen,  // ← AGREGADO
    eliminarExamen, 
    recargar: cargarExamenes 
  };
};