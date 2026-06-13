import { useState, useEffect } from 'react';
import type { Materia, Examen } from '../../types';
import styles from './ExamenModal.module.css';
import appStyles from '../../App.module.css';

interface Props {
  visible: boolean;
  fecha: string;
  materias: Materia[];
  examen?: Examen | null;  // Opcional: si viene, es modo edición
  onClose: () => void;
  onGuardar: (datos: {
    titulo: string;
    materiaId: string;
    fecha: string;
    hora: string;
    aula: string;
    contenido: string;
    nota: number | null;
  }) => Promise<void>;
}

export const ExamenModal = ({ visible, fecha, materias, examen, onClose, onGuardar }: Props) => {
  const [titulo, setTitulo] = useState('');
  const [materiaId, setMateriaId] = useState('');
  const [hora, setHora] = useState('');
  const [aula, setAula] = useState('');
  const [contenido, setContenido] = useState('');
  const [nota, setNota] = useState('');

  // Cargar datos del examen si estamos en modo edición
  useEffect(() => {
    if (examen) {
      setTitulo(examen.titulo);
      setMateriaId(typeof examen.materiaId === 'string' ? examen.materiaId : examen.materiaId._id);
      setHora(examen.hora || '');
      setAula(examen.aula || '');
      setContenido(examen.contenido || '');
      setNota(examen.nota?.toString() || '');
    } else {
      setTitulo('');
      setMateriaId('');
      setHora('');
      setAula('');
      setContenido('');
      setNota('');
    }
  }, [examen, visible]);

  if (!visible) return null;

  const fechaFormateada = fecha.split('-').reverse().join('/');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (titulo && materiaId) {
      await onGuardar({
        titulo,
        materiaId,
        fecha: fecha,
        hora,
        aula,
        contenido,
        nota: nota ? parseInt(nota) : null
      });
      onClose();
    }
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
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className={appStyles.input}
          />
          
          <select
            value={materiaId}
            onChange={(e) => setMateriaId(e.target.value)}
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
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className={appStyles.input}
          />
          
          <input
            type="text"
            placeholder="Aula"
            value={aula}
            onChange={(e) => setAula(e.target.value)}
            className={appStyles.input}
          />
          
          <textarea
            placeholder="Contenido / Temas"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            rows={3}
            className={appStyles.input}
          />
          
          <input
            type="number"
            placeholder="Nota (0-10)"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            min="0"
            max="10"
            step="0.5"
            className={appStyles.input}
          />
          
          <div className={appStyles.modalButtons}>
            <button type="button" onClick={onClose} className={appStyles.buttonSecondary}>
              Cancelar
            </button>
            <button type="submit" className={`${appStyles.button} ${appStyles.buttonPrimary}`}>
              {examen ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};