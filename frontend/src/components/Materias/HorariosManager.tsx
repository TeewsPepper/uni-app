// frontend/src/components/Materias/HorariosManager.tsx
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Horario } from '../../types';
import styles from './HorariosManager.module.css';

interface Props {
  horarios: Horario[];
  onChange: (horarios: Horario[]) => void;
}

// ✨ Tipo para días válidos (solo días que tienen clase)
type DiaClase = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';

// ✨ Array de días para el select
const DIAS_CLASE: readonly DiaClase[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] as const;

// ✨ Mapa de orden con tipo seguro
const DIAS_ORDEN: Record<DiaClase, number> = {
  'Lunes': 1,
  'Martes': 2,
  'Miércoles': 3,
  'Jueves': 4,
  'Viernes': 5,
  'Sábado': 6
};

// ✨ Función para ordenar horarios (tipada y segura)
const ordenarHorarios = (horarios: Horario[]): Horario[] => {
  return [...horarios].sort((a, b) => {
    const diaA = a.dia as DiaClase;
    const diaB = b.dia as DiaClase;
    
    const ordenA = DIAS_ORDEN[diaA] ?? 999;
    const ordenB = DIAS_ORDEN[diaB] ?? 999;
    
    const diaDiff = ordenA - ordenB;
    if (diaDiff !== 0) return diaDiff;
    
    return a.horaInicio.localeCompare(b.horaInicio);
  });
};

// ✨ Función para comparar si dos horarios son iguales
const sonHorariosIguales = (h1: Horario, h2: Horario): boolean => {
  return h1.dia === h2.dia && 
         h1.horaInicio === h2.horaInicio && 
         h1.horaFin === h2.horaFin &&
         h1.aula === h2.aula;
};

// ✨ Helper para crear un nuevo horario vacío (sin _id porque no existe)
const crearNuevoHorario = (): Horario => ({
  dia: 'Lunes',
  horaInicio: '09:00',
  horaFin: '11:00',
  aula: ''
});

export const HorariosManager = ({ horarios, onChange }: Props) => {
  const [nuevoHorario, setNuevoHorario] = useState<Horario>(crearNuevoHorario());
  const [mostrarForm, setMostrarForm] = useState<boolean>(false);

  // Horarios ordenados para mostrar
  const horariosOrdenados = ordenarHorarios(horarios);

  const agregarHorario = (): void => {
    if (nuevoHorario.horaInicio && nuevoHorario.horaFin) {
      const nuevosHorarios = [...horarios, { ...nuevoHorario }];
      onChange(ordenarHorarios(nuevosHorarios));
      
      setNuevoHorario(crearNuevoHorario());
      setMostrarForm(false);
    }
  };

  const eliminarHorario = (index: number): void => {
    const horarioAEliminar = horariosOrdenados[index];
    const nuevosHorarios = horarios.filter(h => !sonHorariosIguales(h, horarioAEliminar));
    onChange(ordenarHorarios(nuevosHorarios));
  };

  // ✨ Actualizar campo del nuevo horario
  const actualizarNuevoHorario = <K extends keyof Horario>(
    campo: K, 
    valor: Horario[K]
  ): void => {
    setNuevoHorario(prev => ({ ...prev, [campo]: valor }));
  };

  return (
    <div className={styles.horariosManager}>
      <label className={styles.label}>Horarios de cursada</label>
      
      {horarios.length > 0 && (
        <div className={styles.horariosLista}>
          {horariosOrdenados.map((horario, idx) => (
            <div 
              key={`${horario.dia}-${horario.horaInicio}-${horario.horaFin}-${horario.aula}-${idx}`} 
              className={styles.horarioItem}
            >
              <span className={styles.horarioInfo}>
                {horario.dia} {horario.horaInicio} - {horario.horaFin}
                {horario.aula && ` | Aula: ${horario.aula}`}
              </span>
              <button
                type="button"
                onClick={() => eliminarHorario(idx)}
                className={styles.eliminarBtn}
                aria-label="Eliminar horario"
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
            onChange={(e) => actualizarNuevoHorario('dia', e.target.value as DiaClase)}
            className={styles.select}
          >
            {DIAS_CLASE.map(dia => (
              <option key={dia} value={dia}>{dia}</option>
            ))}
          </select>
          
          <input
            type="time"
            value={nuevoHorario.horaInicio}
            onChange={(e) => actualizarNuevoHorario('horaInicio', e.target.value)}
            className={styles.input}
          />
          
          <input
            type="time"
            value={nuevoHorario.horaFin}
            onChange={(e) => actualizarNuevoHorario('horaFin', e.target.value)}
            className={styles.input}
          />
          
          <input
            type="text"
            value={nuevoHorario.aula}
            onChange={(e) => actualizarNuevoHorario('aula', e.target.value)}
            className={styles.input}
            placeholder="Aula (opcional)"
          />
          
          <div className={styles.formButtons}>
            <button 
              type="button" 
              onClick={agregarHorario} 
              className={styles.guardarBtn}
            >
              Guardar
            </button>
            <button 
              type="button" 
              onClick={() => setMostrarForm(false)} 
              className={styles.cancelarBtn}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};