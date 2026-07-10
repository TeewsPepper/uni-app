// frontend/src/App.tsx
import { useState, useEffect, useCallback } from "react";
import { BookOpen } from "lucide-react";
import { useMaterias } from "./hooks/useMaterias";
import { useTareas } from "./hooks/useTareas";
import { useExamenes } from "./hooks/useExamenes";
import { AuthForm } from "./components/Auth/AuthForm";
import { DashboardHeader } from "./components/Dashboard/DashboardHeader";
import { MateriaEditModal } from "./components/Materias/MateriaEditModal";
import { MateriaForm } from "./components/Materias/MateriaForm";
import { MateriaCardWrapper as MateriaCard } from "./components/Materias/MateriaCardWrapper";
import { Calendario } from "./components/Calendar/Calendario";
import { ProximosEventos } from "./components/Calendar/ProximosEventos";
import { DiaDetalleModal } from "./components/Calendar/DiaDetalleModal";
import { ExamenModal } from "./components/Examenes/ExamenModal";
import type { Materia, Horario, Examen, AuthMeResponse } from "./types";
import styles from "./App.module.css";
import { OnboardingTour } from "./components/Onboarding/OnboardingTour";

// ✅ USAR VARIABLE DE ENTORNO para la API
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// ✨ Función para formatear fecha a ISO sin zona horaria
const toLocalISODate = (fecha: string): string => {
  const [year, month, day] = fecha.split("-");
  const date = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
  );
  return date.toISOString();
};

// ✨ Función para extraer fecha YYYY-MM-DD de un objeto Date
const extractDateFromDate = (fecha: Date): string => {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ✨ Helper para manejar errores de forma segura
const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Error desconocido";
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  
  // ✅ Estados para el onboarding
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  
  const [materiaEditando, setMateriaEditando] = useState<Materia | null>(null);
  const [mostrarModalDia, setMostrarModalDia] = useState<boolean>(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("");

  const [examenEditando, setExamenEditando] = useState<Examen | null>(null);
  const [mostrarExamenModal, setMostrarExamenModal] = useState<boolean>(false);
  const [fechaExamenModal, setFechaExamenModal] = useState<string>("");

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
    cargando: examenesCargando,
    agregarExamen,
    actualizarExamen,
    eliminarExamen,
    recargar,
  } = useExamenes();

  // ✅ Función para verificar onboarding
  const checkOnboarding = useCallback((userData: { id: string; email: string }) => {
    try {
      const ONBOARDING_KEY = 'onboarding_completed_v1';
      const completed = localStorage.getItem(`${ONBOARDING_KEY}_${userData.id}`);
      const shouldShow = !completed;
      console.log('🔍 Check onboarding:', { 
        userId: userData.id, 
        completed: !!completed, 
        shouldShow 
      });
      return shouldShow;
    } catch {
      return false;
    }
  }, []);

  // ✅ FORZAR RENDER DEL ONBOARDING DESPUÉS DEL LOGIN
  useEffect(() => {
    if (userId && !showOnboarding) {
      const ONBOARDING_KEY = 'onboarding_completed_v1';
      const completed = localStorage.getItem(`${ONBOARDING_KEY}_${userId}`);
      if (!completed) {
        console.log('🔄 Forzando onboarding desde useEffect');
        setShowOnboarding(true);
      }
    }
  }, [userId, showOnboarding]);

  // ✨ Verificar autenticación al cargar
  useEffect(() => {
    const verificarAuth = async (): Promise<void> => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          setIsAuthenticated(false);
          return;
        }

        const data = (await res.json()) as AuthMeResponse;

        if (data.user) {
          setIsAuthenticated(true);
          setUserEmail(data.user.email);
          setUserId(data.user.id);
          
          // ✅ Cargar datos después de autenticar
          await Promise.all([cargarMaterias(), cargarTareas(), recargar()]);
          
          // ✅ Verificar onboarding después de cargar datos
          const shouldShow = checkOnboarding(data.user);
          setShowOnboarding(shouldShow);
          console.log('🎯 Onboarding inicial:', shouldShow);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        setIsAuthenticated(false);
      } finally {
        setLoadingAuth(false);
      }
    };

    verificarAuth();
  }, [cargarMaterias, cargarTareas, recargar, checkOnboarding]);

  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setIsAuthenticated(false);
      setUserEmail("");
      setUserId("");
      setShowOnboarding(false);
    }
  }, []);

  const handleAgregarTarea = useCallback(
    async (materiaId: string, titulo: string, fecha: string): Promise<void> => {
      try {
        const fechaISO = toLocalISODate(fecha);
        await agregarTarea(titulo, materiaId, fechaISO);
        await cargarTareas();
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      }
    },
    [agregarTarea, cargarTareas],
  );

  const handleAgregarExamen = useCallback(
    async (
      materiaId: string,
      titulo: string,
      fecha: string,
      hora: string,
      aula: string,
    ): Promise<void> => {
      try {
        const fechaISO = toLocalISODate(fecha);
        await agregarExamen({
          titulo,
          materiaId,
          fecha: fechaISO,
          hora,
          aula,
          contenido: "",
          nota: null,
        });
        await recargar();
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      }
    },
    [agregarExamen, recargar],
  );

  const handleActualizarMateria = useCallback(
    async (
      id: string,
      nombre: string,
      profesor: string,
      horarios: Horario[],
      color: string,
    ): Promise<void> => {
      try {
        await actualizarMateria(id, nombre, profesor, horarios, color);
        await cargarMaterias();
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      }
    },
    [actualizarMateria, cargarMaterias],
  );

  const handleEditarExamen = useCallback((examen: Examen): void => {
    setExamenEditando(examen);
    const fechaStr = extractDateFromDate(new Date(examen.fecha));
    setFechaExamenModal(fechaStr);
    setMostrarExamenModal(true);
  }, []);

  // ✨ Abrir modal para crear un nuevo examen
  const handleAbrirModalExamen = useCallback((materiaId: string): void => {
    const nuevoExamen: Examen = {
      _id: "",
      titulo: "",
      materiaId: materiaId,
      fecha: new Date().toISOString(),
      hora: "",
      aula: "",
      contenido: "",
      nota: null,
    };

    const fechaStr = new Date().toISOString().split("T")[0];

    setExamenEditando(nuevoExamen);
    setFechaExamenModal(fechaStr);
    setMostrarExamenModal(true);
  }, []);

  const handleGuardarExamen = useCallback(
    async (datos: {
      id?: string;
      titulo: string;
      materiaId: string;
      fecha: string;
      hora: string;
      aula: string;
      contenido: string;
      nota: number | null;
    }): Promise<void> => {
      try {
        if (datos.id) {
          await actualizarExamen(datos.id, datos);
        } else {
          const fechaISO = toLocalISODate(datos.fecha);
          await agregarExamen({
            ...datos,
            fecha: fechaISO,
          });
        }
        await recargar();
        setMostrarExamenModal(false);
        setExamenEditando(null);
        setError(null);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      }
    },
    [actualizarExamen, agregarExamen, recargar],
  );

  const handleFechaClick = useCallback((fecha: string): void => {
    setFechaSeleccionada(fecha);
    setMostrarModalDia(true);
  }, []);

  const handleEliminarMateria = useCallback(
    async (id: string): Promise<void> => {
      try {
        await eliminarMateria(id);
        await cargarMaterias();
        await cargarTareas();
        await recargar();
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      }
    },
    [eliminarMateria, cargarMaterias, cargarTareas, recargar],
  );

  // ✅ Manejar login exitoso
  const handleLoginSuccess = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error al obtener datos del usuario");
      }

      const data = (await res.json()) as AuthMeResponse;

      if (data.user) {
        setIsAuthenticated(true);
        setUserEmail(data.user.email);
        setUserId(data.user.id);
        
        await Promise.all([cargarMaterias(), cargarTareas(), recargar()]);
        
        // ✅ Verificar onboarding después del login
        const shouldShow = checkOnboarding(data.user);
        console.log('🎯 Onboarding después de login:', shouldShow);
        setShowOnboarding(shouldShow);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  }, [cargarMaterias, cargarTareas, recargar, checkOnboarding]);

  if (loadingAuth) return <div className={styles.loading}>Cargando...</div>;

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLoginSuccess} />;
  }

  if (materiasCargando || examenesCargando) {
    return <div className={styles.loading}>Cargando tu agenda...</div>;
  }

  return (
    <div className={styles.dashboard}>
      {/* 🔹 1. DashboardHeader con ID para onboarding */}
      <div id="dashboard-header">
        <DashboardHeader userEmail={userEmail} onLogout={handleLogout} />
      </div>

      {/* 🔹 2. ProximosEventos con ID para onboarding */}
      <div id="proximos-eventos">
        <ProximosEventos
          tareas={tareas}
          examenes={examenes}
          materias={materias}
          onEditarExamen={handleEditarExamen}
          onDiaClick={handleFechaClick}
        />
      </div>

      {/* 🔹 3. Calendario con ID para onboarding */}
      <div id="calendario-container">
        <Calendario
          tareas={tareas}
          examenes={examenes}
          materias={materias}
          onFechaClick={handleFechaClick}
        />
      </div>

      {/* 🔹 4. Sección de Materias con ID para el botón de agregar */}
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
              onEliminarMateria={handleEliminarMateria}
              onAgregarTarea={handleAgregarTarea}
              onAgregarExamen={handleAgregarExamen}
              onCompletarTarea={completarTarea}
              onEliminarTarea={eliminarTarea}
              onEliminarExamen={eliminarExamen}
              onEditarExamen={handleEditarExamen}
              onAbrirModalExamen={handleAbrirModalExamen}
            />
          ))}
        </div>
      </div>

      {/* Modales existentes (sin cambios) */}
      <MateriaEditModal
        visible={!!materiaEditando}
        materia={materiaEditando}
        onClose={() => setMateriaEditando(null)}
        onActualizar={handleActualizarMateria}
      />

      <ExamenModal
        visible={mostrarExamenModal}
        fecha={fechaExamenModal}
        materias={materias}
        examen={examenEditando}
        onClose={() => {
          setMostrarExamenModal(false);
          setExamenEditando(null);
        }}
        onGuardar={handleGuardarExamen}
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

      {/* 🔹 5. OnboardingTour - CON EL TRUCO DEL useEffect */}
      {showOnboarding && userId && (
        <OnboardingTour 
          userId={userId}
          onComplete={() => {
            if (userId) {
              const ONBOARDING_KEY = 'onboarding_completed_v1';
              localStorage.setItem(`${ONBOARDING_KEY}_${userId}`, 'true');
            }
            setShowOnboarding(false);
          }}
          onSkip={() => {
            if (userId) {
              const ONBOARDING_KEY = 'onboarding_completed_v1';
              localStorage.setItem(`${ONBOARDING_KEY}_${userId}`, 'true');
            }
            setShowOnboarding(false);
          }}
        />
      )}
    </div>
  );
}

export default App;