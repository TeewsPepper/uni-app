import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { useMaterias } from "./hooks/useMaterias";
import { useTareas } from "./hooks/useTareas";
import { useExamenes } from "./hooks/useExamenes";
import { AuthForm } from "./components/Auth/AuthForm";
import { DashboardHeader } from "./components/Dashboard/DashboardHeader";
import { MateriaEditModal } from "./components/Materias/MateriaEditModal";
import { MateriaForm } from "./components/Materias/MateriaForm";
import { MateriaCard } from "./components/Materias/MateriaCard";
import { Calendario } from "./components/Calendar/Calendario";
import { ProximosEventos } from "./components/Calendar/ProximosEventos";
import { DiaDetalleModal } from "./components/Calendar/DiaDetalleModal";
import type { Materia, Horario } from "./types";
import styles from "./App.module.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [materiaEditando, setMateriaEditando] = useState<Materia | null>(null);
  const [mostrarModalDia, setMostrarModalDia] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  const {
    materias,
    cargando: materiasCargando,
    cargarMaterias,
    agregarMateria,
    actualizarProfesor,
    actualizarMateria,
    eliminarMateria,
  } = useMaterias();
  const { tareas, cargarTareas, agregarTarea, completarTarea, eliminarTarea } =
    useTareas();
  const {
    examenes,
    cargando,
    agregarExamen,
    actualizarExamen,
    eliminarExamen,
    recargar,
  } = useExamenes();

  useEffect(() => {
    fetch("http://localhost:3001/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setIsAuthenticated(true);
          setUserEmail(data.user.email);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoadingAuth(false));
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:3001/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
    setUserEmail("");
  };

  const handleAgregarTarea = async (
    materiaId: string,
    titulo: string,
    fecha: string,
  ) => {
    try {
      const [year, month, day] = fecha.split("-");
      const fechaAjustada = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
      );
      await agregarTarea(titulo, materiaId, fechaAjustada.toISOString());
      await cargarTareas();
    } catch {
      setError("No se pudo agregar la tarea");
    }
  };

  const handleAgregarExamen = async (
    materiaId: string,
    titulo: string,
    fecha: string,
    hora: string,
    aula: string,
  ) => {
    try {
      const [year, month, day] = fecha.split("-");
      const fechaAjustada = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
      );
      await agregarExamen({
        titulo,
        materiaId,
        fecha: fechaAjustada.toISOString(),
        hora,
        aula,
        contenido: "",
        nota: null,
      });
      await recargar();
    } catch {
      setError("No se pudo agregar el examen");
    }
  };

  const handleActualizarMateria = async (
    id: string,
    nombre: string,
    profesor: string,
    horarios: Horario[],
    color: string,
  ) => {
    try {
      await actualizarMateria(id, nombre, profesor, horarios, color);
      await cargarMaterias();
    } catch {
      setError("No se pudo actualizar la materia");
    }
  };

  const handleEditarExamen = (examen: any) => {
    const fechaStr = new Date(examen.fecha).toISOString().split("T")[0];
    setFechaSeleccionada(fechaStr);
    setMostrarModalDia(true);
  };

  const handleFechaClick = (fecha: string) => {
    setFechaSeleccionada(fecha);
    setMostrarModalDia(true);
  };

  // ✅ NUEVA FUNCIÓN PARA ELIMINAR MATERIA Y RECARGAR TODO
  const handleEliminarMateria = async (id: string) => {
    try {
      await eliminarMateria(id);
      await cargarMaterias();
      await cargarTareas();
      await recargar();
    } catch {
      setError("No se pudo eliminar la materia");
    }
  };

  if (loadingAuth) return <div className={styles.loading}>Cargando...</div>;
  if (!isAuthenticated) {
    return (
      <AuthForm
        onLogin={async () => {
          const res = await fetch("http://localhost:3001/api/auth/me", {
            credentials: "include",
          });
          const data = await res.json();
          if (data.user) {
            setIsAuthenticated(true);
            setUserEmail(data.user.email);
            await cargarMaterias();
            await cargarTareas();
            await recargar();
          }
        }}
      />
    );
  }
  if (materiasCargando)
    return <div className={styles.loading}>Cargando tu agenda...</div>;

  return (
    <div className={styles.dashboard}>
      <DashboardHeader userEmail={userEmail} onLogout={handleLogout} />
      
      <ProximosEventos
        tareas={tareas}
        examenes={examenes}
        materias={materias}
        onEditarExamen={handleEditarExamen}
        onDiaClick={handleFechaClick}
      />
      
      <div>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <BookOpen size={20} /> Mis Materias
          </h2>
          <MateriaForm onAgregar={agregarMateria} />
        </div>
        <div className={styles.materiaGrid}>
          {materias.map((materia) => (
            <MateriaCard
              key={materia._id}
              materia={materia}
              tareas={tareas}
              examenes={examenes}
              onActualizarProfesor={actualizarProfesor}
              onEditarMateria={setMateriaEditando}
              onEliminarMateria={handleEliminarMateria}  // ✅ CAMBIADO
              onAgregarTarea={handleAgregarTarea}
              onAgregarExamen={handleAgregarExamen}
              onCompletarTarea={completarTarea}
              onEliminarTarea={eliminarTarea}
              onEliminarExamen={eliminarExamen}
              onEditarExamen={handleEditarExamen}
            />
          ))}
        </div>
      </div>
      
      <Calendario
        tareas={tareas}
        examenes={examenes}
        materias={materias}
        onFechaClick={handleFechaClick}
      />

      <MateriaEditModal
        visible={!!materiaEditando}
        materia={materiaEditando}
        onClose={() => setMateriaEditando(null)}
        onActualizar={handleActualizarMateria}
      />

      <DiaDetalleModal
        visible={mostrarModalDia}
        fecha={fechaSeleccionada}
        tareas={tareas}
        examenes={examenes}
        materias={materias}
        onClose={() => setMostrarModalDia(false)}
        onAgregarTarea={handleAgregarTarea}
        onAgregarExamen={handleAgregarExamen}
        onCompletarTarea={completarTarea}
        onEliminarTarea={eliminarTarea}
        onEliminarExamen={eliminarExamen}
        onEditarExamen={handleEditarExamen}
      />

      {error && (
        <div className={styles.modalOverlay} onClick={() => setError(null)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>❌ Error</h3>
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;