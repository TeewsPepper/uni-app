import { useState, useEffect } from "react";
import type { Tarea, Examen, Materia } from "../../types";
import styles from "./ProximosEventos.module.css";

interface Props {
  tareas: Tarea[];
  examenes: Examen[];
  materias: Materia[];
  onEditarExamen?: (examen: Examen) => void;
  onDiaClick?: (fecha: string) => void;
}

interface Evento {
  type: string;
  title: string;
  examenId?: string;
  materiaId?: string;
  color?: string;
}

interface DiaEventos {
  fecha: Date;
  eventos: Evento[];
}

const diasMap: { [key: string]: number } = {
  Domingo: 0,
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sábado: 6,
};

export const ProximosEventos = ({
  tareas,
  examenes,
  materias,
  onEditarExamen,
  onDiaClick,
}: Props) => {
  const [eventosPorDia, setEventosPorDia] = useState<DiaEventos[]>([]);

  useEffect(() => {
    const dias: DiaEventos[] = [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      const fechaStr = fecha.toISOString().split("T")[0];

      const eventos: Evento[] = [];

      // Agregar tareas de este día
      tareas.forEach((tarea) => {
        const tareaFecha = new Date(tarea.fechaEntrega)
          .toISOString()
          .split("T")[0];
        if (tareaFecha === fechaStr && !tarea.completada) {
          const materia = materias.find((m) => m._id === tarea.materiaId);
          eventos.push({
            type: "📝",
            title: tarea.titulo,
            materiaId: tarea.materiaId,
            color: materia?.color || "#0e639c",
          });
        }
      });

      // Agregar exámenes de este día
      examenes.forEach((examen) => {
        const examenFecha = new Date(examen.fecha).toISOString().split("T")[0];
        if (examenFecha === fechaStr) {
          let materiaNombre = "";
          let materiaColor = "#ce9178";
          let materiaId = "";

          if (
            examen.materiaId &&
            typeof examen.materiaId === "object" &&
            "nombre" in examen.materiaId
          ) {
            materiaNombre = ` (${examen.materiaId.nombre})`;
            materiaColor = examen.materiaId.color || "#ce9178";
            materiaId = examen.materiaId._id;
          } else if (typeof examen.materiaId === "string") {
            const materia = materias.find((m) => m._id === examen.materiaId);
            if (materia) {
              materiaNombre = ` (${materia.nombre})`;
              materiaColor = materia.color || "#ce9178";
              materiaId = materia._id;
            }
          }
          eventos.push({
            type: "📚",
            title: `${examen.titulo}${materiaNombre}`,
            examenId: examen._id,
            materiaId,
            color: materiaColor,
          });
        }
      });

      // Agregar horarios de materias
      materias.forEach((materia) => {
        if (materia.horarios && materia.horarios.length > 0) {
          materia.horarios.forEach((horario) => {
            const diaSemana = diasMap[horario.dia];
            if (fecha.getDay() === diaSemana) {
              eventos.push({
                type: "🏫",
                title: `${materia.nombre} (${horario.horaInicio} - ${horario.horaFin})${horario.aula ? ` - Aula ${horario.aula}` : ""}`,
                materiaId: materia._id,
                color: materia.color || "#6a9955",
              });
            }
          });
        }
      });

      // Ordenar eventos
      eventos.sort((a, b) => {
        const order = { "📝": 1, "📚": 2, "🏫": 3 };
        return (
          (order[a.type as keyof typeof order] || 4) -
          (order[b.type as keyof typeof order] || 4)
        );
      });

      dias.push({ fecha, eventos });
    }

    setEventosPorDia(dias);
  }, [tareas, examenes, materias]);

  const handleEditarExamen = (examenId: string) => {
    const examen = examenes.find((e) => e._id === examenId);
    if (examen && onEditarExamen) {
      onEditarExamen(examen);
    }
  };

  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  return (
    <div className={styles.proximosEventos}>
      <h3 className={styles.title}>📅 Mi Semana</h3>
      <div className={styles.diasGrid}>
        {eventosPorDia.map((dia, idx) => (
          <div
            key={idx}
            className={styles.diaCard}
            onClick={() => {
              const fechaStr = dia.fecha.toISOString().split("T")[0];
              console.log("Click en día:", fechaStr); // Debug
              onDiaClick?.(fechaStr);
            }}
          >
            <div className={styles.diaHeader}>
              <span className={styles.diaNombre}>
                {diasSemana[dia.fecha.getDay()]}
              </span>
              <span className={styles.diaNumero}>{dia.fecha.getDate()}</span>
            </div>
            <div className={styles.eventosList}>
              {dia.eventos.length === 0 ? (
                <span className={styles.sinEventos}>Sin eventos</span>
              ) : (
                dia.eventos.map((evento, i) => (
                  <div key={i} className={styles.eventoItem}>
                    <span
                      className={`${styles.evento} ${evento.type === "📚" ? styles.eventoExamen : ""}`}
                      style={{
                        borderLeft: `3px solid ${evento.color || "#3c3c3c"}`,
                        backgroundColor: `${evento.color}20`, // 20 = 12% de opacidad
                      }}
                    >
                      {evento.type}{" "}
                      {evento.title.length > 30
                        ? evento.title.slice(0, 30) + "…"
                        : evento.title}
                    </span>
                    {evento.type === "📚" &&
                      evento.examenId &&
                      onEditarExamen && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditarExamen(evento.examenId!);
                          }}
                          className={styles.editarExamenBtn}
                          title="Editar examen"
                        >
                          ✏️
                        </button>
                      )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
