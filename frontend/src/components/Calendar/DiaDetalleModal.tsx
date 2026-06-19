// components/Calendar/DiaDetalleModal.tsx
import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Edit, X } from 'lucide-react';
import type { Tarea, Examen, Materia } from '../../types';

// ✨ Importar tipos locales
import type { 
  EventoDelDia, 
  EventoTarea, 
  EventoExamen, 
  EventoHorario,
  DiasMap 
} from './DiaDetalleModal.types';

import appStyles from '../../App.module.css';
import styles from './DiaDetalleModal.module.css';

interface Props {
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

// ✨ Mapeo de días con tipo estricto
const diasMap: DiasMap = {
  'Domingo': 0,
  'Lunes': 1,
  'Martes': 2,
  'Miércoles': 3,
  'Jueves': 4,
  'Viernes': 5,
  'Sábado': 6
};

// Función para normalizar fecha a YYYY-MM-DD sin zona horaria
const normalizarFecha = (fecha: Date | string): string => {
  const d = new Date(fecha);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ✨ Type guard para verificar si materiaId es objeto poblado
const isMateriaPoblada = (
  materia: string | { _id: string; nombre: string; color?: string }
): materia is { _id: string; nombre: string; color?: string } => {
  return typeof materia !== 'string' && 'nombre' in materia;
};

// ✨ Type guards para EventoDelDia
const esEventoExamen = (evento: EventoDelDia): evento is EventoExamen => {
  return evento.type === 'examen';
};

const esEventoHorario = (evento: EventoDelDia): evento is EventoHorario => {
  return evento.type === 'horario';
};

const esEventoTarea = (evento: EventoDelDia): evento is EventoTarea => {
  return evento.type === 'tarea';
};

export const DiaDetalleModal = ({ 
  visible, 
  fecha, 
  tareas, 
  examenes, 
  materias, 
  onClose,
  onAgregarTarea,
  onAgregarExamen,
  onCompletarTarea,
  onEliminarTarea,
  onEliminarExamen,
  onEditarExamen
}: Props) => {
  const [eventosDelDia, setEventosDelDia] = useState<EventoDelDia[]>([]);
  const [mostrarFormTarea, setMostrarFormTarea] = useState(false);
  const [mostrarFormExamen, setMostrarFormExamen] = useState(false);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [materiaTarea, setMateriaTarea] = useState('');
  const [nuevoExamen, setNuevoExamen] = useState('');
  const [materiaExamen, setMateriaExamen] = useState('');
  const [horaExamen, setHoraExamen] = useState('');
  const [aulaExamen, setAulaExamen] = useState('');

  useEffect(() => {
    if (fecha && visible) {
      const eventos: EventoDelDia[] = [];

      // Tareas del día
      tareas.forEach(tarea => {
        const tareaFecha = normalizarFecha(tarea.fechaEntrega);
        if (tareaFecha === fecha && !tarea.completada) {
          const materia = materias.find(m => m._id === tarea.materiaId);
          const eventoTarea: EventoTarea = {
            type: 'tarea',
            id: tarea._id,
            titulo: tarea.titulo,
            materiaNombre: materia?.nombre || 'Sin materia',
            materiaId: tarea.materiaId,
            completada: tarea.completada
          };
          eventos.push(eventoTarea);
        }
      });

      // Exámenes del día
      examenes.forEach(examen => {
        const examenFecha = normalizarFecha(examen.fecha);
        if (examenFecha === fecha) {
          let materiaNombre = '';
          let materiaId = '';
          
          if (isMateriaPoblada(examen.materiaId)) {
            materiaNombre = examen.materiaId.nombre;
            materiaId = examen.materiaId._id;
          } else if (typeof examen.materiaId === 'string') {
            const materia = materias.find(m => m._id === examen.materiaId);
            if (materia) {
              materiaNombre = materia.nombre;
              materiaId = materia._id;
            }
          }
          
          const eventoExamen: EventoExamen = {
            type: 'examen',
            id: examen._id,
            titulo: examen.titulo,
            materiaNombre,
            materiaId,
            hora: examen.hora,
            aula: examen.aula,
            contenido: examen.contenido,
            nota: examen.nota
          };
          eventos.push(eventoExamen);
        }
      });

      // Horarios del día
      const [year, month, day] = fecha.split('-');
      const fechaDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const diaSemanaNum = fechaDate.getDay();
      
      materias.forEach(materia => {
        if (materia.horarios && materia.horarios.length > 0) {
          materia.horarios.forEach(horario => {
            const diaSemana = diasMap[horario.dia];
            if (diaSemana === diaSemanaNum) {
              const eventoHorario: EventoHorario = {
                type: 'horario',
                titulo: materia.nombre,
                materiaNombre: materia.nombre,
                horaInicio: horario.horaInicio,
                horaFin: horario.horaFin,
                aula: horario.aula,
                color: materia.color
              };
              eventos.push(eventoHorario);
            }
          });
        }
      });

      // Ordenar eventos por hora
      eventos.sort((a, b) => {
        const getHora = (evento: EventoDelDia): string => {
          if (esEventoExamen(evento)) return evento.hora;
          if (esEventoHorario(evento)) return evento.horaInicio;
          return '00:00';
        };
        
        const horaA = getHora(a);
        const horaB = getHora(b);
        return horaA.localeCompare(horaB);
      });

      setEventosDelDia(eventos);
    }
  }, [fecha, visible, tareas, examenes, materias]);

  const handleAgregarTareaSubmit = async () => {
    if (nuevaTarea.trim() && materiaTarea) {
      await onAgregarTarea?.(materiaTarea, nuevaTarea, fecha);
      setNuevaTarea('');
      setMateriaTarea('');
      setMostrarFormTarea(false);
    }
  };

  const handleAgregarExamenSubmit = async () => {
    if (nuevoExamen.trim() && materiaExamen) {
      await onAgregarExamen?.(materiaExamen, nuevoExamen, fecha, horaExamen, aulaExamen);
      setNuevoExamen('');
      setMateriaExamen('');
      setHoraExamen('');
      setAulaExamen('');
      setMostrarFormExamen(false);
    }
  };

  if (!visible) return null;

  // Formatear fecha para mostrar
  const [year, month, day] = fecha.split('-');
  const fechaObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // ✨ Función auxiliar para renderizar según tipo de evento (con type narrowing)
  const renderizarEvento = (evento: EventoDelDia, idx: number) => {
    const getIcon = () => {
      if (esEventoTarea(evento)) return '📝';
      if (esEventoExamen(evento)) return '📚';
      return '🏫';
    };

    const getHoraDisplay = () => {
      if (esEventoExamen(evento)) return `🕐 ${evento.hora}`;
      if (esEventoHorario(evento)) return `🕐 ${evento.horaInicio} - ${evento.horaFin}`;
      return null;
    };

    // ✅ Type narrowing seguro para 'aula'
    const getAula = (): string | null => {
      if (esEventoExamen(evento)) return evento.aula;
      if (esEventoHorario(evento)) return evento.aula;
      return null; // Las tareas no tienen aula
    };

    const aula = getAula();

    return (
      <div key={idx} className={`${styles.eventoCard} ${styles[evento.type]}`}>
        <div className={styles.eventoHeader}>
          <span className={styles.eventoIcon}>{getIcon()}</span>
          <span className={styles.eventoTitulo}>{evento.titulo}</span>
          <span className={styles.eventoMateria}>{evento.materiaNombre}</span>
        </div>
        
        {getHoraDisplay() && (
          <div className={styles.eventoHora}>{getHoraDisplay()}</div>
        )}
        
        {/* ✅ Ahora 'aula' es seguro porque usamos getAula() */}
        {aula && (
          <div className={styles.eventoAula}>📍 Aula: {aula}</div>
        )}
        
        {esEventoExamen(evento) && evento.nota !== null && (
          <div className={styles.eventoNota}>⭐ Nota: {evento.nota}</div>
        )}
        
        {!esEventoHorario(evento) && (
          <div className={styles.eventoActions}>
            {esEventoTarea(evento) && onCompletarTarea && (
              <button 
                onClick={() => onCompletarTarea(evento.id)}
                className={styles.actionBtn}
                title="Completar"
              >
                <CheckCircle size={14} />
              </button>
            )}
            {esEventoExamen(evento) && onEditarExamen && (
              <button 
                onClick={() => {
                  const examen = examenes.find(e => e._id === evento.id);
                  if (examen) onEditarExamen(examen);
                  onClose();
                }}
                className={styles.actionBtn}
                title="Editar"
              >
                <Edit size={14} />
              </button>
            )}
            <button 
              onClick={() => {
                if (esEventoTarea(evento) && onEliminarTarea) {
                  onEliminarTarea(evento.id);
                } else if (esEventoExamen(evento) && onEliminarExamen) {
                  onEliminarExamen(evento.id);
                }
              }}
              className={styles.actionBtn}
              title="Eliminar"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={appStyles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>📅 {fechaFormateada}</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.eventosContainer}>
          {eventosDelDia.length === 0 ? (
            <div className={styles.sinEventos}>No hay actividades programadas</div>
          ) : (
            eventosDelDia.map((evento, idx) => renderizarEvento(evento, idx))
          )}
        </div>

        <div className={styles.agregarSection}>
          <button 
            onClick={() => setMostrarFormTarea(!mostrarFormTarea)}
            className={`${appStyles.button} ${appStyles.buttonPrimary}`}
          >
            <Plus size={14} /> Agregar Tarea
          </button>
          <button 
            onClick={() => setMostrarFormExamen(!mostrarFormExamen)}
            className={`${appStyles.button} ${appStyles.buttonPrimary}`}
          >
            <Plus size={14} /> Agregar Examen
          </button>
        </div>

        {mostrarFormTarea && (
          <div className={styles.formulario}>
            <select 
              value={materiaTarea} 
              onChange={(e) => setMateriaTarea(e.target.value)}
              className={appStyles.select}
            >
              <option value="">Seleccionar materia</option>
              {materias.map(m => (
                <option key={m._id} value={m._id}>{m.nombre}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Título de la tarea"
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              className={appStyles.input}
            />
            <div className={styles.formButtons}>
              <button onClick={handleAgregarTareaSubmit} className={appStyles.buttonSuccess}>Guardar</button>
              <button onClick={() => setMostrarFormTarea(false)} className={appStyles.buttonSecondary}>Cancelar</button>
            </div>
          </div>
        )}

        {mostrarFormExamen && (
          <div className={styles.formulario}>
            <select 
              value={materiaExamen} 
              onChange={(e) => setMateriaExamen(e.target.value)}
              className={appStyles.select}
            >
              <option value="">Seleccionar materia</option>
              {materias.map(m => (
                <option key={m._id} value={m._id}>{m.nombre}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Título del examen"
              value={nuevoExamen}
              onChange={(e) => setNuevoExamen(e.target.value)}
              className={appStyles.input}
            />
            <input
              type="time"
              value={horaExamen}
              onChange={(e) => setHoraExamen(e.target.value)}
              className={appStyles.input}
              placeholder="Hora"
            />
            <input
              type="text"
              placeholder="Aula"
              value={aulaExamen}
              onChange={(e) => setAulaExamen(e.target.value)}
              className={appStyles.input}
            />
            <div className={styles.formButtons}>
              <button onClick={handleAgregarExamenSubmit} className={appStyles.buttonSuccess}>Guardar</button>
              <button onClick={() => setMostrarFormExamen(false)} className={appStyles.buttonSecondary}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};