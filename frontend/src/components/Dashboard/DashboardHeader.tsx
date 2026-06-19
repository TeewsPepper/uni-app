// frontend/src/components/Dashboard/DashboardHeader.tsx
import { memo } from 'react';
import type { ReactElement } from 'react';
import styles from "./DashboardHeader.module.css";
import appStyles from "../../App.module.css";

// ✨ Tipos separados para mejor organización
interface DashboardHeaderProps {
  userEmail?: string;
  onLogout: () => void;
}

// ✨ Componente memoizado con tipo de return explícito
export const DashboardHeader = memo(({ userEmail, onLogout }: DashboardHeaderProps): ReactElement => {
  return (
    <div className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.titleSection}>
          <h1>📚 UniApp</h1>
          <p>Organizá tu vida universitaria</p>
        </div>
      </div>
      <div className={styles.userSection}>
        {userEmail && (
          <div className={styles.userInfo}>
            <span className={styles.userEmail}>
              👤 {userEmail}
            </span>
          </div>
        )}
        <button
          onClick={onLogout}
          className={`${appStyles.button} ${appStyles.buttonDanger}`}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"  // ✨ Tooltip para mejor UX
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
});

// ✨ Display name para debugging en React DevTools
DashboardHeader.displayName = 'DashboardHeader';