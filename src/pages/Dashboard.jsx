import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trophy, LogOut, Download, Award, BarChart2, BookOpen, Plus, Edit3, Trash2, X, PlusCircle, Trash, Save, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import './Dashboard.css';

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('progress'); // 'progress', 'quiz', or 'modules'
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  // Load modules CRUD actions from Zustand store
  const modules = useStore(state => state.modules);
  const loadingModules = useStore(state => state.loadingModules);
  const fetchModules = useStore(state => state.fetchModules);
  const addModule = useStore(state => state.addModule);
  const updateModule = useStore(state => state.updateModule);
  const deleteModule = useStore(state => state.deleteModule);

  // Form & Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null); // null if adding
  const [formError, setFormError] = useState('');
  
  // Module form fields
  const [formData, setFormData] = useState({
    id: 1,
    title: '',
    description: '',
    theory: '',
    task: {
      title: '',
      instruction: '',
      initialCode: '',
      successMessage: '',
      validationRules: [{ pattern: '', flags: 'si', negated: false }]
    }
  });

  useEffect(() => {
    // 1. Query quiz results
    const qQuiz = query(collection(db, 'quiz_results'), orderBy('timestamp', 'desc'));
    const unsubscribeQuiz = onSnapshot(qQuiz, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResults(data);
    });

    // 2. Query students list
    const qStudents = query(collection(db, 'users'), where('role', '==', 'student'));
    const unsubscribeStudents = onSnapshot(qStudents, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(data);
    });

    // 3. Fetch modules list
    fetchModules();

    return () => {
      unsubscribeQuiz();
      unsubscribeStudents();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // CSV Downloader logic...
  const downloadQuizCSV = () => {
    if (results.length === 0) return;
    const headers = ['Alumno', 'Email', 'Puntaje (%)', 'Aciertos', 'Total Preguntas', 'Fecha de Termino'];
    const csvRows = results.map(r => {
      const dateStr = r.timestamp ? new Date(r.timestamp.toDate()).toLocaleString() : 'N/A';
      return `"${r.studentName}","${r.studentEmail}",${r.score},${r.rawScore},${r.totalQuestions},"${dateStr}"`;
    });
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); 
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `notas_quiz_academia_tarapaca_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadProgressCSV = () => {
    if (students.length === 0) return;
    const headers = ['Alumno', 'Email', 'Ultimo Modulo Desbloqueado', 'Desafios Completados', 'Fecha Registro'];
    const csvRows = students.map(s => {
      const maxModule = s.unlockedModules ? Math.max(...s.unlockedModules) : 1;
      const challengesCount = s.completedChallenges ? s.completedChallenges.length : 0;
      const dateStr = s.createdAt ? new Date(s.createdAt.toDate()).toLocaleString() : 'N/A';
      return `"${s.name}","${s.email}",${maxModule},${challengesCount},"${dateStr}"`;
    });
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); 
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `avance_alumnos_academia_tarapaca_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Modal logic for Add / Edit
  const openAddModal = () => {
    setEditingModule(null);
    setFormError('');
    setFormData({
      id: modules.length > 0 ? Math.max(...modules.map(m => m.id)) + 1 : 1,
      title: '',
      description: '',
      theory: '',
      task: {
        title: '',
        instruction: '',
        initialCode: '',
        successMessage: '',
        validationRules: [{ pattern: '', flags: 'si', negated: false }]
      }
    });
    setIsModalOpen(true);
  };

  const openEditModal = (mod) => {
    setEditingModule(mod);
    setFormError('');
    setFormData({
      id: mod.id,
      title: mod.title,
      description: mod.description,
      theory: mod.theory,
      task: {
        title: mod.task.title || '',
        instruction: mod.task.instruction || '',
        initialCode: mod.task.initialCode || '',
        successMessage: mod.task.successMessage || '',
        validationRules: mod.task.validationRules ? [...mod.task.validationRules] : [{ pattern: '', flags: 'si', negated: false }]
      }
    });
    setIsModalOpen(true);
  };

  const handleDeleteModule = async (moduleId, title) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el módulo "${title}"?`)) {
      await deleteModule(moduleId);
    }
  };

  // Validation rules helpers
  const handleRuleChange = (index, field, value) => {
    const updatedRules = [...formData.task.validationRules];
    updatedRules[index] = {
      ...updatedRules[index],
      [field]: value
    };
    setFormData({
      ...formData,
      task: {
        ...formData.task,
        validationRules: updatedRules
      }
    });
  };

  const addRuleField = () => {
    setFormData({
      ...formData,
      task: {
        ...formData.task,
        validationRules: [...formData.task.validationRules, { pattern: '', flags: 'si', negated: false }]
      }
    });
  };

  const removeRuleField = (index) => {
    const updatedRules = formData.task.validationRules.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      task: {
        ...formData.task,
        validationRules: updatedRules.length > 0 ? updatedRules : [{ pattern: '', flags: 'si', negated: false }]
      }
    });
  };

  // Submit Modal Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Client-side validations
    if (!formData.title || !formData.description || !formData.theory) {
      setFormError('Por favor completa todos los campos del módulo.');
      return;
    }
    if (!formData.task.title || !formData.task.instruction) {
      setFormError('Por favor completa los campos del desafío.');
      return;
    }

    const invalidRule = formData.task.validationRules.some(r => !r.pattern);
    if (invalidRule) {
      setFormError('Todas las reglas de validación deben tener una expresión regular.');
      return;
    }

    // Prepare cleaned data
    const cleanedModule = {
      id: Number(formData.id),
      title: formData.title,
      description: formData.description,
      theory: formData.theory,
      task: {
        title: formData.task.title,
        instruction: formData.task.instruction,
        initialCode: formData.task.initialCode,
        successMessage: formData.task.successMessage || '¡Desafío completado con éxito!',
        validationRules: formData.task.validationRules
      }
    };

    if (editingModule) {
      await updateModule(editingModule.id, cleanedModule);
    } else {
      // Check if ID already exists
      if (modules.some(m => m.id === cleanedModule.id)) {
        setFormError(`El ID de Módulo ${cleanedModule.id} ya existe. Elige otro ID.`);
        return;
      }
      await addModule(cleanedModule);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-container container">
      <div className="dashboard-header flex-between">
        <div>
          <h1>Panel del Profesor</h1>
          <p className="text-muted">Gestión de Progreso y Contenidos - Academia Tarapacá</p>
        </div>
        <div className="user-controls flex-center" style={{ gap: '1rem' }}>
          <span>Hola, {currentUser?.name || 'Profesor'}</span>
          <button className="btn-secondary" onClick={handleLogout}>
            <LogOut size={18} /> Salir
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="glass-card stat-card">
          <Users size={32} color="var(--accent-primary)" />
          <div className="stat-info">
            <h3>{students.length}</h3>
            <p>Alumnos Registrados</p>
          </div>
        </div>
        <div className="glass-card stat-card">
          <Award size={32} color="#8b5cf6" />
          <div className="stat-info">
            <h3>{results.length}</h3>
            <p>Quizzes Completados</p>
          </div>
        </div>
        <div className="glass-card stat-card">
          <Trophy size={32} color="#10b981" />
          <div className="stat-info">
            <h3>
              {results.length > 0 
                ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length)
                : 0}%
            </h3>
            <p>Promedio del Quiz</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs-container">
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            <BarChart2 size={18} /> Avance del Curso ({students.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <Trophy size={18} /> Calificaciones del Quiz ({results.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'modules' ? 'active' : ''}`}
            onClick={() => setActiveTab('modules')}
          >
            <BookOpen size={18} /> Contenidos del Curso ({modules.length})
          </button>
        </div>

        {activeTab === 'progress' && (
          <button 
            className="btn-primary" 
            onClick={downloadProgressCSV}
            disabled={students.length === 0}
            style={{ fontSize: '0.875rem' }}
          >
            <Download size={18} /> Descargar Reporte de Avance
          </button>
        )}
        {activeTab === 'quiz' && (
          <button 
            className="btn-primary" 
            onClick={downloadQuizCSV}
            disabled={results.length === 0}
            style={{ fontSize: '0.875rem' }}
          >
            <Download size={18} /> Descargar Calificaciones
          </button>
        )}
        {activeTab === 'modules' && (
          <button 
            className="btn-primary" 
            onClick={openAddModal}
            style={{ fontSize: '0.875rem' }}
          >
            <Plus size={18} /> Agregar Módulo
          </button>
        )}
      </div>

      {/* RENDER ACTIVE TAB VIEW */}
      {activeTab === 'progress' && (
        <div className="glass-card table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Email</th>
                <th>Módulo Más Alto</th>
                <th>Desafíos Listos</th>
                <th>Primer Ingreso</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center" style={{ padding: '2rem' }}>
                    Aún no hay alumnos registrados en el curso.
                  </td>
                </tr>
              ) : (
                students.map(s => {
                  const maxModule = s.unlockedModules ? Math.max(...s.unlockedModules) : 1;
                  const challengesCount = s.completedChallenges ? s.completedChallenges.length : 0;
                  return (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong></td>
                      <td className="text-muted">{s.email}</td>
                      <td>
                        <span className="module-badge">
                          Módulo {maxModule} de {modules.length}
                        </span>
                      </td>
                      <td>
                        <span className="challenges-badge">
                          {challengesCount} completados
                        </span>
                      </td>
                      <td className="text-muted">
                        {s.createdAt ? new Date(s.createdAt.toDate()).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="glass-card table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Email</th>
                <th>Puntaje</th>
                <th>Fecha de Término</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center" style={{ padding: '2rem' }}>
                    Aún no hay resultados de exámenes.
                  </td>
                </tr>
              ) : (
                results.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.studentName}</strong></td>
                    <td className="text-muted">{r.studentEmail}</td>
                    <td>
                      <span className={`score-badge ${r.score >= 60 ? 'pass' : 'fail'}`}>
                        {r.score}%
                      </span>
                    </td>
                    <td className="text-muted">
                      {r.timestamp ? new Date(r.timestamp.toDate()).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'modules' && (
        <div className="glass-card table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Orden (ID)</th>
                <th>Título del Módulo</th>
                <th>Descripción</th>
                <th>Reglas de Validación</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {modules.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center" style={{ padding: '2rem' }}>
                    Aún no hay módulos creados.
                  </td>
                </tr>
              ) : (
                modules.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>{m.id}</td>
                    <td><strong>{m.title}</strong></td>
                    <td className="text-muted" style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.description}
                    </td>
                    <td>
                      <span className="challenges-badge">
                        {(m.task.validationRules || []).length} Reglas Regex
                      </span>
                    </td>
                    <td>
                      <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'center' }}>
                        <button className="btn-secondary" style={{ padding: '0.4rem' }} onClick={() => openEditModal(m)} title="Editar Módulo">
                          <Edit3 size={16} />
                        </button>
                        <button className="btn-secondary" style={{ padding: '0.4rem', borderColor: 'rgba(239,68,68,0.3)', color: '#f87171' }} onClick={() => handleDeleteModule(m.id, m.title)} title="Eliminar Módulo">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* DYNAMIC FORM MODAL (ADD / EDIT) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay flex-center">
            <motion.div 
              className="modal-content glass-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem' }}
            >
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h2>{editingModule ? 'Editar Módulo' : 'Nuevo Módulo de Curso'}</h2>
                <button className="icon-btn" onClick={() => setIsModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              {formError && (
                <div className="form-error-banner flex-center" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', gap: '0.5rem' }}>
                  <HelpCircle size={18} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="crud-form">
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="input-group">
                    <label>ID</label>
                    <input 
                      type="number" 
                      value={formData.id} 
                      onChange={(e) => setFormData({ ...formData, id: parseInt(e.target.value) })}
                      required
                      min="1"
                    />
                  </div>
                  <div className="input-group">
                    <label>Título del Módulo</label>
                    <input 
                      type="text" 
                      placeholder="Ej: 1. La Estructura Base de la Web"
                      value={formData.title} 
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Descripción Corta</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Conoce las etiquetas fundamentales..."
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group" style={{ marginBottom: '2rem' }}>
                  <label>Contenido Teórico (Markdown)</label>
                  <textarea 
                    rows={8}
                    placeholder="# Titulo de la Teoría&#10;Aquí explicas los conceptos clave..."
                    value={formData.theory} 
                    onChange={(e) => setFormData({ ...formData, theory: e.target.value })}
                    required
                    style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Trophy size={20} /> Configuración del Desafío Práctico
                  </h3>

                  <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Título del Desafío</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Desafío: Construye el ADN"
                      value={formData.task.title} 
                      onChange={(e) => setFormData({
                        ...formData,
                        task: { ...formData.task, title: e.target.value }
                      })}
                      required
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Instrucciones de Desafío</label>
                    <textarea 
                      rows={3}
                      placeholder="Describe qué código debe escribir el alumno para pasar..."
                      value={formData.task.instruction} 
                      onChange={(e) => setFormData({
                        ...formData,
                        task: { ...formData.task, instruction: e.target.value }
                      })}
                      required
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Código Inicial del Simulador</label>
                    <textarea 
                      rows={5}
                      placeholder="<!DOCTYPE html>&#10;<html>..."
                      value={formData.task.initialCode} 
                      onChange={(e) => setFormData({
                        ...formData,
                        task: { ...formData.task, initialCode: e.target.value }
                      })}
                      style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: '2rem' }}>
                    <label>Mensaje de Éxito al Completar</label>
                    <input 
                      type="text" 
                      placeholder="Ej: ¡Perfecto! Has creado los cimientos de la web."
                      value={formData.task.successMessage} 
                      onChange={(e) => setFormData({
                        ...formData,
                        task: { ...formData.task, successMessage: e.target.value }
                      })}
                    />
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                      <h4 style={{ margin: 0 }}>Reglas de Validación Regex</h4>
                      <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={addRuleField}>
                        <PlusCircle size={14} /> Agregar Regla
                      </button>
                    </div>

                    <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
                      El código enviado por el alumno debe cumplir con todas estas reglas de Expresión Regular para ser validado.
                    </p>

                    {formData.task.validationRules.map((rule, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 80px auto auto', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <input 
                          type="text" 
                          placeholder="Expresión (ej: <header> o display:\\s*flex)" 
                          value={rule.pattern} 
                          onChange={(e) => handleRuleChange(idx, 'pattern', e.target.value)}
                          required
                          style={{ fontFamily: 'monospace', fontSize: '0.85rem', padding: '0.5rem' }}
                        />
                        <input 
                          type="text" 
                          placeholder="Flags (ej: si)" 
                          value={rule.flags || 'si'} 
                          onChange={(e) => handleRuleChange(idx, 'flags', e.target.value)}
                          style={{ fontFamily: 'monospace', fontSize: '0.85rem', padding: '0.5rem' }}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', cursor: 'pointer', margin: 0 }}>
                          <input 
                            type="checkbox" 
                            checked={rule.negated} 
                            onChange={(e) => handleRuleChange(idx, 'negated', e.target.checked)}
                          /> Negado
                        </label>
                        <button type="button" className="icon-btn" onClick={() => removeRuleField(idx)} style={{ color: '#ef4444' }}>
                          <Trash size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    <Save size={18} /> Guardar Cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
