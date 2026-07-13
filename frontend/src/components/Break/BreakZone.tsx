import React, { useState } from 'react';
import { useBreak } from '../../hooks/useBreak';
import { BreakActivity, BreakActivityType, CreateBreakActivityDTO, BREAK_TIPO_CONFIG, BreakFilters } from '../../types';
import { formatDateLong } from '../../utils/dateHelpers';
import styles from './BreakZone.module.css';

interface FilterState {
  tipo: BreakActivityType | '';
  temaRelacionado: string;
}

interface FormState extends CreateBreakActivityDTO {}

const BreakZone: React.FC = () => {
  const { 
    actividades, 
    loading, 
    error, 
    fetchActividades, 
    crearActividad, 
    editarActividad, 
    eliminarActividad, 
    unirseActividad, 
    salirActividad 
  } = useBreak();

  const [filters, setFilters] = useState<FilterState>({
    tipo: '',
    temaRelacionado: '',
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingActivity, setEditingActivity] = useState<BreakActivity | null>(null);
  const [formData, setFormData] = useState<FormState>({
    titulo: '',
    descripcion: '',
    tipo: 'social',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    ubicacion: '',
    maxParticipantes: undefined,
    temaRelacionado: '',
  });

  const handleFilterChange = (key: keyof FilterState, value: string): void => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const filterParams: BreakFilters = {};
    if (newFilters.tipo) filterParams.tipo = newFilters.tipo as BreakActivityType;
    if (newFilters.temaRelacionado) filterParams.temaRelacionado = newFilters.temaRelacionado;
    
    fetchActividades(filterParams);
  };

  const handleOpenModal = (activity?: BreakActivity): void => {
    if (activity) {
      setEditingActivity(activity);
      const fechaStr = activity.fecha ? activity.fecha.split('T')[0] : '';
      setFormData({
        titulo: activity.titulo,
        descripcion: activity.descripcion,
        tipo: activity.tipo,
        fecha: fechaStr,
        horaInicio: activity.horaInicio,
        horaFin: activity.horaFin,
        ubicacion: activity.ubicacion,
        maxParticipantes: activity.maxParticipantes,
        temaRelacionado: activity.temaRelacionado || '',
      });
    } else {
      setEditingActivity(null);
      setFormData({
        titulo: '',
        descripcion: '',
        tipo: 'social',
        fecha: '',
        horaInicio: '',
        horaFin: '',
        ubicacion: '',
        maxParticipantes: undefined,
        temaRelacionado: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    setEditingActivity(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? Number(value) : undefined) : value,
    }));
  };

  // ✅ Validación de fecha SIN validación de hora (igual que tareas y exámenes)
  const validateForm = (): boolean => {
    if (!formData.fecha) {
      alert('Por favor selecciona una fecha');
      return false;
    }
    
    // ✅ Crear fecha usando componentes locales (evita problemas de zona horaria)
    const [year, month, day] = formData.fecha.split('-').map(Number);
    const fechaSeleccionadaNormalizada = new Date(year, month - 1, day, 0, 0, 0, 0);
    
    const hoy = new Date();
    const hoyNormalizado = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      0, 0, 0, 0
    );
    
    if (fechaSeleccionadaNormalizada < hoyNormalizado) {
      alert('No se pueden programar actividades en fechas pasadas');
      return false;
    }

    if (formData.horaInicio >= formData.horaFin) {
      alert('La hora de inicio debe ser anterior a la hora de fin');
      return false;
    }

    return true;
  };

  const formatFechaString = (fechaStr: string): string => {
    if (typeof fechaStr === 'string' && fechaStr.includes('-')) {
      const [year, month, day] = fechaStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return formatDateLong(fechaStr);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const datosParaEnviar = {
        ...formData,
        fecha: formData.fecha,
      };
      
      if (editingActivity) {
        await editarActividad(editingActivity._id, datosParaEnviar);
      } else {
        await crearActividad(datosParaEnviar);
      }
      handleCloseModal();
      await fetchActividades();
    } catch (err) {
      console.error('Error al guardar actividad:', err);
      alert(err instanceof Error ? err.message : 'Error al guardar la actividad');
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
      try {
        await eliminarActividad(id);
      } catch (err) {
        console.error('Error al eliminar actividad:', err);
        alert(err instanceof Error ? err.message : 'Error al eliminar la actividad');
      }
    }
  };

  const handleJoin = async (id: string): Promise<void> => {
    try {
      await unirseActividad(id);
    } catch (err) {
      console.error('Error al unirse:', err);
      alert(err instanceof Error ? err.message : 'Error al unirse a la actividad');
    }
  };

  const handleLeave = async (id: string): Promise<void> => {
    try {
      await salirActividad(id);
    } catch (err) {
      console.error('Error al salir:', err);
      alert(err instanceof Error ? err.message : 'Error al salir de la actividad');
    }
  };

  const getInitials = (id: string): string => {
    return id.substring(0, 2).toUpperCase();
  };

  if (loading && actividades.length === 0) {
    return <div className={styles.breakZone}>Cargando actividades...</div>;
  }

  return (
    <div className={styles.breakZone}>
      <div className={styles.header}>
        <h1 className={styles.title}>🎯 Break Zone</h1>
        <div className={styles.actions}>
          <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={() => handleOpenModal()}>
            + Nueva Actividad
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Tipo</label>
          <select
            className={styles.filterSelect}
            value={filters.tipo}
            onChange={(e) => handleFilterChange('tipo', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="social">Social</option>
            <option value="cultural">Cultural</option>
            <option value="deportivo">Deportivo</option>
            <option value="descanso">Descanso</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Tema Relacionado</label>
          <input
            className={styles.filterInput}
            type="text"
            placeholder="Buscar por tema..."
            value={filters.temaRelacionado}
            onChange={(e) => handleFilterChange('temaRelacionado', e.target.value)}
          />
        </div>
      </div>

      {error && <div className={styles.errorMessage}>❌ {error}</div>}

      <div className={styles.actividadesGrid}>
        {actividades.map((actividad) => {
          const tipoConfig = BREAK_TIPO_CONFIG[actividad.tipo];
          const participantes = actividad.participantes || [];

          return (
            <div key={actividad._id} className={styles.actividadCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{actividad.titulo}</h3>
                <span className={`${styles.tipoBadge} ${styles[`tipo${tipoConfig.label}`]}`}>
                  {tipoConfig.icon} {tipoConfig.label}
                </span>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.cardDescription}>{actividad.descripcion}</p>

                {actividad.temaRelacionado && (
                  <div className={styles.temaBadge}>📚 {actividad.temaRelacionado}</div>
                )}

                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaIcon}>📅</span>
                    {formatFechaString(actividad.fecha)}
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaIcon}>🕐</span>
                    {actividad.horaInicio} - {actividad.horaFin}
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaIcon}>📍</span>
                    {actividad.ubicacion}
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaIcon}>👤</span>
                    {actividad.esCreador ? 'Tú (creador)' : 'Creado por otro usuario'}
                  </div>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.participants}>
                  <div className={styles.participantAvatars}>
                    {participantes.slice(0, 3).map((pId: string) => (
                      <div key={pId} className={styles.participantAvatar}>
                        {getInitials(pId)}
                      </div>
                    ))}
                    {participantes.length > 3 && (
                      <div className={styles.participantAvatar}>+{participantes.length - 3}</div>
                    )}
                  </div>
                  <div className={styles.participantCount}>
                    {participantes.length} participante{participantes.length !== 1 ? 's' : ''}
                    {actividad.maxParticipantes && ` / ${actividad.maxParticipantes}`}
                  </div>
                </div>

                <div className={styles.cardActions}>
                  {actividad.esCreador ? (
                    <>
                      <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => handleOpenModal(actividad)}>
                        ✏️ Editar
                      </button>
                      <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(actividad._id)}>
                        🗑️ Eliminar
                      </button>
                    </>
                  ) : actividad.estaParticipando ? (
                    <button className={`${styles.actionButton} ${styles.leaveButton}`} onClick={() => handleLeave(actividad._id)}>
                      Salir
                    </button>
                  ) : actividad.cuposDisponibles === 0 ? (
                    <button className={`${styles.actionButton} ${styles.fullButton}`}>
                      Completos
                    </button>
                  ) : (
                    <button className={`${styles.actionButton} ${styles.joinButton}`} onClick={() => handleJoin(actividad._id)}>
                      Unirse
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {actividades.length === 0 && !loading && !error && (
        <div className={styles.emptyState}>
          <p>No hay actividades. ¡Crea la primera!</p>
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {editingActivity ? 'Editar Actividad' : 'Nueva Actividad'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Título *</label>
                <input
                  className={styles.formInput}
                  type="text"
                  name="titulo"
                  required
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Ej: Café con compañeros"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Descripción *</label>
                <textarea
                  className={`${styles.formInput} ${styles.formTextarea}`}
                  name="descripcion"
                  required
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Describe la actividad..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tipo *</label>
                <select className={styles.formInput} name="tipo" required value={formData.tipo} onChange={handleInputChange}>
                  <option value="social">👥 Social</option>
                  <option value="cultural">🎭 Cultural</option>
                  <option value="deportivo">⚽ Deportivo</option>
                  <option value="descanso">😌 Descanso</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Fecha *</label>
                <input
                  className={styles.formInput}
                  type="date"
                  name="fecha"
                  required
                  value={formData.fecha}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Hora de Inicio *</label>
                <input
                  className={styles.formInput}
                  type="time"
                  name="horaInicio"
                  required
                  value={formData.horaInicio}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Hora de Fin *</label>
                <input
                  className={styles.formInput}
                  type="time"
                  name="horaFin"
                  required
                  value={formData.horaFin}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ubicación *</label>
                <input
                  className={styles.formInput}
                  type="text"
                  name="ubicacion"
                  required
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  placeholder="Ej: Biblioteca, Café, etc."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tema Relacionado</label>
                <input
                  className={styles.formInput}
                  type="text"
                  name="temaRelacionado"
                  value={formData.temaRelacionado || ''}
                  onChange={handleInputChange}
                  placeholder="Ej: Psicoanálisis, Física cuántica..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Máximo de Participantes</label>
                <input
                  className={styles.formInput}
                  type="number"
                  name="maxParticipantes"
                  min="1"
                  max="100"
                  value={formData.maxParticipantes || ''}
                  onChange={handleInputChange}
                  placeholder="Dejar vacío para ilimitado"
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={`${styles.modalButton} ${styles.modalButtonSecondary}`} onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className={`${styles.modalButton} ${styles.modalButtonPrimary}`}>
                  {editingActivity ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakZone;