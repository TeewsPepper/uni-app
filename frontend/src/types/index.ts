// types/index.ts

export interface Horario {
  dia: string;
  horaInicio: string;
  horaFin: string;
  aula: string;
}

export interface Materia {
  _id: string;
  nombre: string;
  profesor: string;
  color: string;
  horarios: Horario[];
}

export interface Tarea {
  _id: string;
  titulo: string;
  descripcion: string;
  materiaId: string;
  fechaEntrega: string;
  prioridad: 'baja' | 'media' | 'alta';
  completada: boolean;
}

// ✨ Mejora: Tipo unión más específica en lugar de any implícito
export type MateriaInfo = {
  _id: string;
  nombre: string;
  color?: string;
};

export interface Examen {
  _id: string;
  titulo: string;
  // ✨ Tipo explícito para materiaId (reemplaza unión genérica)
  materiaId: string | { _id: string; nombre: string };
  fecha: string;
  hora: string;
  aula: string;
  contenido: string;
  nota: number | null;
}

// ✨ Tipo auxiliar para cuando necesitas la materia poblada
export type ExamenConMateriaPoblada = Omit<Examen, 'materiaId'> & {
  materiaId: MateriaInfo;
};

export interface MateriaStats {
  promedio: number | null;
  cantidadExamenes: number;
  notaMaxima: number | null;
  notaMinima: number | null;
  examenesCalificados: number;
}

// ============================================
// ✨ TYPE GUARDS (para narrowing seguro)
// ============================================

/**
 * Type guard para verificar si materiaId está poblada
 */
export const isMateriaPoblada = (
  materia: string | MateriaInfo
): materia is MateriaInfo => {
  return typeof materia !== 'string' && 'nombre' in materia;
};

/**
 * Type guard para verificar si un examen tiene materia poblada
 */
export const isExamenConMateriaPoblada = (
  examen: Examen
): examen is ExamenConMateriaPoblada => {
  return isMateriaPoblada(examen.materiaId);
};