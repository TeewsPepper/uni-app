import { useMemo } from 'react';
import type { Examen, MateriaStats } from '../types';

export const useMateriaStats = (examenes: Examen[], materiaId: string): MateriaStats => {
  return useMemo(() => {
    // Filtrar exámenes de la materia específica
    const examenesMateria = examenes.filter(examen => {
      const examenMateriaId = typeof examen.materiaId === 'string' 
        ? examen.materiaId 
        : examen.materiaId._id;
      return examenMateriaId === materiaId;
    });

    // Filtrar solo los que tienen nota (no null)
    const examenesCalificados = examenesMateria.filter(
      examen => examen.nota !== null && examen.nota !== undefined
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

    // Calcular estadísticas con las notas
    const notas = examenesCalificados.map(e => e.nota as number);
    const suma = notas.reduce((acc, nota) => acc + nota, 0);
    const promedio = parseFloat((suma / cantidadCalificados).toFixed(2));
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