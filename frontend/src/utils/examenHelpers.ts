import type { Examen } from '../types';

export interface DatosExamen {
  id?: string; // ← AGREGAR id (opcional, para edición)
  titulo: string;
  materiaId: string;
  fecha: string;
  hora: string;
  aula: string;
  contenido: string;
  nota: number | null;
}

export interface FormDataExamen {
  titulo: string;
  materiaId: string;
  hora: string;
  aula: string;
  contenido: string;
  nota: string;
}

/**
 * Valida y convierte una nota de string a number
 */
export const parseNota = (notaStr: string): number | null => {
  if (!notaStr.trim()) return null;
  const notaNum = parseFloat(notaStr);
  if (isNaN(notaNum)) return null;
  return Math.min(10, Math.max(0, notaNum));
};

/**
 * Obtiene el ID de materia de un examen de forma segura
 */
export const getMateriaIdFromExamen = (examen: Examen | null | undefined): string => {
  if (!examen) return '';
  return typeof examen.materiaId === 'string' 
    ? examen.materiaId 
    : examen.materiaId._id;
};

/**
 * Convierte FormData a DatosExamen para guardar
 * @param formData - Datos del formulario
 * @param fecha - Fecha en formato YYYY-MM-DD
 * @param examenId - ID del examen (para edición)
 */
export const formDataToDatosExamen = (
  formData: FormDataExamen,
  fecha: string,
  examenId?: string // ← AGREGAR parámetro examenId
): DatosExamen => ({
  id: examenId, // ← INCLUIR ID si existe
  titulo: formData.titulo.trim(),
  materiaId: formData.materiaId,
  fecha: fecha,
  hora: formData.hora,
  aula: formData.aula.trim(),
  contenido: formData.contenido.trim(),
  nota: parseNota(formData.nota)
});

/**
 * Convierte un examen existente a FormData para edición
 */
export const examenToFormData = (examen: Examen | null | undefined): FormDataExamen => {
  if (!examen) {
    return {
      titulo: '',
      materiaId: '',
      hora: '',
      aula: '',
      contenido: '',
      nota: ''
    };
  }
  
  return {
    titulo: examen.titulo,
    materiaId: getMateriaIdFromExamen(examen),
    hora: examen.hora || '',
    aula: examen.aula || '',
    contenido: examen.contenido || '',
    nota: examen.nota?.toString() || ''
  };
};

/**
 * Formatea fecha para mostrar (DD/MM/YYYY)
 */
export const formatearFechaDMY = (fecha: string): string => {
  return fecha.split('-').reverse().join('/');
};