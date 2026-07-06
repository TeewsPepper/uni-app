// components/Calendar/DiaDetalleModal.types.ts
import type { EventInput } from '@fullcalendar/core';
import type { Tarea, Examen, Materia } from '../../types';  // ✅ IMPORTAR Materia

// Tipos específicos de FullCalendar para este componente
export interface ExtendedEventProps {
  tipo: 'tarea' | 'examen' | 'horario';
  id?: string;        // Para tareas y exámenes
  materiaId?: string; // Para horarios
}

export type CalendarioEvento = EventInput & {
  extendedProps?: ExtendedEventProps;
};

// Re-exportamos DateClickArg para conveniencia
export type { DateClickArg } from '@fullcalendar/interaction';

// Mapeo de días (específico del componente)
export type DiasMap = Record<string, number>;

// ============================================
// TIPOS PARA DiaDetalleModal
// ============================================

// Tipo para eventos combinados en el modal
export type TipoEvento = 'tarea' | 'examen' | 'horario';

// Evento de tarea en el modal
export interface EventoTarea {
  type: 'tarea';
  id: string;
  titulo: string;
  materiaNombre: string;
  materiaId: string;
  completada: boolean;
}

// Evento de examen en el modal
export interface EventoExamen {
  type: 'examen';
  id: string;
  titulo: string;
  materiaNombre: string;
  materiaId: string;
  hora: string;
  aula: string;
  contenido: string;
  nota: number | null;
}

// Evento de horario en el modal
export interface EventoHorario {
  type: 'horario';
  titulo: string;
  materiaNombre: string;
  horaInicio: string;
  horaFin: string;
  aula: string;
  color: string;
}

// Unión de todos los eventos posibles
export type EventoDelDia = EventoTarea | EventoExamen | EventoHorario;

// Props del componente
export interface DiaDetalleModalProps {
  visible: boolean;
  fecha: string;
  tareas: Tarea[];
  examenes: Examen[];
  materias: Materia[];
  onClose: () => void;
  onAgregarTarea?: (materiaId: string, titulo: string, fecha: string) => Promise<void>;
  onAgregarExamen?: (materiaId: string, titulo: string, fecha: string, hora: string, aula: string) => Promise<void>;
  onCompletarTarea?: (id: string) => void;
  onEliminarTarea?: (id: string) => void;
  onEliminarExamen?: (id: string) => void;
  onEditarExamen?: (examen: Examen) => void;
}