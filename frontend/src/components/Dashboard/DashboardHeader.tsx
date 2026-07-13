import React from 'react';
import { LogOut, User } from 'lucide-react';
import styles from './DashboardHeader.module.css';

interface DashboardHeaderProps {
  userEmail: string;
  onLogout: () => void;
  onToggleBreakZone: () => void;
  mostrarBreakZone: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  userEmail, 
  onLogout,
  onToggleBreakZone,
  mostrarBreakZone 
}) => {
  return (
    <header id="dashboard-header" className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <h1>📚 Uni-App</h1>
        </div>
        
        <div className={styles.userInfo}>
          <div className={styles.userDetails}>
            <User size={20} className={styles.userIcon} />
            <span className={styles.userEmail}>{userEmail}</span>
          </div>
          
          <div className={styles.buttonsContainer}>
            <button 
              onClick={onToggleBreakZone} 
              className={`${styles.breakZoneButton} ${mostrarBreakZone ? styles.active : ''}`}
            >
              {mostrarBreakZone ? '📚 Ver Agenda' : '🎯 Break Zone'}
            </button>
            
            <button onClick={onLogout} className={styles.logoutButton}>
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};