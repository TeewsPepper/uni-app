
import { useState, useEffect } from 'react';
import type { Materia, Examen } from '../../types';
import type { FormDataExamen, DatosExamen } from '../../utils/examenHelpers';
import { 
  examenToFormData, 
  formDataToDatosExamen, 
  formatearFechaDMY 
} from '../../utils/examenHelpers';
import styles from './ExamenModal.module.css';
import appStyles from '../../App.module.css';

interface Props {
  visible: boolean;
  fecha: string;
  materias: Materia[];
  examen?: Examen | null;
  onClose: () => void;
  onGuardar: (datos: DatosExamen) => Promise<void>;
}

export const ExamenModal = ({ visible, fecha, materias, examen, onClose, onGuardar }: Props) => {
  const [formData, setFormData] = useState<FormDataExamen>({
    titulo: '',
    materiaId: '',
    hora: '',
    aula: '',
    contenido: '',
    nota: ''
  });

  useEffect(() => {
    setFormData(examenToFormData(examen));
  }, [examen, visible]);

  const updateField = <K extends keyof FormDataExamen>(field: K, value: FormDataExamen[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!visible) return null;

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.materiaId) {
      return;
    }

    const datos = formDataToDatosExamen(formData, fecha, examen?._id);
    await onGuardar(datos);
    onClose();
  };

  return (
    <div className={appStyles.modalOverlay} onClick={onClose}>
      <div className={appStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>{examen ? '✏️ Editar Parcial' : '📚 Nuevo Parcial'}</h3>
        <div className={styles.fechaInfo}>Fecha: {formatearFechaDMY(fecha)}</div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título del parcial"
            value={formData.titulo}
            onChange={(e) => updateField('titulo', e.target.value)}
            required
            className={appStyles.input}
          />
          
          <select
            value={formData.materiaId}
            onChange={(e) => updateField('materiaId', e.target.value)}
            required
            className={styles.select}
          >
            <option value="">Seleccionar materia *</option>
            {materias.map((m) => (
              <option key={m._id} value={m._id}>{m.nombre}</option>
            ))}
          </select>
          
          <input
            type="time"
            placeholder="Hora"
            value={formData.hora}
            onChange={(e) => updateField('hora', e.target.value)}
            className={appStyles.input}
          />
          
          <input
            type="text"
            placeholder="Aula"
            value={formData.aula}
            onChange={(e) => updateField('aula', e.target.value)}
            className={appStyles.input}
          />
          
          <textarea
            placeholder="Contenido / Temas"
            value={formData.contenido}
            onChange={(e) => updateField('contenido', e.target.value)}
            rows={3}
            className={appStyles.input}
          />
          
          <input
            type="number"
            placeholder="Nota (0-10)"
            value={formData.nota}
            onChange={(e) => updateField('nota', e.target.value)}
            min="0"
            max="10"
            step="0.5"
            className={appStyles.input}
          />
          
          <div className={appStyles.modalButtons}>
            <button 
              type="button" 
              onClick={onClose} 
              className={appStyles.buttonSecondary}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={`${appStyles.button} ${appStyles.buttonPrimary}`}
            >
              {examen ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};