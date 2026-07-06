// frontend/src/hooks/useMaterias.ts
import { useState, useEffect, useCallback } from 'react';
import type { Materia, Horario } from '../types';

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

export const useMaterias = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarMaterias = useCallback(async (): Promise<void> => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/materias`);
      if (!res.ok) throw new Error(`Error al cargar materias: ${res.status}`);
      const data = await res.json() as Materia[];
      setMaterias(data);
    } catch (err) {
      const { message } = handleFetchError(err);
      setError(message);
      console.error('Error cargando materias:', err);
    } finally {
      setCargando(false);
    }
  }, []);

  const agregarMateria = useCallback(async (
    nombre: string, 
    profesor: string, 
    horarios: Horario[], 
    color: string
  ): Promise<void> => {
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/materias`, {
        method: 'POST',
        body: JSON.stringify({ nombre, profesor, horarios, color })
      });
      
      if (!res.ok) throw new Error(`Error al agregar materia: ${res.status}`);
      
      const nuevaMateria = await res.json() as Materia;
      setMaterias(prev => [...prev, nuevaMateria]);
    } catch (err) {
      const { message } = handleFetchError(err);
      setError(message);
      console.error('Error agregando materia:', err);
      throw err;
    }
  }, []);

  const actualizarProfesor = useCallback(async (id: string, profesor: string): Promise<void> => {
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/materias/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ profesor })
      });
      
      if (!res.ok) throw new Error(`Error al actualizar profesor: ${res.status}`);
      
      const materiaActualizada = await res.json() as Materia;
      setMaterias(prev => prev.map(m => m._id === id ? materiaActualizada : m));
    } catch (err) {
      const { message } = handleFetchError(err);
      setError(message);
      console.error('Error actualizando profesor:', err);
    }
  }, []);

  const actualizarMateria = useCallback(async (
    id: string, 
    nombre: string, 
    profesor: string, 
    horarios: Horario[], 
    color: string
  ): Promise<void> => {
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/materias/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ nombre, profesor, horarios, color })
      });
      
      if (!res.ok) throw new Error(`Error al actualizar materia: ${res.status}`);
      
      const materiaActualizada = await res.json() as Materia;
      setMaterias(prev => prev.map(m => m._id === id ? materiaActualizada : m));
    } catch (err) {
      const { message } = handleFetchError(err);
      setError(message);
      console.error('Error actualizando materia:', err);
      throw err;
    }
  }, []);

  const eliminarMateria = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/materias/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error(`Error al eliminar materia: ${res.status}`);
      
      setMaterias(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      const { message } = handleFetchError(err);
      setError(message);
      console.error('Error eliminando materia:', err);
    }
  }, []);

  // Cargar materias al montar el hook
  useEffect(() => {
    cargarMaterias();
  }, [cargarMaterias]);

  return { 
    materias, 
    cargando,
    error,
    cargarMaterias, 
    agregarMateria, 
    actualizarProfesor, 
    actualizarMateria, 
    eliminarMateria 
  };
};