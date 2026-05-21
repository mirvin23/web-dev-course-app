import { useState, useEffect, useRef } from 'react';
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
  const savedCode = useStore(state => state.savedCode);
  const saveCode = useStore(state => state.saveCode);
  const debounceTimer = useRef(null);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    fetchModules();
  }, []);

  const groupedModules = modules.reduce((acc, m) => {
    const section = m.section || 'Contenidos Básicos';
    const cat = m.category || 'General';
    if (!acc[section]) acc[section] = {};
    if (!acc[section][cat]) acc[section][cat] = [];
    acc[section][cat].push(m);
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
    // Immediate save on validate
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    saveCode(currentModuleId, code);
    setSaveStatus('Guardado');
    setTimeout(() => setSaveStatus(''), 2000);

    const isValid = validateCode(code, module.task.validationRules);
    if (isValid && !isCompleted) {
      completeChallenge(currentModuleId);
      unlockModule(currentModuleId + 1);
    }
    return isValid;
  };

  const handleCodeChange = (code) => {
    setSaveStatus('Guardando...');
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      saveCode(currentModuleId, code);
      setSaveStatus('Guardado en la nube');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1500); // Debounce to avoid hitting Firebase quota too often
  };

  const nextModule = () => {
    const currentCat = module?.category || 'HTML';
    const currentSection = module?.section || 'Contenidos Básicos';
    const nextMod = modules.find(m => m.id === currentModuleId + 1);

    if (nextMod) {
      if (nextMod.category === currentCat && nextMod.section === currentSection) {
        navigate(`/course/${currentModuleId + 1}`);
      } else {
        navigate(`/quiz/${currentCat}`);
      }
    } else {
      navigate(`/quiz/${currentCat}`);
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
              {Object.entries(groupedModules).map(([section, categories]) => (
                <div key={section} className="syllabus-section-group" style={{ marginBottom: '1.5rem' }}>
                  <h3 className="section-title" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', color: section === 'Proyecto STEAM' ? '#c4b5fd' : '#6ee7b7', borderLeft: `4px solid ${section === 'Proyecto STEAM' ? '#8b5cf6' : '#10b981'}`, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {section}
                  </h3>
                  
                  {Object.entries(categories).map(([category, categoryModules]) => {
                    const lastModuleInCat = categoryModules[categoryModules.length - 1];
                    const isQuizUnlocked = completedChallenges.includes(lastModuleInCat.id);
                    
                    return (
                      <div key={category} className="syllabus-category" style={{ paddingLeft: '0.5rem' }}>
                        <h4 className="category-title" style={{ fontSize: '0.75rem', opacity: 0.8 }}>{category}</h4>
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
                          className={`syllabus-item quiz-item ${!isQuizUnlocked ? 'locked' : ''}`}
                          onClick={() => {
                            if (isQuizUnlocked) navigate(`/quiz/${category}`);
                          }}
                          style={{ background: 'rgba(168, 85, 247, 0.05)', borderLeftColor: '#a855f7', marginTop: '0.5rem', marginBottom: '1rem' }}
                        >
                          <div className="syllabus-icon">
                            {isQuizUnlocked ? <Trophy size={18} color="#a855f7" /> : <Lock size={18} color="#52525b" />}
                          </div>
                          <div className="syllabus-text">
                            <p style={{ fontWeight: 'bold', color: isQuizUnlocked ? '#a855f7' : 'var(--text-muted)' }}>Quiz Final de {category}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
          <div className="flex-between" style={{ alignItems: 'flex-start' }}>
            <h3>{module.task.title}</h3>
            {saveStatus && <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', opacity: 0.8 }}>{saveStatus}</span>}
          </div>
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
          initialCode={savedCode[currentModuleId] !== undefined ? savedCode[currentModuleId] : module.task.initialCode} 
          onValidate={handleValidate}
          onCodeChange={handleCodeChange}
        />
      </motion.div>
    </div>
  );
}
