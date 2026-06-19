// frontend/src/hooks/useExamenes.ts
import { useState, useEffect, useCallback } from 'react';
import type { Examen } from '../types';

// ✨ Constante para la API
const API_BASE_URL = 'http://localhost:3001/api';

// ✨ Tipo para el error de fetch
interface FetchError {
  message: string;
  status?: number;
}

// ✨ Helper para manejar errores
const handleFetchError = (error: unknown): FetchError => {
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'Error desconocido' };
};

// ✨ Tipo para crear un nuevo examen (sin _id, y materiaId como string)
export type NuevoExamen = Omit<Examen, '_id' | 'materiaId'> & { materiaId: string };

// ✨ Tipo para actualizar un examen
export type ActualizarExamen = Partial<Omit<Examen, '_id'>>;

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
};

export const useExamenes = () => {
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarExamenes = useCallback(async (): Promise<void> => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/examenes`);
      if (!res.ok) throw new Error(`Error al cargar exámenes: ${res.status}`);
      const data = await res.json() as Examen[];
      setExamenes(data);
    } catch (err) {
      const { message } = handleFetchError(err);
      setError(message);
      console.error('Error cargando exámenes:', err);
    } finally {
      setCargando(false);
    }
  }, []);

  const agregarExamen = useCallback(async (examen: NuevoExamen): Promise<void> => {
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/examenes`, {
        method: 'POST',
        body: JSON.stringify(examen)
      });
      
      if (!res.ok) throw new Error(`Error al agregar examen: ${res.status}`);
      
      const nuevoExamen = await res.json() as Examen;
      setExamenes(prev => [...prev, nuevoExamen]);
    } catch (err) {
      const { message } = handleFetchError(err);
      setError(message);
      console.error('Error agregando examen:', err);
      throw err;
    }
  }, []);

  const actualizarExamen = useCallback(async (id: string, datos: ActualizarExamen): Promise<void> => {
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/examenes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos)
      });
      
      if (!res.ok) throw new Error(`Error al actualizar examen: ${res.status}`);
      
      const examenActualizado = await res.json() as Examen;
      setExamenes(prev => prev.map(e => e._id === id ? examenActualizado : e));
    } catch (err) {
      const { message } = handleFetchError(err);
      setError(message);
      console.error('Error actualizando examen:', err);
      throw err;
    }
  }, []);

  const eliminarExamen = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/examenes/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error(`Error al eliminar examen: ${res.status}`);
      
      setExamenes(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      const { message } = handleFetchError(err);
      setError(message);
      console.error('Error eliminando examen:', err);
    }
  }, []);

  const recargar = useCallback(async (): Promise<void> => {
    await cargarExamenes();
  }, [cargarExamenes]);

  // Cargar exámenes al montar el hook
  useEffect(() => {
    cargarExamenes();
  }, [cargarExamenes]);

  return { 
    examenes, 
    cargando,
    error,
    agregarExamen, 
    actualizarExamen, 
    eliminarExamen, 
    recargar 
  };
};