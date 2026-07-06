
import { useState, useEffect, useCallback, useMemo } from 'react';
import { HorariosManager } from './HorariosManager';
import type { Materia, Horario } from '../../types';
import styles from './MateriaForm.module.css';
import appStyles from '../../App.module.css';

interface Props {
  visible: boolean;
  materia: Materia | null;
  onClose: () => void;
  onActualizar: (id: string, nombre: string, profesor: string, horarios: Horario[], color: string) => Promise<void>;
}

// ✨ Constantes fuera del componente
const COLOR_POR_DEFECTO = '#0e639c';

const COLORES_MATERIA: readonly string[] = [
  '#0e639c', '#ce9178', '#6a9955', '#dcdcaa', '#c586c0', 
  '#9cdcfe', '#f48771', '#4ec9b0', '#d7ba7d', '#808080'
] as const;

// ✨ Helper para validar color
const isValidColor = (color: string): boolean => {
  return COLORES_MATERIA.includes(color) || /^#[0-9A-Fa-f]{6}$/.test(color);
};

export const MateriaEditModal = ({ visible, materia, onClose, onActualizar }: Props) => {
  const [nombre, setNombre] = useState<string>('');
  const [profesor, setProfesor] = useState<string>('');
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [color, setColor] = useState<string>(COLOR_POR_DEFECTO);

  // ✨ Resetear formulario cuando cambia la materia o se cierra
  useEffect(() => {
    if (materia && visible) {
      setNombre(materia.nombre);
      setProfesor(materia.profesor || '');
      setHorarios(materia.horarios || []);
      setColor(materia.color && isValidColor(materia.color) ? materia.color : COLOR_POR_DEFECTO);
    }
  }, [materia, visible]);

  // ✨ Limpiar formulario al cerrar (opcional)
  useEffect(() => {
    if (!visible) {
      // Pequeño delay para evitar que se vea el reseteo
      const timeout = setTimeout(() => {
        if (!visible) {
          setNombre('');
          setProfesor('');
          setHorarios([]);
          setColor(COLOR_POR_DEFECTO);
        }
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim() && materia) {
      await onActualizar(
        materia._id, 
        nombre.trim(), 
        profesor.trim(), 
        horarios, 
        color
      );
      onClose();
    }
  }, [nombre, profesor, horarios, color, materia, onActualizar, onClose]);

  // ✨ Memoizar el preview del color actual
  const colorPreviewStyle = useMemo(() => ({
    backgroundColor: color,
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid #3c3c3c'
  }), [color]);

  if (!visible || !materia) return null;

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
            {/* ✨ Preview del color seleccionado */}
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
              Guardar Cambios
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className={appStyles.buttonSecondary}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};