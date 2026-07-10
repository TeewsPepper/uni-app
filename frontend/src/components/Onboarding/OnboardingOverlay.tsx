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
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  // Detectar cambios de tamaño
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 300);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Obtener el elemento target
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
    window.addEventListener('orientationchange', () => {
      setTimeout(handleUpdate, 300);
    });
    
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
        pointerEvents: 'auto',
        maxWidth: '94vw',
        width: '100%'
      };
    }

    const isMobile = viewportWidth <= 768;
    const cardHeight = isMobile ? 280 : 300;
    const cardWidth = isMobile ? viewportWidth - 32 : 400;
    
    // ✅ Espaciado mayor para 'top' (para que no tape el botón)
    const spacing = position === 'top' ? 24 : 16;

    let top: number, left: number;
    let finalPosition = position;

    // En móvil, ajustar si es necesario
    if (isMobile) {
      const spaceAbove = targetRect.top;
      const spaceBelow = viewportHeight - targetRect.bottom;
      
      // Si es 'top' y no hay espacio arriba, centrar o poner abajo
      if (position === 'top' && spaceAbove < cardHeight + 40) {
        if (spaceBelow > cardHeight + 40) {
          finalPosition = 'bottom';
        } else {
          finalPosition = 'center';
        }
      }
      // Si es 'bottom' y no hay espacio abajo, poner arriba
      else if (position === 'bottom' && spaceBelow < cardHeight + 40) {
        if (spaceAbove > cardHeight + 40) {
          finalPosition = 'top';
        } else {
          finalPosition = 'center';
        }
      }
    }

    switch (finalPosition) {
      case 'top':
        // ✅ Para 'top', usar más espacio entre tooltip y botón
        top = targetRect.top - cardHeight - spacing;
        left = targetRect.left + targetRect.width / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + spacing;
        left = targetRect.left + targetRect.width / 2;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.left - cardWidth - spacing;
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.right + spacing;
        break;
      case 'center':
      default:
        top = viewportHeight / 2;
        left = viewportWidth / 2;
    }

    // Ajustar para que no se salga de la pantalla
    if (top < 10) {
      top = 10;
    }
    if (top + cardHeight > viewportHeight - 10) {
      top = viewportHeight - cardHeight - 10;
    }
    if (left + cardWidth / 2 > viewportWidth) {
      left = viewportWidth - cardWidth / 2 - 10;
    }
    if (left - cardWidth / 2 < 0) {
      left = cardWidth / 2 + 10;
    }

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      transform: finalPosition === 'center' ? 'translate(-50%, -50%)' : 'translateX(-50%)',
      zIndex: 1000,
      pointerEvents: 'auto',
      maxWidth: isMobile ? `${viewportWidth - 20}px` : '400px',
      width: '100%'
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
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            zIndex: 999,
            pointerEvents: 'none',
            borderRadius: '6px'
          }}
        />
      )}
      
      <div style={getPositionStyle()}>
        {children}
      </div>
    </div>
  );
};