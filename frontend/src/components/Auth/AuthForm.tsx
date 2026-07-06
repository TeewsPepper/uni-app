// frontend/src/components/Auth/AuthForm.tsx
import { useState } from 'react';
import styles from './AuthForm.module.css'; // ✨ Importar CSS Module local

// ✨ Tipos para las respuestas de la API
interface AuthResponse {
  error?: string;
  message?: string;
  user?: {
    id: string;
    email: string;
  };
}

interface Props {
  onLogin: () => void;
}

const API_BASE_URL = 'http://localhost:3001/api/auth';
const ENDPOINTS = {
  login: `${API_BASE_URL}/login`,
  register: `${API_BASE_URL}/register`
} as const;

export const AuthForm = ({ onLogin }: Props) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? ENDPOINTS.login : ENDPOINTS.register;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json() as AuthResponse;

      if (res.ok) {
        onLogin();
      } else {
        setError(data.error || 'Error de autenticación');
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error de conexión con el servidor';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>📚 Agenda Universitaria</h1>
          <p>Organizá tus materias, tareas, exámenes, calificaciones y más</p>
        </div>

        <h2 className={styles.authTitle}>
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className={styles.input}
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !email || !password}
          >
            {loading ? 'Cargando...' : (isLogin ? 'Ingresar' : 'Registrarme')}
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className={styles.toggleButton}
          >
            {isLogin 
              ? '¿No tenés cuenta? Registrate' 
              : '¿Ya tenés cuenta? Iniciá sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};