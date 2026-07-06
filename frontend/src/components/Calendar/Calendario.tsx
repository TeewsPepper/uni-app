// components/Calendario/Calendario.tsx
import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateClickArg} from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';
import { ChevronDown, ChevronUp } from 'lucide-react';

import type { 
  CalendarioEvento, 
  ExtendedEventProps,
  DiasMap 
} from './Calendario.types';

import type { Tarea, Examen, Materia } from '../../types';

import styles from './Calendario.module.css';

interface Props {
  tareas: Tarea[];
  examenes: Examen[];
  materias: Materia[];
  onFechaClick: (fecha: string) => void;
}

// ✨ Helper para obtener el color de una materia por ID
const getColorMateria = (materiaId: string, materias: Materia[]): string => {
  const materia = materias.find(m => m._id === materiaId);
  return materia?.color || '#0e639c'; // Fallback al color por defecto
};

export const Calendario = ({ tareas, examenes, materias, onFechaClick }: Props) => {
  const [visible, setVisible] = useState<boolean>(false);

  const diasMap: DiasMap = {
    'Domingo': 0,
    'Lunes': 1,
    'Martes': 2,
    'Miércoles': 3,
    'Jueves': 4,
    'Viernes': 5,
    'Sábado': 6
  };

  // ✅ Eventos de tareas - AHORA con color de la materia
  const eventosTareas: CalendarioEvento[] = tareas
    .filter(t => !t.completada)
    .map(tarea => {
      const color = getColorMateria(tarea.materiaId, materias);
      return {
        title: `📝 ${tarea.titulo}`,
        start: tarea.fechaEntrega.split('T')[0],
        backgroundColor: color,
        borderColor: color,
        textColor: 'white',
        extendedProps: { 
          tipo: 'tarea', 
          id: tarea._id 
        } as ExtendedEventProps
      };
    });

  // ✅ Eventos de exámenes - ya tienen su propio color o el de la materia
  const eventosExamenes: CalendarioEvento[] = examenes.map(examen => {
    // Obtener color de la materia si está poblada, o buscar por ID
    let color = '#ce9178'; // Color por defecto para exámenes
    
    if (typeof examen.materiaId === 'object' && examen.materiaId?.color) {
      color = examen.materiaId.color;
    } else if (typeof examen.materiaId === 'string') {
      const materia = materias.find(m => m._id === examen.materiaId);
      if (materia?.color) {
        color = materia.color;
      }
    }
    
    return {
      title: `📚 ${examen.titulo}`,
      start: typeof examen.fecha === 'string' 
        ? examen.fecha.split('T')[0]
        : new Date(examen.fecha).toISOString().split('T')[0],
      backgroundColor: color,
      borderColor: color,
      textColor: 'white',
      extendedProps: { 
        tipo: 'examen', 
        id: examen._id 
      } as ExtendedEventProps
    };
  });

  // ✅ Eventos de horarios - ya usan el color de la materia correctamente
  const eventosHorarios: CalendarioEvento[] = [];

  materias.forEach(materia => {
    if (materia.horarios && materia.horarios.length > 0) {
      materia.horarios.forEach(horario => {
        const diaSemana = diasMap[horario.dia];
        if (diaSemana !== undefined) {
          eventosHorarios.push({
            title: `🏫 ${materia.nombre}`,
            daysOfWeek: [diaSemana],
            startTime: horario.horaInicio,
            endTime: horario.horaFin,
            backgroundColor: materia.color || '#6a9955',
            borderColor: materia.color || '#6a9955',
            textColor: 'white',
            display: 'block',
            extendedProps: { 
              tipo: 'horario', 
              materiaId: materia._id 
            } as ExtendedEventProps
          });
        }
      });
    }
  });

  const handleDateClick = (clickInfo: DateClickArg): void => {
    console.log("Click en fecha:", clickInfo.dateStr);
    onFechaClick(clickInfo.dateStr);
  };

  const handleEventClick = (clickInfo: EventClickArg): void => {
    const fecha = clickInfo.event.startStr?.split('T')[0];
    if (fecha) {
      onFechaClick(fecha);
    }
  };

  return (
    <div className={styles.calendarioWrapper}>
      <button 
        className={styles.toggleButton} 
        onClick={() => setVisible(!visible)}
      >
        📅 Calendario completo {visible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {visible && (
        <div className={styles.calendarioContainer}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="es"
            timeZone="local"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
            events={[...eventosTareas, ...eventosExamenes, ...eventosHorarios]}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana'
            }}
            eventDisplay="block"
          />
        </div>
      )}
    </div>
  );
};