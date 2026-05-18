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
      if (err.message.includes('academiatarapaca.com')) {
        setError('Error: Debes usar tu correo institucional (@academiatarapaca.com)');
      } else {
        setError('Ocurrió un error al iniciar sesión. Inténtalo de nuevo.');
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
          <p>Ingresa con tu cuenta institucional de Academia Tarapacá para guardar tu progreso en el Quiz final.</p>
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
