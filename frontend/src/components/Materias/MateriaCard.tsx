import { useState } from "react";
import { Plus, Trash2, CheckCircle, Clock, Edit } from "lucide-react";

import type { Materia, Tarea, Examen, MateriaStats } from "../../types";
import { MateriaPromedio } from "./MateriaPromedio"; // ← Importar el componente
import styles from "./MateriaCard.module.css";
import appStyles from "../../App.module.css";

interface Props {
  materia: Materia;
  tareas: Tarea[];
  examenes: Examen[];
  materiaStats: MateriaStats; // Estadísticas de la materia
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
}

export const MateriaCard = ({
  materia,
  tareas,
  examenes,
  materiaStats, // ← Recibir las estadísticas
  onActualizarProfesor,
  onEditarMateria,
  onEliminarMateria,
  onAgregarTarea,
  onAgregarExamen,
  onCompletarTarea,
  onEliminarTarea,
  onEliminarExamen,
  onEditarExamen,
}: Props) => {
  const [mostrarFormTarea, setMostrarFormTarea] = useState(false);
  const [mostrarFormExamen, setMostrarFormExamen] = useState(false);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [fechaTarea, setFechaTarea] = useState("");
  const [nuevoExamen, setNuevoExamen] = useState("");
  const [fechaExamen, setFechaExamen] = useState("");
  const [horaExamen, setHoraExamen] = useState("");
  const [aulaExamen, setAulaExamen] = useState("");

  const tareasPendientes = tareas.filter(
    (t) => t.materiaId === materia._id && !t.completada,
  );
  
  const examenesMateria = examenes.filter(
    (e) => {
      const materiaId = typeof e.materiaId === 'string' ? e.materiaId : e.materiaId._id;
      return materiaId === materia._id;
    }
  );

  const handleAgregarTarea = async () => {
    if (!nuevaTarea.trim() || !fechaTarea) return;
    await onAgregarTarea(materia._id, nuevaTarea, fechaTarea);
    setNuevaTarea("");
    setFechaTarea("");
    setMostrarFormTarea(false);
  };

  const handleAgregarExamenSubmit = async () => {
    if (!nuevoExamen.trim() || !fechaExamen) return;
    await onAgregarExamen(materia._id, nuevoExamen, fechaExamen, horaExamen, aulaExamen);
    setNuevoExamen("");
    setFechaExamen("");
    setHoraExamen("");
    setAulaExamen("");
    setMostrarFormExamen(false);
  };

  return (
    <div 
      className={styles.materiaCard} 
      style={{ 
        borderTop: `4px solid ${materia.color || '#0e639c'}`,
      }}
    >
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
          >
            <Plus size={14} /> Tarea
          </button>
          <button
            onClick={() => setMostrarFormExamen(!mostrarFormExamen)}
            className={`${appStyles.button} ${appStyles.buttonPrimary}`}
          >
            <Plus size={14} /> Examen
          </button>
          <button
            onClick={() => onEliminarMateria(materia._id)}
            className={`${appStyles.button} ${appStyles.buttonDanger}`}
          >
            <Trash2 size={14} /> Eliminar
          </button>
          <button
            onClick={() => onEditarMateria(materia)}
            className={`${appStyles.button} ${appStyles.buttonSecondary}`}
          >
            <Edit size={14} /> Editar
          </button>
        </div>
      </div>

      {/* Formulario para agregar tarea */}
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
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario para agregar examen */}
      {mostrarFormExamen && (
        <div className={styles.tareaForm}>
          <div className={styles.tareaFormRow}>
            <input
              type="text"
              placeholder="Título del examen"
              value={nuevoExamen}
              onChange={(e) => setNuevoExamen(e.target.value)}
              className={appStyles.input}
              autoFocus
            />
            <input
              type="date"
              value={fechaExamen}
              onChange={(e) => setFechaExamen(e.target.value)}
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
            <div className={styles.tareaFormButtons}>
              <button
                onClick={() => setMostrarFormExamen(false)}
                className={appStyles.buttonSecondary}
              >
                Cancelar
              </button>
              <button
                onClick={handleAgregarExamenSubmit}
                className={`${appStyles.button} ${appStyles.buttonSuccess}`}
              >
                Guardar Examen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Horarios */}
      {materia.horarios && materia.horarios.length > 0 && (
        <div className={styles.horariosSection}>
          <div className={styles.horariosHeader}>
            <Clock size={14} /> Horarios de cursada
          </div>
          <div className={styles.horariosList}>
            {materia.horarios.map((horario, idx) => (
              <div key={idx} className={styles.horarioItem}>
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

      {/* ========== COMPONENTE DE PROMEDIO ========== */}
      <MateriaPromedio stats={materiaStats} materiaId={materia._id} />
      {/* ========== FIN COMPONENTE PROMEDIO ========== */}

      {/* Tareas pendientes */}
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
                    📅{" "}
                    {new Date(tarea.fechaEntrega).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className={styles.tareaActions}>
                  <button
                    onClick={() => onCompletarTarea(tarea._id)}
                    className={appStyles.iconButton}
                    title="Completar"
                  >
                    <CheckCircle size={16} color="#10b981" />
                  </button>
                  <button
                    onClick={() => onEliminarTarea(tarea._id)}
                    className={appStyles.iconButton}
                    title="Eliminar"
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Exámenes */}
      <div style={{ marginTop: '16px' }}>
        <h4 className={styles.tareasSubtitle}>📚 Exámenes:</h4>
        {examenesMateria.length === 0 ? (
          <div className={styles.emptyState}>No hay exámenes programados ✨</div>
        ) : (
          <ul className={styles.tareaList}>
            {examenesMateria.map((examen) => (
              <li key={examen._id} className={styles.tareaItem}>
                <div className={styles.tareaInfo}>
                  <span className={styles.tareaTitulo}>{examen.titulo}</span>
                  <span className={styles.tareaFecha}>
                    📅{" "}
                    {new Date(examen.fecha).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
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
                      title="Editar"
                    >
                      <Edit size={16} color="#9cdcfe" />
                    </button>
                  )}
                  <button
                    onClick={() => onEliminarExamen(examen._id)}
                    className={appStyles.iconButton}
                    title="Eliminar"
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