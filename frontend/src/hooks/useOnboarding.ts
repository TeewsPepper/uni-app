// frontend/src/hooks/useOnboarding.ts
import { useState, useEffect, useCallback } from 'react';

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

export const useOnboarding = (props: {
  userId: string;
  onComplete?: () => void;
  onSkip?: () => void;
}) => {
  const { userId, onComplete, onSkip } = props;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(true);
  // ✅ Eliminamos isLoading ya que no lo usamos

  useEffect(() => {
    if (!userId) {
      setIsActive(false);
      return;
    }

    try {
      const completed = localStorage.getItem(`${ONBOARDING_KEY}_${userId}`);
      if (completed) {
        setIsActive(false);
        onComplete?.();
      } else {
        setIsActive(true);
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
      setIsActive(false);
    }
  }, [userId, onComplete]);

  const nextStep = useCallback(() => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
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
  }, []);

  const completeOnboarding = useCallback(() => {
    if (userId) {
      try {
        localStorage.setItem(`${ONBOARDING_KEY}_${userId}`, 'true');
        setIsActive(false);
        onComplete?.();
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    }
  }, [userId, onComplete]);

  const skipOnboarding = useCallback(() => {
    if (window.confirm('¿Seguro que quieres saltar el onboarding?')) {
      completeOnboarding();
      onSkip?.();
    }
  }, [completeOnboarding, onSkip]);

  return {
    currentStep,
    isActive,
    totalSteps: ONBOARDING_STEPS.length,
    currentStepData: ONBOARDING_STEPS[currentStep] || ONBOARDING_STEPS[0],
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding
  };
};