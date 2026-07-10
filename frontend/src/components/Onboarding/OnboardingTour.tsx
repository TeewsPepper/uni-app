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
  console.log('🎯 OnboardingTour renderizado con userId:', userId);
  
  const {
    currentStep,
    isActive,
    totalSteps,
    currentStepData,
    nextStep,
    prevStep,
    skipOnboarding
  } = useOnboarding({ userId, onComplete, onSkip });

  console.log('🎯 OnboardingTour estado:', { 
    isActive, 
    currentStep, 
    totalSteps,
    currentStepId: currentStepData?.id 
  });

  useEffect(() => {
    if (isActive) {
      console.log('🔄 Onboarding activo - bloqueando scroll');
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

  if (!isActive) {
    console.log('❌ Onboarding no activo, retornando null');
    return null;
  }

  console.log('✅ Renderizando onboarding, paso:', currentStep + 1);
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