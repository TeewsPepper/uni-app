// components/ProximosEventos/ProximosEventos.types.ts
import type { Tarea, Examen, Materia } from '../../types';

// Tipos de eventos posibles
export type TipoEvento = '📝' | '📚' | '🏫';

// Mapeo de días
export type DiasMap = Record<string, number>;

// Evento individual en la lista
export interface Evento {
  type: TipoEvento;
  title: string;
  examenId?: string;
  materiaId?: string;
  color?: string;
}

// Día con sus eventos
export interface DiaEventos {
  fecha: Date;
  eventos: Evento[];
}

// Props del componente
export interface ProximosEventosProps {
  tareas: Tarea[];
  examenes: Examen[];
  materias: Materia[];
  onEditarExamen?: (examen: Examen) => void;
  onDiaClick?: (fecha: string) => void;
}

// Orden de prioridad para mostrar eventos
export const ORDEN_EVENTOS: Record<TipoEvento, number> = {
  '📝': 1,  // Tareas primero
  '📚': 2,  // Exámenes segundo
  '🏫': 3,  // Horarios tercero
};

// Type guard para verificar tipo de evento válido
export const esTipoEventoValido = (type: string): type is TipoEvento => {
  return type === '📝' || type === '📚' || type === '🏫';
};