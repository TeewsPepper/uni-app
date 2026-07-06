// frontend/src/hooks/useTareas.ts
import { useState, useEffect, useCallback } from 'react';
import type { Tarea } from '../types';

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

export const useTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarTareas = useCallback(async (): Promise<void> => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/tareas`);
      if (!res.ok) throw new Error(`Error al cargar tareas: ${res.status}`);
      const data = await res.json() as Tarea[];
      setTareas(data);
    } catch (err) {
      const { message } = handleFetchError(err);
      setError(message);
      console.error('Error cargando tareas:', err);
    } finally {
      setCargando(false);
    }
  }, []);

  const agregarTarea = useCallback(async (
    titulo: string, 
    materiaId: string, 
    fechaEntrega: string
  ): Promise<Tarea> => {
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/tareas`, {
        method: 'POST',
        body: JSON.stringify({ titulo, materiaId, fechaEntrega })
      });
      
      if (!res.ok) throw new Error(`Error al agregar tarea: ${res.status}`);
      
      const nuevaTarea = await res.json() as Tarea;
      setTareas(prev => [...prev, nuevaTarea]);
      return nuevaTarea;
    } catch (err) {
      const { message } = handleFetchError(err);
      setError(message);
      console.error('Error agregando tarea:', err);
      throw err;
    }
  }, []);

  const completarTarea = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/tareas/${id}/completar`, {
        method: 'PATCH'
      });
      
      if (!res.ok) throw new Error(`Error al completar tarea: ${res.status}`);
      
      setTareas(prev => prev.map(t => 
        t._id === id ? { ...t, completada: true } : t
      ));
    } catch (err) {
      const { message } = handleFetchError(err);
      setError(message);
      console.error('Error completando tarea:', err);
    }
  }, []);

  const eliminarTarea = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/tareas/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error(`Error al eliminar tarea: ${res.status}`);
      
      setTareas(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      const { message } = handleFetchError(err);
      setError(message);
      console.error('Error eliminando tarea:', err);
    }
  }, []);

  // Cargar tareas al montar el hook
  useEffect(() => {
    cargarTareas();
  }, [cargarTareas]);

  return { 
    tareas, 
    cargando,
    error,
    cargarTareas, 
    agregarTarea, 
    completarTarea, 
    eliminarTarea 
  };
};