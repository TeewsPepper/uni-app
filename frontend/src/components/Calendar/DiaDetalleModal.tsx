import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Edit, X } from 'lucide-react';
import type { Tarea, Examen, Materia } from '../../types';
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

const diasMap: { [key: string]: number } = {
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
  const [eventosDelDia, setEventosDelDia] = useState<any[]>([]);
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
      const eventos: any[] = [];

      // Tareas del día - comparar strings YYYY-MM-DD directamente
      tareas.forEach(tarea => {
        const tareaFecha = normalizarFecha(tarea.fechaEntrega);
        if (tareaFecha === fecha && !tarea.completada) {
          const materia = materias.find(m => m._id === tarea.materiaId);
          eventos.push({
            type: 'tarea',
            id: tarea._id,
            titulo: tarea.titulo,
            materiaNombre: materia?.nombre || 'Sin materia',
            materiaId: tarea.materiaId,
            completada: tarea.completada
          });
        }
      });

      // Exámenes del día - comparar strings YYYY-MM-DD directamente
      examenes.forEach(examen => {
        const examenFecha = normalizarFecha(examen.fecha);
        if (examenFecha === fecha) {
          let materiaNombre = '';
          let materiaId = '';
          if (examen.materiaId && typeof examen.materiaId === 'object' && 'nombre' in examen.materiaId) {
            materiaNombre = examen.materiaId.nombre;
            materiaId = examen.materiaId._id;
          } else if (typeof examen.materiaId === 'string') {
            const materia = materias.find(m => m._id === examen.materiaId);
            if (materia) {
              materiaNombre = materia.nombre;
              materiaId = materia._id;
            }
          }
          eventos.push({
            type: 'examen',
            id: examen._id,
            titulo: examen.titulo,
            materiaNombre,
            materiaId,
            hora: examen.hora,
            aula: examen.aula,
            contenido: examen.contenido,
            nota: examen.nota
          });
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
              eventos.push({
                type: 'horario',
                titulo: materia.nombre,
                materiaNombre: materia.nombre,
                horaInicio: horario.horaInicio,
                horaFin: horario.horaFin,
                aula: horario.aula,
                color: materia.color
              });
            }
          });
        }
      });

      // Ordenar eventos por hora
      eventos.sort((a, b) => {
        const horaA = a.hora || a.horaInicio || '00:00';
        const horaB = b.hora || b.horaInicio || '00:00';
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
            eventosDelDia.map((evento, idx) => (
              <div key={idx} className={`${styles.eventoCard} ${styles[evento.type]}`}>
                <div className={styles.eventoHeader}>
                  <span className={styles.eventoIcon}>
                    {evento.type === 'tarea' && '📝'}
                    {evento.type === 'examen' && '📚'}
                    {evento.type === 'horario' && '🏫'}
                  </span>
                  <span className={styles.eventoTitulo}>{evento.titulo}</span>
                  <span className={styles.eventoMateria}>{evento.materiaNombre}</span>
                </div>
                
                {(evento.hora || evento.horaInicio) && (
                  <div className={styles.eventoHora}>
                    🕐 {evento.hora || `${evento.horaInicio} - ${evento.horaFin}`}
                  </div>
                )}
                
                {evento.aula && (
                  <div className={styles.eventoAula}>📍 Aula: {evento.aula}</div>
                )}
                
                {evento.type === 'examen' && evento.nota !== null && (
                  <div className={styles.eventoNota}>⭐ Nota: {evento.nota}</div>
                )}
                
                {evento.type !== 'horario' && (
                  <div className={styles.eventoActions}>
                    {evento.type === 'tarea' && onCompletarTarea && (
                      <button 
                        onClick={() => onCompletarTarea(evento.id)}
                        className={styles.actionBtn}
                        title="Completar"
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                    {evento.type === 'examen' && onEditarExamen && (
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
                        if (evento.type === 'tarea' && onEliminarTarea) {
                          onEliminarTarea(evento.id);
                        } else if (evento.type === 'examen' && onEliminarExamen) {
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
            ))
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