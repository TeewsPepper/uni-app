// frontend/src/components/Materias/MateriaPromedio.tsx
import { Tooltip } from "react-tooltip";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import type { MateriaStats } from "../../types";
import styles from "./MateriaCard.module.css";

interface MateriaPromedioProps {
  stats: MateriaStats;
  materiaId: string;
}

const getPromedioColor = (promedio: number | null): string => {
  if (promedio === null) return "#858585";
  if (promedio >= 7) return "#10b981";
  if (promedio >= 5) return "#f59e0b";
  return "#ef4444";
};

const getPromedioText = (promedio: number | null): string => {
  if (promedio === null) return "Sin calificaciones";
  return promedio.toFixed(2);
};

export const MateriaPromedio = ({ stats, materiaId }: MateriaPromedioProps) => {
  const tooltipId = `tooltip-promedio-${materiaId}`;
  const promedio = stats.promedio;
  const color = getPromedioColor(promedio);
  const porcentaje = promedio ? (promedio / 10) * 100 : 0;

  const tooltipContent = stats.examenesCalificados === 0
    ? `📝 ${stats.cantidadExamenes} examen(es) en total\n❌ Ninguno calificado aún`
    : `📊 ${stats.examenesCalificados} examen(es) calificado(s)\n⭐ Nota más alta: ${stats.notaMaxima}\n⭐ Nota más baja: ${stats.notaMinima}\n📝 Total exámenes: ${stats.cantidadExamenes}`;

  return (
    <div
      className={styles.promedioSection}
      data-tooltip-id={tooltipId}
      data-tooltip-html={tooltipContent.replace(/\n/g, "<br/>")}
    >
      <div 
        className={styles.promedioCard}
        style={{ borderLeftColor: color }}
      >
        <div className={styles.promedioLabel}>Promedio de Exámenes</div>
        
        <div style={{ width: '70px', height: '70px', margin: '0 auto' }}>
          <CircularProgressbar
            value={porcentaje}
            text={promedio !== null ? promedio.toFixed(1) : 'N/A'}
            styles={buildStyles({
              textColor: color,
              pathColor: color,
              trailColor: '#3c3c3c',
              textSize: '20px',
              strokeLinecap: 'round',
            })}
          />
        </div>
        
        <div 
          className={styles.promedioValor}
          style={{ color }}
        >
          {getPromedioText(promedio)}
        </div>
        
        {stats.examenesCalificados > 0 && (
          <div className={styles.promedioBase}>
            Basado en {stats.examenesCalificados} examen{stats.examenesCalificados !== 1 ? "es" : ""}
          </div>
        )}
      </div>

      <Tooltip
        id={tooltipId}
        place="top"
        className={styles.tooltip}
      />
    </div>
  );
};