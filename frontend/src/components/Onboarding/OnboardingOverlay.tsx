// frontend/src/components/Onboarding/OnboardingOverlay.tsx
import React, { useEffect, useState } from 'react';
import styles from './Onboarding.module.css';

interface OnboardingOverlayProps {
  targetId?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({
  targetId,
  children,
  position = 'bottom'
}) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isHighlightVisible, setIsHighlightVisible] = useState(false);

  useEffect(() => {
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        setIsHighlightVisible(true);
      } else {
        setTargetRect(null);
        setIsHighlightVisible(false);
        // Intentar encontrar el elemento después de un delay
        const timer = setTimeout(() => {
          const retryElement = document.getElementById(targetId);
          if (retryElement) {
            const rect = retryElement.getBoundingClientRect();
            setTargetRect(rect);
            setIsHighlightVisible(true);
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    } else {
      setTargetRect(null);
      setIsHighlightVisible(false);
    }
  }, [targetId]);

  // Recalcular posición en resize/scroll
  useEffect(() => {
    const handleUpdate = () => {
      if (targetId) {
        const element = document.getElementById(targetId);
        if (element) {
          const rect = element.getBoundingClientRect();
          setTargetRect(rect);
        }
      }
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate);
    
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate);
    };
  }, [targetId]);

  const getPositionStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        pointerEvents: 'auto'
      };
    }

    const spacing = 20;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    let top: number, left: number;

    switch (position) {
      case 'top':
        top = targetRect.top - spacing;
        left = targetRect.left + targetRect.width / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + spacing;
        left = targetRect.left + targetRect.width / 2;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.left - spacing;
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.right + spacing;
        break;
      case 'center':
      default:
        top = windowHeight / 2;
        left = windowWidth / 2;
    }

    // Ajustar posición para que no se salga de la pantalla
    const estimatedWidth = 400;
    const estimatedHeight = 300;

    if (left + estimatedWidth / 2 > windowWidth) {
      left = windowWidth - estimatedWidth / 2 - 10;
    }
    if (left - estimatedWidth / 2 < 0) {
      left = estimatedWidth / 2 + 10;
    }
    if (top + estimatedHeight > windowHeight) {
      top = windowHeight - estimatedHeight - 10;
    }
    if (top < 0) {
      top = 10;
    }

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      transform: position === 'center' ? 'translate(-50%, -50%)' : 'translateX(-50%)',
      zIndex: 1000,
      pointerEvents: 'auto',
      maxWidth: '90vw'
    };
  };

  return (
    <div className={styles.overlayContainer}>
      <div className={styles.backdrop} />
      
      {isHighlightVisible && targetId && targetRect && (
        <div
          className={`${styles.highlight} ${styles.highlightInteractive}`}
          style={{
            position: 'fixed',
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            zIndex: 999,
            pointerEvents: 'none'
          }}
        />
      )}
      
      <div style={getPositionStyle()}>
        {children}
      </div>
    </div>
  );
};