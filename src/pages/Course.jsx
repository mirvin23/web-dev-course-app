import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Lock, Unlock, PlayCircle, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Simulator from '../components/Simulator';
import { courseModules } from '../data/modules';
import useStore from '../store/useStore';
import ReactMarkdown from 'react-markdown';
import './Course.css';

export default function Course() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(true);
  const currentModuleId = parseInt(moduleId);
  const module = courseModules.find(m => m.id === currentModuleId);
  
  const unlockModule = useStore(state => state.unlockModule);
  const completeChallenge = useStore(state => state.completeChallenge);
  const completedChallenges = useStore(state => state.completedChallenges);
  const unlockedModules = useStore(state => state.unlockedModules);

  if (!module) {
    return <div>Módulo no encontrado</div>;
  }

  const isCompleted = completedChallenges.includes(currentModuleId);

  const handleValidate = (code) => {
    const isValid = module.task.validate(code);
    if (isValid && !isCompleted) {
      completeChallenge(currentModuleId);
      unlockModule(currentModuleId + 1);
    }
    return isValid;
  };

  const nextModule = () => {
    if (currentModuleId < courseModules.length) {
      navigate(`/course/${currentModuleId + 1}`);
    } else {
      navigate('/quiz'); // Go to Quiz before final project
    }
  };

  return (
    <div className="course-layout">
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
                const isActive = m.id === currentModuleId;
                const isDone = completedChallenges.includes(m.id);
                
                return (
                  <div 
                    key={m.id} 
                    className={`syllabus-item ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`}
                    onClick={() => {
                      if (isUnlocked) navigate(`/course/${m.id}`);
                    }}
                  >
                    <div className="syllabus-icon">
                      {isDone ? <CheckCircle2 size={18} color="#10b981" /> 
                        : isActive ? <PlayCircle size={18} color="#8b5cf6" />
                        : isUnlocked ? <Unlock size={18} color="#a1a1aa" /> 
                        : <Lock size={18} color="#52525b" />}
                    </div>
                    <div className="syllabus-text">
                      <p>{m.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="syllabus-footer">
              <p>Desarrollado con ❤️ por <strong>Erwin Cortez</strong></p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="theory-sidebar"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="module-header">
          <div className="flex-between" style={{ alignItems: 'flex-start' }}>
            <div>
              <span className="module-number">Módulo {module.id}</span>
              <h2>{module.title}</h2>
            </div>
            {!isSyllabusOpen && (
              <button className="icon-btn" onClick={() => setIsSyllabusOpen(true)} title="Mostrar Temario">
                <PanelLeftOpen size={24} color="var(--accent-primary)" />
              </button>
            )}
          </div>
          <p className="module-desc" style={{ marginTop: '0.5rem' }}>{module.description}</p>
        </div>

        <div className="theory-content">
          <ReactMarkdown>{module.theory}</ReactMarkdown>
        </div>

        <div className="task-card glass-card">
          <h3>{module.task.title}</h3>
          <p>{module.task.instruction}</p>
          
          {isCompleted && (
            <motion.div 
              className="completion-status"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <CheckCircle2 color="#10b981" size={24} />
              <span>{module.task.successMessage}</span>
            </motion.div>
          )}
        </div>

        <button 
          className={`btn-primary next-btn ${!isCompleted ? 'disabled' : ''}`}
          onClick={nextModule}
          disabled={!isCompleted}
        >
          {currentModuleId === courseModules.length ? 'Ir al Quiz' : 'Siguiente Módulo'} <ArrowRight size={20} />
        </button>
      </motion.div>

      <motion.div 
        className="simulator-area"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <Simulator 
          initialCode={module.task.initialCode} 
          onValidate={handleValidate}
        />
      </motion.div>
    </div>
  );
}
