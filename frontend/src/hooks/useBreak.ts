import { useState, useEffect, useCallback } from 'react';
import type { BreakActivity, CreateBreakActivityDTO, BreakFilters } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const useBreak = () => {
  const [actividades, setActividades] = useState<BreakActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActividades = useCallback(async (filters?: BreakFilters): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filters?.tipo) params.append('tipo', filters.tipo);
      if (filters?.temaRelacionado) params.append('temaRelacionado', filters.temaRelacionado);
      if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
      if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
      
      const url = `${API_BASE_URL}/break/actividades${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url, { credentials: 'include' });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener actividades');
      }
      
      const data = await response.json();
      setActividades(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const crearActividad = useCallback(async (data: CreateBreakActivityDTO): Promise<BreakActivity> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/break/actividades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear actividad');
      }
      
      const nuevaActividad = await response.json();
      setActividades(prev => [...prev, nuevaActividad]);
      return nuevaActividad;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editarActividad = useCallback(async (id: string, data: Partial<CreateBreakActivityDTO>): Promise<BreakActivity> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/break/actividades/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al editar actividad');
      }
      
      const actividadActualizada = await response.json();
      setActividades(prev => prev.map(a => a._id === id ? actividadActualizada : a));
      return actividadActualizada;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarActividad = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/break/actividades/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar actividad');
      }
      
      setActividades(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unirseActividad = useCallback(async (id: string): Promise<BreakActivity> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/break/actividades/${id}/unirse`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al unirse a la actividad');
      }
      
      const actividadActualizada = await response.json();
      setActividades(prev => prev.map(a => a._id === id ? actividadActualizada : a));
      return actividadActualizada;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const salirActividad = useCallback(async (id: string): Promise<BreakActivity> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/break/actividades/${id}/salir`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al salir de la actividad');
      }
      
      const actividadActualizada = await response.json();
      setActividades(prev => prev.map(a => a._id === id ? actividadActualizada : a));
      return actividadActualizada;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActividades();
  }, [fetchActividades]);

  return {
    actividades,
    loading,
    error,
    fetchActividades,
    crearActividad,
    editarActividad,
    eliminarActividad,
    unirseActividad,
    salirActividad
  };
};