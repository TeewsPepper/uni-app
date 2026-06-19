// frontend/src/components/Dashboard/ExamenModal.tsx
import { useState, useEffect } from 'react';
import type { Materia, Examen } from '../../types';
import styles from './ExamenModal.module.css';
import appStyles from '../../App.module.css';

// ✨ Tipos para el formulario
interface FormData {
  titulo: string;
  materiaId: string;
  hora: string;
  aula: string;
  contenido: string;
  nota: string;
}

// ✨ Datos para guardar (sin el string de nota)
interface DatosGuardar {
  titulo: string;
  materiaId: string;
  fecha: string;
  hora: string;
  aula: string;
  contenido: string;
  nota: number | null;
}

interface Props {
  visible: boolean;
  fecha: string;
  materias: Materia[];
  examen?: Examen | null;
  onClose: () => void;
  onGuardar: (datos: DatosGuardar) => Promise<void>;
}

// ✨ Helper para validar y convertir nota
const parseNota = (notaStr: string): number | null => {
  if (!notaStr.trim()) return null;
  const notaNum = parseFloat(notaStr);
  if (isNaN(notaNum)) return null;
  // Limitar entre 0 y 10
  return Math.min(10, Math.max(0, notaNum));
};

// ✨ Helper para obtener materiaId de forma segura
const getMateriaId = (examen: Examen | null | undefined): string => {
  if (!examen) return '';
  return typeof examen.materiaId === 'string' 
    ? examen.materiaId 
    : examen.materiaId._id;
};

export const ExamenModal = ({ visible, fecha, materias, examen, onClose, onGuardar }: Props) => {
  // ✨ Estado unificado para el formulario
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    materiaId: '',
    hora: '',
    aula: '',
    contenido: '',
    nota: ''
  });

  // ✨ Cargar datos del examen si estamos en modo edición
  useEffect(() => {
    if (examen) {
      setFormData({
        titulo: examen.titulo,
        materiaId: getMateriaId(examen),
        hora: examen.hora || '',
        aula: examen.aula || '',
        contenido: examen.contenido || '',
        nota: examen.nota?.toString() || ''
      });
    } else {
      setFormData({
        titulo: '',
        materiaId: '',
        hora: '',
        aula: '',
        contenido: '',
        nota: ''
      });
    }
  }, [examen, visible]);

  // ✨ Actualizar campos individuales
  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!visible) return null;

  const fechaFormateada = fecha.split('-').reverse().join('/');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.materiaId) {
      return; // Validación básica
    }

    const notaNum = parseNota(formData.nota);

    await onGuardar({
      titulo: formData.titulo.trim(),
      materiaId: formData.materiaId,
      fecha: fecha,
      hora: formData.hora,
      aula: formData.aula.trim(),
      contenido: formData.contenido.trim(),
      nota: notaNum
    });
    
    onClose();
  };

  return (
    <div className={appStyles.modalOverlay} onClick={onClose}>
      <div className={appStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>{examen ? '✏️ Editar Examen' : '📚 Nuevo Examen'}</h3>
        <div className={styles.fechaInfo}>Fecha: {fechaFormateada}</div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título del examen *"
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