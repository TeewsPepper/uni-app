/* // frontend/src/components/Onboarding/OnboardingStep.tsx
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
}; */
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
  console.log('🎯 OnboardingStep renderizado:', { 
    step: step.id, 
    isFirst, 
    isLast,
    hasPrev: !isFirst,
    hasNext: !isLast
  });

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepContent}>
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
            {/* ✅ Botón Anterior - Visible cuando NO es el primer paso */}
            {!isFirst && (
              <button 
                className={`${styles.button} ${styles.prevButton}`}
                onClick={(e) => {
                  e.preventDefault();
                  console.log('⬅️ Click en Anterior');
                  onPrev();
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  console.log('⬅️ Touch en Anterior');
                  onPrev();
                }}
                aria-label="Paso anterior"
                type="button"
              >
                ← Anterior
              </button>
            )}
            
            <button 
              className={`${styles.button} ${styles.nextButton}`}
              onClick={(e) => {
                e.preventDefault();
                console.log('➡️ Click en Siguiente');
                onNext();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                console.log('➡️ Touch en Siguiente');
                onNext();
              }}
              aria-label={isLast ? 'Finalizar onboarding' : 'Siguiente paso'}
              type="button"
            >
              {isLast ? '🎉 ¡Empezar!' : 'Siguiente →'}
            </button>
          </div>
          
          <button 
            className={styles.skipButtonStep}
            onClick={(e) => {
              e.preventDefault();
              console.log('⏭️ Click en Saltar');
              onSkip();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              console.log('⏭️ Touch en Saltar');
              onSkip();
            }}
            aria-label="Saltar todo el onboarding"
            type="button"
          >
            Saltar onboarding
          </button>
        </div>
      </div>
    </div>
  );
};