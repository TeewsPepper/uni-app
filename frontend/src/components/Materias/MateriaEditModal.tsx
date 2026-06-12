import { useState, useEffect } from 'react';
import { HorariosManager } from './HorariosManager';
import type { Materia, Horario } from '../../types';
import styles from './MateriaForm.module.css';
import appStyles from '../../App.module.css';

interface Props {
  visible: boolean;
  materia: Materia | null;
  onClose: () => void;
  onActualizar: (id: string, nombre: string, profesor: string, horarios: Horario[], color: string) => Promise<void>;  // ← Agregar color
}

const coloresMateria = [
  '#0e639c', '#ce9178', '#6a9955', '#dcdcaa', '#c586c0', '#9cdcfe', '#f48771', '#4ec9b0', '#d7ba7d', '#808080'
];

export const MateriaEditModal = ({ visible, materia, onClose, onActualizar }: Props) => {
  const [nombre, setNombre] = useState('');
  const [profesor, setProfesor] = useState('');
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [color, setColor] = useState('#0e639c');

  useEffect(() => {
    if (materia) {
      setNombre(materia.nombre);
      setProfesor(materia.profesor || '');
      setHorarios(materia.horarios || []);
      setColor(materia.color || '#0e639c');
    }
  }, [materia]);

  if (!visible || !materia) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim()) {
      await onActualizar(materia._id, nombre.trim(), profesor.trim(), horarios, color);  // ← Pasar color
      onClose();
    }
  };

  return (
    <div className={appStyles.modalOverlay} onClick={onClose}>
      <div className={appStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>✏️ Editar Materia</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de la materia *"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className={appStyles.input}
          />
          <input
            type="text"
            placeholder="Profesor (opcional)"
            value={profesor}
            onChange={(e) => setProfesor(e.target.value)}
            className={appStyles.input}
          />
          
          <div className={styles.colorSelector}>
            <label className={styles.label}>Color de la materia:</label>
            <div className={styles.colorPalette}>
              {coloresMateria.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.colorOption} ${color === c ? styles.colorSelected : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          
          <HorariosManager horarios={horarios} onChange={setHorarios} />
          
          <div className={styles.buttons}>
            <button type="submit" className={appStyles.buttonPrimary}>
              Guardar Cambios
            </button>
            <button type="button" onClick={onClose} className={appStyles.buttonSecondary}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};