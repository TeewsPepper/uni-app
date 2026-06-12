import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Horario } from '../../types';
import styles from './HorariosManager.module.css';

interface Props {
  horarios: Horario[];
  onChange: (horarios: Horario[]) => void;
}

const diasOrden = {
  'Lunes': 1,
  'Martes': 2,
  'Miércoles': 3,
  'Jueves': 4,
  'Viernes': 5,
  'Sábado': 6,
  'Domingo': 7
};

const ordenarHorarios = (horarios: Horario[]): Horario[] => {
  return [...horarios].sort((a, b) => {
    const diaDiff = (diasOrden[a.dia as keyof typeof diasOrden] || 0) - 
                    (diasOrden[b.dia as keyof typeof diasOrden] || 0);
    if (diaDiff !== 0) return diaDiff;
    return a.horaInicio.localeCompare(b.horaInicio);
  });
};

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const HorariosManager = ({ horarios, onChange }: Props) => {
  const [nuevoHorario, setNuevoHorario] = useState<Horario>({
    dia: 'Lunes',
    horaInicio: '09:00',
    horaFin: '11:00',
    aula: ''
  });
  const [mostrarForm, setMostrarForm] = useState(false);

  // Ordenar horarios para mostrar
  const horariosOrdenados = ordenarHorarios(horarios);

  const agregarHorario = () => {
    if (nuevoHorario.horaInicio && nuevoHorario.horaFin) {
      const nuevosHorarios = [...horarios, { ...nuevoHorario }];
      onChange(ordenarHorarios(nuevosHorarios));
      setNuevoHorario({
        dia: 'Lunes',
        horaInicio: '09:00',
        horaFin: '11:00',
        aula: ''
      });
      setMostrarForm(false);
    }
  };

  const eliminarHorario = (index: number) => {
    // Necesitamos eliminar por el índice del array ordenado original
    const horarioAEliminar = horariosOrdenados[index];
    const nuevosHorarios = horarios.filter(h => 
      !(h.dia === horarioAEliminar.dia && 
        h.horaInicio === horarioAEliminar.horaInicio && 
        h.horaFin === horarioAEliminar.horaFin &&
        h.aula === horarioAEliminar.aula)
    );
    onChange(ordenarHorarios(nuevosHorarios));
  };

  return (
    <div className={styles.horariosManager}>
      <label className={styles.label}>Horarios de cursada</label>
      
      {horarios.length > 0 && (
        <div className={styles.horariosLista}>
          {horariosOrdenados.map((horario, idx) => (
            <div key={idx} className={styles.horarioItem}>
              <span className={styles.horarioInfo}>
                {horario.dia} {horario.horaInicio} - {horario.horaFin}
                {horario.aula && ` | Aula: ${horario.aula}`}
              </span>
              <button
                type="button"
                onClick={() => eliminarHorario(idx)}
                className={styles.eliminarBtn}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {!mostrarForm ? (
        <button
          type="button"
          onClick={() => setMostrarForm(true)}
          className={styles.agregarBtn}
        >
          <Plus size={16} /> Agregar horario
        </button>
      ) : (
        <div className={styles.horarioForm}>
          <select
            value={nuevoHorario.dia}
            onChange={(e) => setNuevoHorario({ ...nuevoHorario, dia: e.target.value })}
            className={styles.select}
          >
            {dias.map(dia => (
              <option key={dia} value={dia}>{dia}</option>
            ))}
          </select>
          
          <input
            type="time"
            value={nuevoHorario.horaInicio}
            onChange={(e) => setNuevoHorario({ ...nuevoHorario, horaInicio: e.target.value })}
            className={styles.input}
          />
          
          <input
            type="time"
            value={nuevoHorario.horaFin}
            onChange={(e) => setNuevoHorario({ ...nuevoHorario, horaFin: e.target.value })}
            className={styles.input}
          />
          
          <input
            type="text"
            value={nuevoHorario.aula}
            onChange={(e) => setNuevoHorario({ ...nuevoHorario, aula: e.target.value })}
            className={styles.input}
            placeholder="Aula (opcional)"
          />
          
          <div className={styles.formButtons}>
            <button type="button" onClick={agregarHorario} className={styles.guardarBtn}>
              Guardar
            </button>
            <button type="button" onClick={() => setMostrarForm(false)} className={styles.cancelarBtn}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};