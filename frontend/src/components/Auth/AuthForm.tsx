// frontend/src/components/Auth/AuthForm.tsx
import { useState } from 'react';
import appStyles from '../../App.module.css';

interface Props {
  onLogin: () => void;
}

export const AuthForm = ({ onLogin }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin 
      ? 'http://localhost:3001/api/auth/login'
      : 'http://localhost:3001/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        onLogin();
      } else {
        setError(data.error || 'Error de autenticación');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={appStyles.dashboard}>
      <div className={appStyles.header}>
        <h1>📚 Agenda Universitaria</h1>
        <p>Iniciá sesión para organizar tus materias</p>
      </div>
      <div style={{ maxWidth: '400px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '24px' }}>
        <h2>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={appStyles.input}
            style={{ marginBottom: '12px' }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={appStyles.input}
            style={{ marginBottom: '12px' }}
          />
          {error && <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '12px' }}>{error}</div>}
          <button
            type="submit"
            className={`${appStyles.button} ${appStyles.buttonPrimary}`}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Cargando...' : (isLogin ? 'Ingresar' : 'Registrarme')}
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', marginTop: '12px', width: '100%' }}
          >
            {isLogin ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};