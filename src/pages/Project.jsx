import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Sparkles, CheckCircle2, Lock, Unlock, PlayCircle, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Simulator from '../components/Simulator';
import { courseModules } from '../data/modules';
import useStore from '../store/useStore';
import './Project.css';

export default function Project() {
  const navigate = useNavigate();
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(true);
  const completedChallenges = useStore(state => state.completedChallenges);
  const unlockedModules = useStore(state => state.unlockedModules);

  const initialCode = `<!-- ¡Es hora de brillar! Crea la portada de tu revista online, dale estilo y hazla interactiva -->
<!DOCTYPE html>
<html>
  <head>
    <title>Revista Tech</title>
    <style>
      /* 5. Dale estilo a tu revista (colores, padding, margin, flexbox) */
      body {
        font-family: sans-serif;
        background-color: #1e1e2f;
        color: white;
      }
      
      .btn-leer {
        padding: 10px 20px;
        background: #8b5cf6;
        color: white;
        border: none;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <!-- 1. Crea el encabezado principal (<header>) con un título "Tech Hoy" -->
    
    
    <!-- 2. Crea el contenido principal (<main>) -->
    
      <!-- 3. Añade una sección (<section>) y conviértela en Flexbox en tu CSS -->
      
      
      <!-- 4. Añade un artículo (<article>) con una imagen, título y el botón interactivo -->
      <button class="btn-leer" id="leer-mas">Leer Artículo</button>
      
    <!-- 6. Añade el pie de página (<footer>) -->
    

    <script>
      // 7. Usa JavaScript para darle funcionalidad al botón
      // - Selecciona el botón usando document.querySelector('#leer-mas')
      // - Añade un evento 'click' que cambie el textContent a "¡Cargando..."
      
    </script>
  </body>
</html>
`;

  return (
    <div className="course-layout project-layout">
      {/* Syllabus Sidebar */}
      <AnimatePresence>
        {isSyllabusOpen && (
          <motion.div 
            className="syllabus-sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 250, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="syllabus-header">
              <div className="flex-between">
                <button className="back-btn" onClick={() => navigate('/')} style={{ margin: 0 }}>
                  <ArrowLeft size={20} /> Salir
                </button>
                <button className="icon-btn" onClick={() => setIsSyllabusOpen(false)}>
                  <PanelLeftClose size={20} color="var(--text-muted)" />
                </button>
              </div>
              <h3>Temario</h3>
            </div>
            <div className="syllabus-list">
              {courseModules.map((m) => {
                const isUnlocked = unlockedModules.includes(m.id);
                const isDone = completedChallenges.includes(m.id);
                
                return (
                  <div 
                    key={m.id} 
                    className={`syllabus-item ${!isUnlocked ? 'locked' : ''}`}
                    onClick={() => {
                      if (isUnlocked) navigate(`/course/${m.id}`);
                    }}
                  >
                    <div className="syllabus-icon">
                      {isDone ? <CheckCircle2 size={18} color="#10b981" /> 
                        : isUnlocked ? <Unlock size={18} color="#a1a1aa" /> 
                        : <Lock size={18} color="#52525b" />}
                    </div>
                    <div className="syllabus-text">
                      <p>{m.title}</p>
                    </div>
                  </div>
                );
              })}
              
              <div className="syllabus-item active">
                <div className="syllabus-icon">
                  <PlayCircle size={18} color="#8b5cf6" />
                </div>
                <div className="syllabus-text">
                  <p>Proyecto Final</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="theory-sidebar"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="flex-between" style={{ marginBottom: '1.5rem', alignItems: 'center' }}>
          <button className="back-btn" onClick={() => navigate('/course/15')} style={{ margin: 0 }}>
            <ArrowLeft size={20} /> Volver al Módulo 15
          </button>
          {!isSyllabusOpen && (
            <button className="icon-btn" onClick={() => setIsSyllabusOpen(true)} title="Mostrar Temario">
              <PanelLeftOpen size={24} color="var(--accent-primary)" />
            </button>
          )}
        </div>

        <div className="module-header project-header">
          <Trophy size={48} color="#f59e0b" className="trophy-icon" />
          <h2>Proyecto Final: Full-Stack Junior</h2>
          <p className="module-desc">¡Felicidades por completar HTML, CSS y JS!</p>
        </div>

        <div className="theory-content">
          <p>Es el momento de demostrar lo que has aprendido. Tu misión final es construir una <strong>revista online estructurada, estilizada e interactiva</strong>.</p>
          
          <h3>Requisitos:</h3>
          <ul>
            <li>Estructura con HTML5 (<code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, etc.).</li>
            <li>Usa <strong>Flexbox</strong> (<code>display: flex</code>) para ordenar el layout.</li>
            <li>Aplica estilos y el efecto <code>:hover</code> en los botones.</li>
            <li>Usa <strong>JavaScript</strong> para seleccionar un botón y añadirle un evento de <code>'click'</code> que cambie su texto.</li>
          </ul>

          <div className="glass-card project-tips">
            <Sparkles size={20} color="#8b5cf6" />
            <p>¡Eres un programador web! Has logrado combinar el esqueleto, el diseño y el cerebro de la aplicación. Muestra tu creación al mundo.</p>
          </div>
        </div>

      </motion.div>

      <motion.div 
        className="simulator-area"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <Simulator 
          initialCode={initialCode} 
        />
      </motion.div>
    </div>
  );
}
