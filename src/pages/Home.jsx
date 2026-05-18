import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Code2, Sparkles, Terminal, Rocket, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, userRole, logout } = useAuth();

  return (
    <div className="home-container flex-center" style={{ position: 'relative' }}>
      <div className="top-nav" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '1rem' }}>
        {currentUser ? (
          <>
            {userRole === 'teacher' && (
              <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                <LayoutDashboard size={18} /> Dashboard
              </button>
            )}
            <button className="btn-secondary" onClick={() => logout()}>
              <LogOut size={18} /> Salir ({currentUser.displayName?.split(' ')[0]})
            </button>
          </>
        ) : (
          <button className="btn-secondary" onClick={() => navigate('/login')}>
            <User size={18} /> Iniciar Sesión Institucional
          </button>
        )}
      </div>

      <div className="container">
        <motion.div 
          className="hero-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-badge">
            <Sparkles size={16} className="text-accent" />
            <span>Curso Interactivo 1ero Medio</span>
          </div>
          
          <h1 className="hero-title">
            Domina la <span className="text-gradient">Web</span> desde Cero
          </h1>
          
          <p className="hero-description">
            Aprende los fundamentos absolutos dominando <strong>HTML5 Semántico</strong>, el arte del diseño con <strong>CSS Flexbox</strong> y dale vida con la magia de <strong>JavaScript</strong>.
            ¡Sin instalar nada, todo directamente desde tu navegador!
          </p>

          <div className="hero-buttons">
            <button 
              className="btn-primary btn-large"
              onClick={() => navigate('/course/1')}
            >
              <Rocket size={20} />
              Iniciar Curso: HTML, CSS y JS
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="features-grid"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="glass-card feature-card">
            <div className="feature-icon html-icon">
              <Code2 size={24} />
            </div>
            <h3>Estructura Base</h3>
            <p>Conoce las etiquetas fundamentales que permiten que el navegador interprete tu sitio web correctamente.</p>
          </div>

          <div className="glass-card feature-card">
            <div className="feature-icon css-icon">
              <Sparkles size={24} />
            </div>
            <h3>Textos y Enlaces</h3>
            <p>Aprende a dar formato a tus textos, insertar imágenes y conectar el mundo a través de enlaces.</p>
          </div>

          <div className="glass-card feature-card">
            <div className="feature-icon js-icon">
              <Terminal size={24} />
            </div>
            <h3>Semántica Avanzada</h3>
            <p>Organiza la información como un profesional usando headers, artículos y secciones para un SEO perfecto.</p>
          </div>
        </motion.div>

        <motion.footer 
          className="home-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Desarrollado con ❤️ por <strong>Erwin Cortez</strong> para estudiantes de 1ero Medio.</p>
        </motion.footer>
      </div>
    </div>
  );
}
