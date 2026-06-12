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

export interface Examen {
  _id: string;
  titulo: string;
  materiaId: string | { _id: string; nombre: string; color?: string };
  fecha: Date |string;
  hora: string;
  aula: string;
  contenido: string;
  nota: number | null;
}