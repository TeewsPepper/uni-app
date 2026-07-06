// frontend/src/hooks/useMateriaStats.ts
import { useMemo } from 'react';
import type { Examen, MateriaStats } from '../types';

// ✨ Helper para obtener ID de materia desde examen (consistente con otros componentes)
const getMateriaIdFromExamen = (examen: Examen): string => {
  return typeof examen.materiaId === 'string' 
    ? examen.materiaId 
    : examen.materiaId._id;
};

export const useMateriaStats = (examenes: Examen[], materiaId: string): MateriaStats => {
  return useMemo(() => {
    // Filtrar exámenes de la materia específica
    const examenesMateria = examenes.filter(examen => {
      const examenMateriaId = getMateriaIdFromExamen(examen);
      return examenMateriaId === materiaId;
    });

    // Filtrar solo los que tienen nota (excluir null)
    const examenesCalificados = examenesMateria.filter(
      (examen): examen is Examen & { nota: number } => examen.nota !== null
    );

    const cantidadCalificados = examenesCalificados.length;

    // Si no hay exámenes calificados
    if (cantidadCalificados === 0) {
      return {
        promedio: null,
        cantidadExamenes: examenesMateria.length,
        notaMaxima: null,
        notaMinima: null,
        examenesCalificados: 0
      };
    }

    // Calcular estadísticas con las notas (ahora TypeScript sabe que nota es number)
    const notas = examenesCalificados.map(e => e.nota);
    const suma = notas.reduce((acc, nota) => acc + nota, 0);
    const promedio = Number((suma / cantidadCalificados).toFixed(2));
    const notaMaxima = Math.max(...notas);
    const notaMinima = Math.min(...notas);

    return {
      promedio,
      cantidadExamenes: examenesMateria.length,
      notaMaxima,
      notaMinima,
      examenesCalificados: cantidadCalificados
    };
  }, [examenes, materiaId]);
};