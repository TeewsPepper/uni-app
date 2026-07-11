/* // frontend/src/components/Onboarding/OnboardingProgress.tsx
import React from 'react';
import styles from './Onboarding.module.css';

interface OnboardingProgressProps {
  current: number;
  total: number;
  onSkip: () => void;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  current,
  total,
  onSkip
}) => {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className={styles.progressInfo}>
        <span>Paso {current + 1} de {total}</span>
        <button 
          className={styles.skipButton} 
          onClick={onSkip}
          aria-label="Saltar onboarding"
        >
          Saltar
        </button>
      </div>
    </div>
  );
}; */
// frontend/src/components/Onboarding/OnboardingProgress.tsx
import React from 'react';
import styles from './Onboarding.module.css';

interface OnboardingProgressProps {
  current: number;
  total: number;
  onSkip: () => void;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  current,
  total,
  onSkip
}) => {
  const progress = ((current + 1) / total) * 100;

  console.log('📊 Progress:', { current, total, progress });

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className={styles.progressInfo}>
        <span>Paso {current + 1} de {total}</span>
        <button 
          className={styles.skipButton} 
          onClick={onSkip}
          aria-label="Saltar onboarding"
        >
          Saltar
        </button>
      </div>
    </div>
  );
};