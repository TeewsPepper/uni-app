// frontend/src/components/Materias/MateriaForm.tsx
import { useState, useCallback, useMemo } from 'react';
import { HorariosManager } from './HorariosManager';
import type { Horario } from '../../types';
import styles from './MateriaForm.module.css';
import appStyles from '../../App.module.css';

interface Props {
  // ✅ CORREGIDO: El orden debe coincidir con App.tsx
  onAgregar: (nombre: string, profesor: string, color: string, horarios: Horario[]) => Promise<void>;
}

// Constantes fuera del componente
const COLOR_POR_DEFECTO = '#0e639c';

const COLORES_MATERIA: readonly string[] = [
  '#0e639c', '#ce9178', '#6a9955', '#dcdcaa', '#c586c0', 
  '#9cdcfe', '#f48771', '#4ec9b0', '#d7ba7d', '#808080'
] as const;

export const MateriaForm = ({ onAgregar }: Props) => {
  const [nombre, setNombre] = useState<string>('');
  const [profesor, setProfesor] = useState<string>('');
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [color, setColor] = useState<string>(COLOR_POR_DEFECTO);

  const resetForm = useCallback((): void => {
    setNombre('');
    setProfesor('');
    setHorarios([]);
    setColor(COLOR_POR_DEFECTO);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim()) {
      await onAgregar(nombre.trim(), profesor.trim(), color, horarios);
      resetForm();
      setShowForm(false);
    }
  }, [nombre, profesor, color, horarios, onAgregar, resetForm]);

  const colorPreviewStyle = useMemo(() => ({
    backgroundColor: color,
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid #3c3c3c'
  }), [color]);

  const handleCancelar = useCallback((): void => {
    resetForm();
    setShowForm(false);
  }, [resetForm]);

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className={`${appStyles.button} ${appStyles.buttonPrimary}`}
        id="add-materia-button"
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
          {COLORES_MATERIA.map(c => (
            <button
              key={c}
              type="button"
              className={`${styles.colorOption} ${color === c ? styles.colorSelected : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
              title={`Color ${c}`}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <div style={colorPreviewStyle} />
          <span style={{ fontSize: '12px', color: '#858585' }}>{color}</span>
        </div>
      </div>
      
      <HorariosManager horarios={horarios} onChange={setHorarios} />
      
      <div className={styles.buttons}>
        <button 
          type="submit" 
          className={appStyles.buttonPrimary}
          disabled={!nombre.trim()}
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={handleCancelar}
          className={appStyles.buttonSecondary}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};