// frontend/src/components/Materias/MateriaCardWrapper.tsx
import { memo } from 'react';
import { useMateriaStats } from "../../hooks/useMateriaStats";
import { MateriaCard } from "./MateriaCard";
import type { Materia, Tarea, Examen } from "../../types";

interface MateriaCardWrapperProps {
  materia: Materia;
  tareas: Tarea[];
  examenes: Examen[];
  onActualizarProfesor: (id: string, profesor: string) => void;
  onEditarMateria: (materia: Materia) => void;
  onEliminarMateria: (id: string) => void;
  onAgregarTarea: (materiaId: string, titulo: string, fecha: string) => Promise<void>;
  onAgregarExamen: (materiaId: string, titulo: string, fecha: string, hora: string, aula: string) => Promise<void>;
  onCompletarTarea: (id: string) => void;
  onEliminarTarea: (id: string) => void;
  onEliminarExamen: (id: string) => void;
  onEditarExamen?: (examen: Examen) => void;
}

export const MateriaCardWrapper = memo(({ 
  materia, 
  examenes,
  ...restProps 
}: MateriaCardWrapperProps) => {  // ✨ Sin tipo de retorno explícito
  const materiaStats = useMateriaStats(examenes, materia._id);
  
  return (
    <MateriaCard
      materia={materia}
      examenes={examenes}
      materiaStats={materiaStats}
      {...restProps}
    />
  );
});

MateriaCardWrapper.displayName = 'MateriaCardWrapper';