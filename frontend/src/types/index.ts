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
  usuarioId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tarea {
  _id: string;
  titulo: string;
  descripcion: string;
  materiaId: string;
  fechaEntrega: string;
  prioridad: 'baja' | 'media' | 'alta';
  completada: boolean;
  usuarioId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MateriaPoblada {
  _id: string;
  nombre: string;
  color: string;
}

export type MateriaId = string | MateriaPoblada;

export interface Examen {
  _id: string;
  titulo: string;
  materiaId: MateriaId;
  fecha: string;
  hora: string;
  aula: string;
  contenido: string;
  nota: number | null;
  usuarioId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ExamenConMateriaPoblada = Omit<Examen, 'materiaId'> & {
  materiaId: MateriaPoblada;
};

export interface MateriaStats {
  promedio: number | null;
  cantidadExamenes: number;
  notaMaxima: number | null;
  notaMinima: number | null;
  examenesCalificados: number;
}

// ============================================
// TYPE GUARDS
// ============================================

export const isMateriaPoblada = (
  materia: MateriaId
): materia is MateriaPoblada => {
  return typeof materia !== 'string' && 'nombre' in materia && 'color' in materia;
};

export const isExamenConMateriaPoblada = (
  examen: Examen
): examen is ExamenConMateriaPoblada => {
  return isMateriaPoblada(examen.materiaId);
};

// ============================================
// TIPOS PARA LA API
// ============================================

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  message?: string;
}

export interface AuthMeResponse {
  user: {
    id: string;
    email: string;
  } | null;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}

// ============================================
// TIPOS PARA CREACIÓN/ACTUALIZACIÓN
// ============================================

export interface CreateMateriaData {
  nombre: string;
  profesor?: string;
  color?: string;
  horarios?: Horario[];
}

// ✅ AGREGADO: UpdateMateriaData
export interface UpdateMateriaData extends Partial<CreateMateriaData> {
  id: string;
}

export interface CreateTareaData {
  titulo: string;
  descripcion?: string;
  materiaId: string;
  fechaEntrega: string;
  prioridad?: 'baja' | 'media' | 'alta';
}

// ✅ AGREGADO: UpdateTareaData
export interface UpdateTareaData extends Partial<CreateTareaData> {
  id: string;
  completada?: boolean;
}

export interface CreateExamenData {
  titulo: string;
  materiaId: string;
  fecha: string;
  hora?: string;
  aula?: string;
  contenido?: string;
  nota?: number | null;
}

// ✅ AGREGADO: UpdateExamenData
export interface UpdateExamenData extends Partial<CreateExamenData> {
  id: string;
}