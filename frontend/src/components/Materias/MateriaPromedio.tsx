import { Tooltip } from "react-tooltip";
import type { MateriaStats } from "../../types";
import styles from "./MateriaCard.module.css";

interface MateriaPromedioProps {
  stats: MateriaStats;
  materiaId: string;
}

export const MateriaPromedio = ({ stats, materiaId }: MateriaPromedioProps) => {
  // Colores más sutiles para el borde izquierdo
  const getPromedioBorderColor = (promedio: number | null): string => {
    if (promedio === null) return "#858585";
    if (promedio >= 7) return "#10b981";
    if (promedio >= 5) return "#f59e0b";
    return "#ef4444";
  };

  // Colores para el texto del promedio
  const getPromedioTextColor = (promedio: number | null): string => {
    if (promedio === null) return "#858585";
    if (promedio >= 7) return "#10b981";
    if (promedio >= 5) return "#f59e0b";
    return "#ef4444";
  };

  const getPromedioText = (promedio: number | null): string => {
    if (promedio === null) return "Sin calificaciones";
    return promedio.toFixed(2);
  };

  const tooltipId = `tooltip-promedio-${materiaId}`;
  const tooltipContent =
    stats.examenesCalificados === 0
      ? `📝 ${stats.cantidadExamenes} examen(es) en total\n❌ Ninguno calificado aún`
      : `📊 ${stats.examenesCalificados} examen(es) calificado(s)\n⭐ Nota más alta: ${stats.notaMaxima}\n⭐ Nota más baja: ${stats.notaMinima}\n📝 Total exámenes: ${stats.cantidadExamenes}`;

  return (
    <>
      <div
        className={styles.promedioSection}
        data-tooltip-id={tooltipId}
        data-tooltip-html={tooltipContent.replace(/\n/g, "<br/>")}
      >
        <div
          className={styles.promedioCard}
          style={{
            borderLeftColor: getPromedioBorderColor(stats.promedio),
          }}
        >
          <div className={styles.promedioLabel}>Promedio de Exámenes</div>
          <div 
            className={styles.promedioValor}
            style={{
              color: getPromedioTextColor(stats.promedio),
            }}
          >
            {getPromedioText(stats.promedio)}
          </div>
          {stats.examenesCalificados > 0 && (
            <div className={styles.promedioBase}>
              Basado en {stats.examenesCalificados} examen{stats.examenesCalificados !== 1 ? "es" : ""}
            </div>
          )}
        </div>
      </div>

      <Tooltip
        id={tooltipId}
        place="top"
        className={styles.tooltip}
      />
    </>
  );
};