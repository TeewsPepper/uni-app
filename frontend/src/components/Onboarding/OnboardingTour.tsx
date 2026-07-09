// frontend/src/components/Onboarding/OnboardingTour.tsx
import React, { useEffect } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { OnboardingOverlay } from './OnboardingOverlay';
import { OnboardingStep } from './OnboardingStep';
import { OnboardingProgress } from './OnboardingProgress';
import styles from './Onboarding.module.css';

export const OnboardingTour: React.FC = () => {
  const {
    currentStep,
    isActive,
    isLoading,
    totalSteps,
    currentStepData,
    nextStep,
    prevStep,
    skipOnboarding
  } = useOnboarding();

  // Prevenir scroll cuando el onboarding está activo
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

  if (isLoading || !isActive) {
    return null;
  }

  const { target, position } = currentStepData;

  return (
    <div className="onboarding-tour">
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