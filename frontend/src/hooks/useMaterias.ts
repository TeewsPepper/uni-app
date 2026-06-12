import { useState, useEffect } from 'react';
import type { Materia, Horario } from '../types';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
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
  const [cargando, setCargando] = useState(true);

  const cargarMaterias = async () => {
    try {
      const res = await fetchWithAuth('http://localhost:3001/api/materias');
      if (!res.ok) throw new Error('Error al cargar materias');
      const data = await res.json();
      setMaterias(data);
    } catch (error) {
      console.error('Error cargando materias:', error);
    } finally {
      setCargando(false);
    }
  };

  const agregarMateria = async (nombre: string, profesor: string, horarios: Horario[], color: string) => {
  try {
    const res = await fetchWithAuth('http://localhost:3001/api/materias', {
      method: 'POST',
      body: JSON.stringify({ nombre, profesor, horarios, color })
    });
    if (!res.ok) throw new Error('Error al agregar materia');
    const nuevaMateria = await res.json();
    setMaterias([...materias, nuevaMateria]);
  } catch (error) {
    console.error('Error agregando materia:', error);
    throw error;
  }
};

  const actualizarProfesor = async (id: string, profesor: string) => {
    try {
      const res = await fetchWithAuth(`http://localhost:3001/api/materias/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ profesor })
      });
      if (!res.ok) throw new Error('Error al actualizar profesor');
      const materiaActualizada = await res.json();
      setMaterias(materias.map(m => m._id === id ? materiaActualizada : m));
    } catch (error) {
      console.error('Error actualizando profesor:', error);
    }
  };

  // Agregar esta función al hook
const actualizarMateria = async (id: string, nombre: string, profesor: string, horarios: Horario[], color: string) => {
    try {
      const res = await fetchWithAuth(`http://localhost:3001/api/materias/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ nombre, profesor, horarios, color })
      });
      if (!res.ok) throw new Error('Error al actualizar materia');
      const materiaActualizada = await res.json();
      setMaterias(materias.map(m => m._id === id ? materiaActualizada : m));
    } catch (error) {
      console.error('Error actualizando materia:', error);
      throw error;
    }
  };


  const eliminarMateria = async (id: string) => {
    try {
      const res = await fetchWithAuth(`http://localhost:3001/api/materias/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Error al eliminar materia');
      setMaterias(materias.filter(m => m._id !== id));
    } catch (error) {
      console.error('Error eliminando materia:', error);
    }
  };

  useEffect(() => {
    cargarMaterias();
  }, []);

  return { materias, cargando, cargarMaterias, agregarMateria, actualizarProfesor, actualizarMateria, eliminarMateria };
};