// frontend/src/components/Materias/MateriaCard.tsx
import { useState } from "react";
import { Plus, Trash2, CheckCircle, Clock, Edit } from "lucide-react";

import type { Materia, Tarea, Examen, MateriaStats } from "../../types";
import { MateriaPromedio } from "./MateriaPromedio";
import { formatDateShort } from "../../utils/dateHelpers";
import styles from "./MateriaCard.module.css";
import appStyles from "../../App.module.css";

interface Props {
  materia: Materia;
  tareas: Tarea[];
  examenes: Examen[];
  materiaStats: MateriaStats;
  onActualizarProfesor: (id: string, profesor: string) => void;
  onEditarMateria: (materia: Materia) => void;
  onEliminarMateria: (id: string) => void;
  onAgregarTarea: (
    materiaId: string,
    titulo: string,
    fecha: string,
  ) => Promise<void>;
  onAgregarExamen: (
    materiaId: string,
    titulo: string,
    fecha: string,
    hora: string,
    aula: string,
  ) => Promise<void>;
  onCompletarTarea: (id: string) => void;
  onEliminarTarea: (id: string) => void;
  onEliminarExamen: (id: string) => void;
  onEditarExamen?: (examen: Examen) => void;
  onAbrirModalExamen?: (materiaId: string) => void; 
}

// ✨ Helper para obtener ID de materia desde examen
const getMateriaIdFromExamen = (examen: Examen): string => {
  return typeof examen.materiaId === 'string' 
    ? examen.materiaId 
    : examen.materiaId._id;
};

export const MateriaCard = ({
  materia,
  tareas,
  examenes,
  materiaStats,
  onActualizarProfesor,
  onEditarMateria,
  onEliminarMateria,
  onAgregarTarea,
  onCompletarTarea,
  onEliminarTarea,
  onEliminarExamen,
  onEditarExamen,
  onAbrirModalExamen,
}: Props) => {
  const [mostrarFormTarea, setMostrarFormTarea] = useState<boolean>(false);
  const [nuevaTarea, setNuevaTarea] = useState<string>("");
  const [fechaTarea, setFechaTarea] = useState<string>("");

  // ✨ Filtrar tareas pendientes de esta materia
  const tareasPendientes = tareas.filter(
    (t) => t.materiaId === materia._id && !t.completada,
  );
  
  // ✨ Filtrar exámenes de esta materia
  const examenesMateria = examenes.filter((e) => {
    const materiaId = getMateriaIdFromExamen(e);
    return materiaId === materia._id;
  });

  const handleAgregarTarea = async (): Promise<void> => {
    if (!nuevaTarea.trim() || !fechaTarea) return;
    await onAgregarTarea(materia._id, nuevaTarea.trim(), fechaTarea);
    setNuevaTarea("");
    setFechaTarea("");
    setMostrarFormTarea(false);
  };

  // ✨ Abrir modal para crear nuevo examen
  const handleAbrirModalExamen = (): void => {
    if (onAbrirModalExamen) {
      onAbrirModalExamen(materia._id);
    }
  };

  return (
    <div className={styles.materiaCard}>
      <div className={styles.materiaHeader}>
        <div className={styles.materiaTitle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '3px', 
                backgroundColor: materia.color || '#0e639c',
                display: 'inline-block'
              }} 
            />
            <h3>{materia.nombre}</h3>
          </div>
          <input
            type="text"
            placeholder="Nombre del profesor/a"
            value={materia.profesor || ""}
            onChange={(e) => onActualizarProfesor(materia._id, e.target.value)}
            className={styles.profesorInput}
          />
        </div>
        <div className={styles.materiaActions}>
          <button
            onClick={() => setMostrarFormTarea(!mostrarFormTarea)}
            className={`${appStyles.button} ${appStyles.buttonPrimary}`}
            title="Agregar tarea"
          >
            <Plus size={14} /> Tarea
          </button>
          <button
            onClick={handleAbrirModalExamen}
            className={`${appStyles.button} ${appStyles.buttonPrimary}`}
            title="Agregar parcial"
          >
            <Plus size={14} /> Parcial
          </button>
          <button
            onClick={() => onEditarMateria(materia)}
            className={`${appStyles.button} ${appStyles.buttonSecondary}`}
            title="Editar materia"
          >
            <Edit size={14} /> Editar
          </button>
          <button
            onClick={() => onEliminarMateria(materia._id)}
            className={`${appStyles.button} ${appStyles.buttonDanger}`}
            title="Eliminar materia"
          >
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </div>

      {/* ✨ Formulario para agregar tarea */}
      {mostrarFormTarea && (
        <div className={styles.tareaForm}>
          <div className={styles.tareaFormRow}>
            <input
              type="text"
              placeholder="Título de la tarea"
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              className={appStyles.input}
              autoFocus
            />
            <input
              type="date"
              value={fechaTarea}
              onChange={(e) => setFechaTarea(e.target.value)}
              className={appStyles.input}
            />
            <div className={styles.tareaFormButtons}>
              <button
                onClick={() => setMostrarFormTarea(false)}
                className={appStyles.buttonSecondary}
              >
                Cancelar
              </button>
              <button
                onClick={handleAgregarTarea}
                className={`${appStyles.button} ${appStyles.buttonSuccess}`}
                disabled={!nuevaTarea.trim() || !fechaTarea}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✨ Horarios */}
      {materia.horarios && materia.horarios.length > 0 && (
        <div className={styles.horariosSection}>
          <div className={styles.horariosHeader}>
            <Clock size={14} /> Horarios:
          </div>
          <div className={styles.horariosList}>
            {materia.horarios.map((horario, idx) => (
              <div key={`${horario.dia}-${horario.horaInicio}-${idx}`} className={styles.horarioItem}>
                <span className={styles.horarioDia}>{horario.dia}</span>
                <span className={styles.horarioHora}>
                  {horario.horaInicio} - {horario.horaFin}
                </span>
                {horario.aula && (
                  <span className={styles.horarioAula}>
                    Aula: {horario.aula}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✨ Componente de promedio */}
      <MateriaPromedio stats={materiaStats} materiaId={materia._id} />

      {/* ✨ Tareas pendientes */}
      <div>
        <h4 className={styles.tareasSubtitle}>📝 Tareas pendientes:</h4>
        {tareasPendientes.length === 0 ? (
          <div className={styles.emptyState}>No hay tareas pendientes ✨</div>
        ) : (
          <ul className={styles.tareaList}>
            {tareasPendientes.map((tarea) => (
              <li key={tarea._id} className={styles.tareaItem}>
                <div className={styles.tareaInfo}>
                  <span className={styles.tareaTitulo}>{tarea.titulo}</span>
                  <span className={styles.tareaFecha}>
                    📅 {formatDateShort(tarea.fechaEntrega)}
                  </span>
                </div>
                <div className={styles.tareaActions}>
                  <button
                    onClick={() => onCompletarTarea(tarea._id)}
                    className={appStyles.iconButton}
                    title="Completar tarea"
                    aria-label="Completar tarea"
                  >
                    <CheckCircle size={16} color="#10b981" />
                  </button>
                  <button
                    onClick={() => onEliminarTarea(tarea._id)}
                    className={appStyles.iconButton}
                    title="Eliminar tarea"
                    aria-label="Eliminar tarea"
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✨ Exámenes */}
      <div style={{ marginTop: '16px' }}>
        <h4 className={styles.tareasSubtitle}>📚 Parciales:</h4>
        {examenesMateria.length === 0 ? (
          <div className={styles.emptyState}>No hay parciales programados ✨</div>
        ) : (
          <ul className={styles.tareaList}>
            {examenesMateria.map((examen) => (
              <li key={examen._id} className={styles.tareaItem}>
                <div className={styles.tareaInfo}>
                  <span className={styles.tareaTitulo}>{examen.titulo}</span>
                  <span className={styles.tareaFecha}>
                    📅 {formatDateShort(examen.fecha)}
                    {examen.hora && ` - 🕐 ${examen.hora}`}
                    {examen.aula && ` - 📍 Aula ${examen.aula}`}
                    {examen.nota !== null && ` - ⭐ Nota: ${examen.nota}`}
                  </span>
                </div>
                <div className={styles.tareaActions}>
                  {onEditarExamen && (
                    <button
                      onClick={() => onEditarExamen(examen)}
                      className={appStyles.iconButton}
                      title="Editar examen"
                      aria-label="Editar examen"
                    >
                      <Edit size={16} color="#9cdcfe" />
                    </button>
                  )}
                  <button
                    onClick={() => onEliminarExamen(examen._id)}
                    className={appStyles.iconButton}
                    title="Eliminar examen"
                    aria-label="Eliminar examen"
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};