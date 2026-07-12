
// frontend/src/components/Onboarding/OnboardingTour.tsx
import React, { useEffect } from 'react';
import { OnboardingOverlay } from './OnboardingOverlay';
import { OnboardingStep } from './OnboardingStep';
import { OnboardingProgress } from './OnboardingProgress';
import { useOnboarding } from '../../hooks/useOnboarding';
import styles from './Onboarding.module.css';

interface OnboardingTourProps {
  userId: string;
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  userId,
  onComplete,
  onSkip
}) => {
  console.log('🎯 OnboardingTour montado con userId:', userId);
  
  const {
    currentStep,
    isActive,
    isLoading,
    totalSteps,
    currentStepData,
    nextStep,
    prevStep,
    skipOnboarding
  } = useOnboarding({ userId, onComplete, onSkip });

  console.log('🎯 Estado OnboardingTour:', { 
    isActive, 
    isLoading, 
    currentStep,
    totalSteps,
    stepId: currentStepData?.id
  });

  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isActive]);

  if (isLoading) {
    console.log('⏳ Onboarding cargando...');
    return null;
  }

  if (!isActive) {
    console.log('❌ Onboarding no activo');
    return null;
  }

  console.log('✅ Renderizando onboarding, paso:', currentStep + 1);
  console.log('✅ isFirst:', currentStep === 0, 'isLast:', currentStep === totalSteps - 1);
  
  const { target, position } = currentStepData;

  return (
    <div className="onboarding-tour" style={{ position: 'relative', zIndex: 9999 }}>
      <OnboardingOverlay targetId={target} position={position}>
        <div className={styles.onboardingCard}>
          <OnboardingProgress
            current={currentStep}
            total={totalSteps}
            onSkip={skipOnboarding}
          />
          <OnboardingStep
            step={currentStepData}
            isFirst={currentStep === 0}
            isLast={currentStep === totalSteps - 1}
            onNext={nextStep}
            onPrev={prevStep}
            onSkip={skipOnboarding}
          />
        </div>
      </OnboardingOverlay>
    </div>
  );
};