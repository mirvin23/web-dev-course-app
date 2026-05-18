import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { AlertCircle, Globe } from 'lucide-react';
import './Login.css';

export default function Login() {
  const { loginWithGoogle, currentUser } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error("Error detallado:", err);
      if (err.message?.includes('academiatarapaca.com')) {
        setError('Error: Debes usar tu correo institucional (@academiatarapaca.com)');
      } else if (err.message?.includes('Missing or insufficient permissions')) {
        setError('Error de Base de Datos: Faltan permisos de Firestore. Revisa las reglas.');
      } else if (err.message?.includes('auth/unauthorized-domain')) {
        setError('Error de Dominio: Agrega este sitio en Firebase Auth > Dominios Autorizados.');
      } else if (err.message?.includes('auth/popup-closed-by-user')) {
        setError('Cancelaste el inicio de sesión.');
      } else {
        setError(`Error: ${err.message || 'Inténtalo de nuevo.'}`);
      }
    }
  };

  if (currentUser) {
    navigate('/');
    return null;
  }

  return (
    <div className="login-container flex-center">
      <motion.div 
        className="glass-card login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="login-header">
          <h2>Iniciar Sesión</h2>
          <p>Debes identificarte con tu cuenta institucional de la Academia Tarapacá para acceder al curso.</p>
        </div>

        {error && (
          <div className="login-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <button className="btn-google" onClick={handleLogin}>
          <Globe size={20} />
          Continuar con Google Workspace
        </button>
      </motion.div>
    </div>
  );
}
