// frontend/src/components/Dashboard/DashboardHeader.tsx
import styles from "./DashboardHeader.module.css";
import appStyles from "../../App.module.css";

interface Props {
  userEmail?: string;
  onLogout: () => void;
}

export const DashboardHeader = ({ userEmail, onLogout }: Props) => {
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
            <span className={styles.userEmail}>👤 {userEmail}</span>
          </div>
        )}
        <button
          onClick={onLogout}
          className={`${appStyles.button} ${appStyles.buttonDanger}`}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};