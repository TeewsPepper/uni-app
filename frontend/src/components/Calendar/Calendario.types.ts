// components/Calendario/Calendario.types.ts
import type { EventInput } from '@fullcalendar/core';


// Tipos específicos de FullCalendar para este componente
export interface ExtendedEventProps {
  tipo: 'tarea' | 'examen' | 'horario';
  id?: string;        // Para tareas y exámenes
  materiaId?: string; // Para horarios
}

export type CalendarioEvento = EventInput & {
  extendedProps?: ExtendedEventProps;
};



// Mapeo de días (específico del componente)
export type DiasMap = Record<string, number>;