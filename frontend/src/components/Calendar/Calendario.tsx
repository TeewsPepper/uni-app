import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Tarea, Examen, Materia } from '../../types';

import styles from './Calendario.module.css';

interface Props {
  tareas: Tarea[];
  examenes: Examen[];
  materias: Materia[];
  onFechaClick: (fecha: string) => void;  // ← Cambiar: recibir la función del padre
}

export const Calendario = ({ tareas, examenes, materias, onFechaClick }: Props) => {
  const [visible, setVisible] = useState(false);

  // Eventos de tareas
  const eventosTareas = tareas
    .filter(t => !t.completada)
    .map(tarea => ({
      title: `📝 ${tarea.titulo}`,
      start: tarea.fechaEntrega.split('T')[0],
      backgroundColor: '#0e639c',
      borderColor: '#0e639c',
      textColor: 'white',
      extendedProps: { tipo: 'tarea', id: tarea._id }
    }));

  // Eventos de exámenes
  const eventosExamenes = examenes.map(examen => ({
    title: `📚 ${examen.titulo}`,
    start: new Date(examen.fecha).toISOString().split('T')[0],
    backgroundColor: '#ce9178',
    borderColor: '#ce9178',
    textColor: 'white',
    extendedProps: { tipo: 'examen', id: examen._id }
  }));

  // Eventos de horarios
  const eventosHorarios: any[] = [];
  const diasMap: { [key: string]: number } = {
    'Domingo': 0,
    'Lunes': 1,
    'Martes': 2,
    'Miércoles': 3,
    'Jueves': 4,
    'Viernes': 5,
    'Sábado': 6
  };

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
            extendedProps: { tipo: 'horario', materiaId: materia._id }
          });
        }
      });
    }
  });

  const handleDateClick = (info: any) => {
    onFechaClick(info.dateStr);  // ← Llamar a la función del padre
  };

  return (
    <div className={styles.calendarioWrapper}>
      <button className={styles.toggleButton} onClick={() => setVisible(!visible)}>
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