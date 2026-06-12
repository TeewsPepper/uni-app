import { useState, useEffect } from 'react';
import type { Tarea } from '../types';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',  // ← Agregar esta línea
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
};

export const useTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);

  const cargarTareas = async () => {
    try {
      const res = await fetchWithAuth('http://localhost:3001/api/tareas');
      if (!res.ok) throw new Error('Error al cargar tareas');
      const data = await res.json();
      setTareas(data);
    } catch (error) {
      console.error('Error cargando tareas:', error);
    }
  };

  const agregarTarea = async (titulo: string, materiaId: string, fechaEntrega: string) => {
    try {
      const res = await fetchWithAuth('http://localhost:3001/api/tareas', {
        method: 'POST',
        body: JSON.stringify({ titulo, materiaId, fechaEntrega })
      });
      const nuevaTarea = await res.json();
      setTareas([...tareas, nuevaTarea]);
      return nuevaTarea;
    } catch (error) {
      console.error('Error agregando tarea:', error);
      throw error;
    }
  };

  const completarTarea = async (id: string) => {
    try {
      await fetchWithAuth(`http://localhost:3001/api/tareas/${id}/completar`, {
        method: 'PATCH'
      });
      setTareas(tareas.map(t => t._id === id ? { ...t, completada: true } : t));
    } catch (error) {
      console.error('Error completando tarea:', error);
    }
  };

  const eliminarTarea = async (id: string) => {
    try {
      await fetchWithAuth(`http://localhost:3001/api/tareas/${id}`, {
        method: 'DELETE'
      });
      setTareas(tareas.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error eliminando tarea:', error);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  return { tareas, cargarTareas, agregarTarea, completarTarea, eliminarTarea };
};