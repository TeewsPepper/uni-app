// frontend/src/hooks/useOnboarding.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  image?: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '🎓 ¡Bienvenido a Agenda Universitaria!',
    description: 'Organiza tus materias, tareas y exámenes en un solo lugar. ¡Nunca fue tan fácil mantenerte al día!',
    position: 'center'
  },
  {
    id: 'header',
    title: '👤 Tu Panel de Control',
    description: 'Aquí puedes ver tu correo electrónico y cerrar sesión cuando quieras. Siempre tendrás el control.',
    target: 'dashboard-header',
    position: 'bottom'
  },
  {
    id: 'events',
    title: '📋 Próximos Eventos',
    description: 'Tus tareas y exámenes más cercanos aparecerán aquí. ¡No olvides ninguna fecha importante!',
    target: 'proximos-eventos',
    position: 'bottom'
  },
  {
    id: 'calendar',
    title: '📅 Calendario Interactivo',
    description: 'Haz clic en cualquier día para ver o agregar eventos. Visualiza tu mes de un vistazo.',
    target: 'calendario-container',
    position: 'bottom'
  },
  {
    id: 'add-materia',
    title: '➕ ¡Empieza Ahora!',
    description: 'Crea tu primera materia y comienza a organizar tu vida universitaria. ¡Es más fácil de lo que piensas!',
    target: 'add-materia-button',
    position: 'top'
  },
  {
    id: 'complete',
    title: '🚀 ¡Todo Listo!',
    description: 'Ya estás preparado para organizar tu vida universitaria. ¡Mucho éxito en tus estudios!',
    position: 'center'
  }
];

const ONBOARDING_KEY = 'onboarding_completed_v1';

export const useOnboarding = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setIsActive(false);
        setIsLoading(false);
        return;
      }

      try {
        const completed = localStorage.getItem(`${ONBOARDING_KEY}_${user.id}`);
        const shouldShow = !completed;
        
        setIsActive(shouldShow);
        if (shouldShow) {
          setCurrentStep(0);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsActive(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  const nextStep = useCallback(() => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      // Scroll to top of the step content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      completeOnboarding();
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < ONBOARDING_STEPS.length) {
      setCurrentStep(stepIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const completeOnboarding = useCallback(() => {
    if (user) {
      try {
        localStorage.setItem(`${ONBOARDING_KEY}_${user.id}`, 'true');
        setIsActive(false);
        // Pequeño delay para que se vea la animación de cierre
        setTimeout(() => {
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
        }, 300);
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    }
  }, [user]);

  const skipOnboarding = useCallback(() => {
    if (window.confirm('¿Seguro que quieres saltar el onboarding? Puedes volver a verlo desde configuración.')) {
      completeOnboarding();
    }
  }, [completeOnboarding]);

  const resetOnboarding = useCallback(() => {
    if (user) {
      try {
        localStorage.removeItem(`${ONBOARDING_KEY}_${user.id}`);
        setIsActive(true);
        setCurrentStep(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Error resetting onboarding:', error);
      }
    }
  }, [user]);

  return {
    currentStep,
    isActive,
    isLoading,
    totalSteps: ONBOARDING_STEPS.length,
    currentStepData: ONBOARDING_STEPS[currentStep] || ONBOARDING_STEPS[0],
    nextStep,
    prevStep,
    goToStep,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding
  };
};