// frontend/src/components/Onboarding/OnboardingStep.tsx
import React from 'react';
import { OnboardingStep as OnboardingStepType } from '../../hooks/useOnboarding';
import styles from './Onboarding.module.css';

interface OnboardingStepProps {
  step: OnboardingStepType;
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  step,
  isFirst,
  isLast,
  onNext,
  onPrev,
  onSkip
}) => {
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepContent}>
        {/* Badge opcional */}
        <div className={styles.stepBadge}>
          {isFirst ? '👋 Comenzando' : isLast ? '🎯 Último paso' : '📌 Siguiente'}
        </div>
        
        <h2 className={styles.stepTitle}>
          {step.title}
        </h2>
        
        <p className={styles.stepDescription}>
          {step.description}
        </p>
        
        {step.image && (
          <div className={styles.stepImage}>
            <img src={step.image} alt={step.title} loading="lazy" />
          </div>
        )}
        
        <div className={styles.stepActions}>
          <div className={styles.navigationButtons}>
            {!isFirst && (
              <button 
                className={`${styles.button} ${styles.prevButton}`}
                onClick={onPrev}
                aria-label="Paso anterior"
              >
                ← Anterior
              </button>
            )}
            <button 
              className={`${styles.button} ${styles.nextButton}`}
              onClick={onNext}
              aria-label={isLast ? 'Finalizar onboarding' : 'Siguiente paso'}
            >
              {isLast ? '🎉 ¡Empezar!' : 'Siguiente →'}
            </button>
          </div>
          
          <button 
            className={styles.skipButtonStep}
            onClick={onSkip}
            aria-label="Saltar todo el onboarding"
          >
            Saltar onboarding
          </button>
        </div>
      </div>
    </div>
  );
};