import { useState } from 'react';
import { HorariosManager } from './HorariosManager';
import type { Horario } from '../../types';
import styles from './MateriaForm.module.css';
import appStyles from '../../App.module.css';

interface Props {
  onAgregar: (nombre: string, profesor: string, horarios: Horario[], color: string) => Promise<void>;
}

const coloresMateria = [
  '#0e639c', '#ce9178', '#6a9955', '#dcdcaa', '#c586c0', '#9cdcfe', '#f48771', '#4ec9b0', '#d7ba7d', '#808080'
];

export const MateriaForm = ({ onAgregar }: Props) => {
  const [nombre, setNombre] = useState('');
  const [profesor, setProfesor] = useState('');
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [color, setColor] = useState('#0e639c');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim()) {
      await onAgregar(nombre.trim(), profesor.trim(), horarios, color);
      setNombre('');
      setProfesor('');
      setHorarios([]);
      setColor('#0e639c');
      setShowForm(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className={`${appStyles.button} ${appStyles.buttonPrimary}`}
      >
        + Agregar Materia
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
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
          Guardar
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className={appStyles.buttonSecondary}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};