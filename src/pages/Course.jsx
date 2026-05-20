import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Lock, Unlock, PlayCircle, PanelLeftClose, PanelLeftOpen, Loader2, Trophy } from 'lucide-react';
import Simulator from '../components/Simulator';
import useStore, { validateCode } from '../store/useStore';
import ReactMarkdown from 'react-markdown';
import './Course.css';

export default function Course() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(true);
  const currentModuleId = parseInt(moduleId);
  
  const modules = useStore(state => state.modules);
  const loadingModules = useStore(state => state.loadingModules);
  const fetchModules = useStore(state => state.fetchModules);
  
  const unlockModule = useStore(state => state.unlockModule);
  const completeChallenge = useStore(state => state.completeChallenge);
  const completedChallenges = useStore(state => state.completedChallenges);
  const unlockedModules = useStore(state => state.unlockedModules);

  useEffect(() => {
    fetchModules();
  }, []);

  const groupedModules = modules.reduce((acc, m) => {
    const cat = m.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(m);
    return acc;
  }, {});

  const module = modules.find(m => m.id === currentModuleId);

  if (loadingModules) {
    return (
      <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '1rem', background: 'var(--bg-dark)' }}>
        <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
        <p className="text-muted">Cargando temario interactivo...</p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '1rem', background: 'var(--bg-dark)' }}>
        <p className="text-muted">Módulo no encontrado</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Volver al Inicio</button>
      </div>
    );
  }

  const isCompleted = completedChallenges.includes(currentModuleId);

  const handleValidate = (code) => {
    const isValid = validateCode(code, module.task.validationRules);
    if (isValid && !isCompleted) {
      completeChallenge(currentModuleId);
      unlockModule(currentModuleId + 1);
    }
    return isValid;
  };

  const nextModule = () => {
    if (currentModuleId < modules.length) {
      navigate(`/course/${currentModuleId + 1}`);
    } else {
      navigate('/quiz');
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
              {Object.entries(groupedModules).map(([category, categoryModules]) => (
                <div key={category} className="syllabus-category">
                  <h4 className="category-title">{category}</h4>
                  {categoryModules.map((m) => {
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
                  
                  {/* Category Quiz Link */}
                  <div 
                    className="syllabus-item quiz-item"
                    onClick={() => navigate(`/quiz/${category}`)}
                    style={{ background: 'rgba(168, 85, 247, 0.05)', borderLeftColor: '#a855f7', marginTop: '0.5rem', marginBottom: '1rem' }}
                  >
                    <div className="syllabus-icon">
                      <Trophy size={18} color="#a855f7" />
                    </div>
                    <div className="syllabus-text">
                      <p style={{ fontWeight: 'bold', color: '#a855f7' }}>Quiz Final de {category}</p>
                    </div>
                  </div>
                </div>
              ))}
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
          {currentModuleId === modules.length ? 'Ir al Quiz' : 'Siguiente Módulo'} <ArrowRight size={20} />
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
