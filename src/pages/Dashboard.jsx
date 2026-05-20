import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trophy, LogOut, Download, Award, BarChart2, BookOpen, Plus, Edit3, Trash2, X, PlusCircle, Trash, Save, HelpCircle, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import './Dashboard.css';

// Helper to safely format Firestore timestamps, JS dates, or null
const formatDate = (val, locale = false) => {
  if (!val) return '-';
  try {
    // Firestore Timestamp objects have a .toDate() method
    const date = typeof val.toDate === 'function' ? val.toDate() : new Date(val);
    return locale ? date.toLocaleString() : date.toLocaleDateString();
  } catch {
    return '-';
  }
};

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

  // Load quiz questions CRUD actions from Zustand store
  const quizQuestions = useStore(state => state.quizQuestions);
  const loadingQuizQuestions = useStore(state => state.loadingQuizQuestions);
  const fetchQuizQuestions = useStore(state => state.fetchQuizQuestions);
  const addQuizQuestion = useStore(state => state.addQuizQuestion);
  const updateQuizQuestion = useStore(state => state.updateQuizQuestion);
  const deleteQuizQuestion = useStore(state => state.deleteQuizQuestion);

  // Form & Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null); // null if adding
  const [formError, setFormError] = useState('');

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizFormError, setQuizFormError] = useState('');
  
  // Preview Modals
  const [previewModule, setPreviewModule] = useState(null);
  const [previewQuiz, setPreviewQuiz] = useState(null);
  
  // Module form fields
  const [formData, setFormData] = useState({
    id: 1,
    category: 'HTML',
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

  const [quizFormData, setQuizFormData] = useState({
    id: 1,
    category: 'HTML',
    type: 'multiple_choice',
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    isTrue: true,
    correctOrder: ['', '', ''],
    pairs: [{term: '', definition: ''}]
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
    
    // 4. Fetch quiz questions list
    fetchQuizQuestions();

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
      const dateStr = formatDate(s.createdAt, true) || 'N/A';
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
      category: 'HTML',
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
      category: mod.category || 'HTML',
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
      category: formData.category,
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

  // Quiz Modal Logic
  const openAddQuizModal = () => {
    setEditingQuiz(null);
    setQuizFormError('');
    setQuizFormData({
      id: quizQuestions.length > 0 ? Math.max(...quizQuestions.map(q => q.id)) + 1 : 1,
      category: 'HTML',
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      isTrue: true,
      correctOrder: ['', '', ''],
      pairs: [{term: '', definition: ''}]
    });
    setIsQuizModalOpen(true);
  };

  const openEditQuizModal = (q) => {
    setEditingQuiz(q);
    setQuizFormError('');
    setQuizFormData({
      id: q.id,
      category: q.category || 'HTML',
      type: q.type || 'multiple_choice',
      question: q.question || '',
      options: q.options ? [...q.options] : ['', '', '', ''],
      correctIndex: q.correctIndex || 0,
      isTrue: q.isTrue !== undefined ? q.isTrue : true,
      correctOrder: q.correctOrder ? [...q.correctOrder] : ['', '', ''],
      pairs: q.pairs ? [...q.pairs] : [{term: '', definition: ''}]
    });
    setIsQuizModalOpen(true);
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar esta pregunta?`)) {
      await deleteQuizQuestion(id);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setQuizFormError('');

    if (!quizFormData.question.trim()) {
      setQuizFormError('Por favor ingresa la pregunta.');
      return;
    }

    const cleanedQuiz = {
      id: Number(quizFormData.id),
      category: quizFormData.category,
      type: quizFormData.type,
      question: quizFormData.question
    };

    if (quizFormData.type === 'multiple_choice') {
      cleanedQuiz.options = quizFormData.options;
      cleanedQuiz.correctIndex = Number(quizFormData.correctIndex);
    } else if (quizFormData.type === 'true_false') {
      cleanedQuiz.isTrue = quizFormData.isTrue;
    } else if (quizFormData.type === 'ordering') {
      cleanedQuiz.correctOrder = quizFormData.correctOrder;
    } else if (quizFormData.type === 'drag_and_drop') {
      cleanedQuiz.pairs = quizFormData.pairs;
    }

    if (editingQuiz) {
      await updateQuizQuestion(cleanedQuiz.id, cleanedQuiz);
    } else {
      await addQuizQuestion(cleanedQuiz);
    }
    
    setIsQuizModalOpen(false);
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
          <button 
            className={`tab-btn ${activeTab === 'quiz_creator' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz_creator')}
          >
            <Edit3 size={18} /> Gestor de Quizzes ({quizQuestions.length})
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
        {activeTab === 'quiz_creator' && (
          <button 
            className="btn-primary" 
            onClick={openAddQuizModal}
            style={{ fontSize: '0.875rem' }}
          >
            <Plus size={18} /> Agregar Pregunta
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
                        {formatDate(s.createdAt)}
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
                        <button className="btn-secondary" style={{ padding: '0.4rem', color: '#3b82f6', borderColor: 'rgba(59,130,246,0.3)' }} onClick={() => setPreviewModule(m)} title="Vista Previa">
                          <Eye size={16} />
                        </button>
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

      {activeTab === 'quiz_creator' && (
        <div className="glass-card table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Pregunta</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {quizQuestions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center" style={{ padding: '2rem' }}>
                    Aún no hay preguntas creadas.
                  </td>
                </tr>
              ) : (
                quizQuestions.map(q => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>{q.id}</td>
                    <td><span className="module-badge">{q.category}</span></td>
                    <td className="text-muted">{q.type}</td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {q.question}
                    </td>
                    <td>
                      <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'center' }}>
                        <button className="btn-secondary" style={{ padding: '0.4rem', color: '#3b82f6', borderColor: 'rgba(59,130,246,0.3)' }} onClick={() => setPreviewQuiz(q)} title="Vista Previa">
                          <Eye size={16} />
                        </button>
                        <button className="btn-secondary" style={{ padding: '0.4rem' }} onClick={() => openEditQuizModal(q)} title="Editar Pregunta">
                          <Edit3 size={16} />
                        </button>
                        <button className="btn-secondary" style={{ padding: '0.4rem', borderColor: 'rgba(239,68,68,0.3)', color: '#f87171' }} onClick={() => handleDeleteQuiz(q.id)} title="Eliminar Pregunta">
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
                    <label>Categoría</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="HTML">HTML</option>
                      <option value="CSS">CSS</option>
                      <option value="JavaScript">JavaScript</option>
                    </select>
                  </div>
                </div>
                <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Título del Módulo</label>
                  <input 
                    type="text" 
                    placeholder="Ej: 1. La Estructura Base de la Web"
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
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

      {/* QUIZ FORM MODAL */}
      <AnimatePresence>
        {isQuizModalOpen && (
          <div className="modal-overlay flex-center">
            <motion.div 
              className="modal-content glass-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem' }}
            >
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h2>{editingQuiz ? 'Editar Pregunta' : 'Nueva Pregunta de Quiz'}</h2>
                <button className="icon-btn" onClick={() => setIsQuizModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              {quizFormError && (
                <div className="form-error-banner flex-center" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', gap: '0.5rem' }}>
                  <HelpCircle size={18} />
                  <span>{quizFormError}</span>
                </div>
              )}

              <form onSubmit={handleQuizSubmit} className="crud-form">
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="input-group">
                    <label>ID</label>
                    <input 
                      type="number" 
                      value={quizFormData.id} 
                      onChange={(e) => setQuizFormData({ ...quizFormData, id: parseInt(e.target.value) })}
                      required
                      min="1"
                    />
                  </div>
                  <div className="input-group">
                    <label>Categoría</label>
                    <select
                      value={quizFormData.category}
                      onChange={(e) => setQuizFormData({ ...quizFormData, category: e.target.value })}
                    >
                      <option value="HTML">HTML</option>
                      <option value="CSS">CSS</option>
                      <option value="JavaScript">JavaScript</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Tipo de Pregunta</label>
                    <select
                      value={quizFormData.type}
                      onChange={(e) => setQuizFormData({ ...quizFormData, type: e.target.value })}
                    >
                      <option value="multiple_choice">Alternativas</option>
                      <option value="true_false">Verdadero / Falso</option>
                      <option value="ordering">Ordenar</option>
                      <option value="drag_and_drop">Drag & Drop (Asociar)</option>
                    </select>
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Pregunta</label>
                  <input 
                    type="text" 
                    placeholder="Escribe la pregunta aquí..."
                    value={quizFormData.question} 
                    onChange={(e) => setQuizFormData({ ...quizFormData, question: e.target.value })}
                    required
                  />
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Edit3 size={20} /> Configuración de Respuestas
                  </h3>

                  {quizFormData.type === 'multiple_choice' && (
                    <div className="quiz-options-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {quizFormData.options.map((opt, i) => (
                        <div key={i} className="flex-center" style={{ gap: '1rem' }}>
                          <input type="radio" name="correctOpt" checked={quizFormData.correctIndex === i} onChange={() => setQuizFormData({ ...quizFormData, correctIndex: i })} />
                          <input type="text" style={{ flex: 1 }} value={opt} onChange={(e) => {
                            const newOpts = [...quizFormData.options];
                            newOpts[i] = e.target.value;
                            setQuizFormData({ ...quizFormData, options: newOpts });
                          }} placeholder={`Opción ${i+1}`} required />
                        </div>
                      ))}
                    </div>
                  )}

                  {quizFormData.type === 'true_false' && (
                    <div className="input-group">
                      <label>Respuesta Correcta</label>
                      <select value={quizFormData.isTrue ? "true" : "false"} onChange={(e) => setQuizFormData({ ...quizFormData, isTrue: e.target.value === "true" })}>
                        <option value="true">Verdadero</option>
                        <option value="false">Falso</option>
                      </select>
                    </div>
                  )}

                  {quizFormData.type === 'ordering' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <p className="text-muted" style={{ fontSize: '0.8rem' }}>Ingresa los elementos en el ORDEN CORRECTO (de arriba a abajo):</p>
                      {quizFormData.correctOrder.map((step, i) => (
                        <div key={i} className="flex-center" style={{ gap: '1rem' }}>
                          <span style={{ color: 'var(--accent-primary)' }}>{i+1}.</span>
                          <input type="text" style={{ flex: 1 }} value={step} onChange={(e) => {
                            const newOrder = [...quizFormData.correctOrder];
                            newOrder[i] = e.target.value;
                            setQuizFormData({ ...quizFormData, correctOrder: newOrder });
                          }} placeholder={`Paso ${i+1}`} required />
                          <button type="button" className="icon-btn" style={{ color: '#f87171' }} onClick={() => {
                            const newOrder = quizFormData.correctOrder.filter((_, idx) => idx !== i);
                            setQuizFormData({ ...quizFormData, correctOrder: newOrder.length ? newOrder : [''] });
                          }}><Trash2 size={16} /></button>
                        </div>
                      ))}
                      <button type="button" className="btn-secondary" style={{ marginTop: '0.5rem', width: 'fit-content' }} onClick={() => setQuizFormData({ ...quizFormData, correctOrder: [...quizFormData.correctOrder, ''] })}>
                        <PlusCircle size={16} /> Añadir Paso
                      </button>
                    </div>
                  )}

                  {quizFormData.type === 'drag_and_drop' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <p className="text-muted" style={{ fontSize: '0.8rem' }}>Ingresa los pares correctos a asociar:</p>
                      {quizFormData.pairs.map((pair, i) => (
                        <div key={i} className="flex-center" style={{ gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <input type="text" value={pair.term} onChange={(e) => {
                              const newPairs = [...quizFormData.pairs];
                              newPairs[i].term = e.target.value;
                              setQuizFormData({ ...quizFormData, pairs: newPairs });
                            }} placeholder="Término (ej. <nav>)" required />
                            <input type="text" value={pair.definition} onChange={(e) => {
                              const newPairs = [...quizFormData.pairs];
                              newPairs[i].definition = e.target.value;
                              setQuizFormData({ ...quizFormData, pairs: newPairs });
                            }} placeholder="Definición (ej. Navegación)" required />
                          </div>
                          <button type="button" className="icon-btn" style={{ color: '#f87171' }} onClick={() => {
                            const newPairs = quizFormData.pairs.filter((_, idx) => idx !== i);
                            setQuizFormData({ ...quizFormData, pairs: newPairs.length ? newPairs : [{term: '', definition: ''}] });
                          }}><Trash2 size={16} /></button>
                        </div>
                      ))}
                      <button type="button" className="btn-secondary" style={{ marginTop: '0.5rem', width: 'fit-content' }} onClick={() => setQuizFormData({ ...quizFormData, pairs: [...quizFormData.pairs, {term: '', definition: ''}] })}>
                        <PlusCircle size={16} /> Añadir Par
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-end" style={{ marginTop: '2rem', gap: '1rem' }}>
                  <button type="button" className="btn-secondary" onClick={() => setIsQuizModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    <Save size={18} /> {editingQuiz ? 'Actualizar Pregunta' : 'Guardar Pregunta'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PREVIEW MODULE MODAL */}
      <AnimatePresence>
        {previewModule && (
          <div className="modal-overlay flex-center">
            <motion.div 
              className="modal-content glass-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem' }}
            >
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Eye size={24} color="#3b82f6" />
                  <h2>Vista Previa: {previewModule.title}</h2>
                </div>
                <button className="icon-btn" onClick={() => setPreviewModule(null)}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <span className="module-badge">{previewModule.category}</span>
                <p className="text-muted" style={{ marginTop: '1rem' }}>{previewModule.description}</p>
              </div>

              <div className="theory-content" style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>Contenido Teórico</h3>
                <ReactMarkdown>{previewModule.theory}</ReactMarkdown>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>Desafío: {previewModule.task.title}</h3>
                <p style={{ marginBottom: '1rem' }}>{previewModule.task.instruction}</p>
                <div style={{ background: '#1e1e1e', padding: '1rem', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', color: '#d4d4d4' }}>
                  {previewModule.task.initialCode || '// Código inicial vacío'}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PREVIEW QUIZ MODAL */}
      <AnimatePresence>
        {previewQuiz && (
          <div className="modal-overlay flex-center">
            <motion.div 
              className="modal-content glass-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem' }}
            >
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Eye size={24} color="#3b82f6" />
                  <h2>Vista Previa de Pregunta</h2>
                </div>
                <button className="icon-btn" onClick={() => setPreviewQuiz(null)}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <span className="module-badge">{previewQuiz.category}</span>
                <span style={{ background: 'var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem' }}>{previewQuiz.type}</span>
              </div>

              <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-main)' }}>{previewQuiz.question}</h2>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                {previewQuiz.type === 'multiple_choice' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {previewQuiz.options.map((opt, i) => (
                      <div key={i} style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: previewQuiz.correctIndex === i ? 'rgba(16,185,129,0.1)' : 'var(--bg-card-hover)', border: previewQuiz.correctIndex === i ? '1px solid #10b981' : '1px solid var(--border-color)' }}>
                        {opt} {previewQuiz.correctIndex === i && <span style={{ float: 'right', color: '#10b981' }}>✓ Correcta</span>}
                      </div>
                    ))}
                  </div>
                )}

                {previewQuiz.type === 'true_false' && (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, textAlign: 'center', padding: '1rem', borderRadius: 'var(--radius-sm)', background: previewQuiz.isTrue ? 'rgba(16,185,129,0.1)' : 'var(--bg-card-hover)', border: previewQuiz.isTrue ? '1px solid #10b981' : '1px solid var(--border-color)' }}>Verdadero</div>
                    <div style={{ flex: 1, textAlign: 'center', padding: '1rem', borderRadius: 'var(--radius-sm)', background: !previewQuiz.isTrue ? 'rgba(16,185,129,0.1)' : 'var(--bg-card-hover)', border: !previewQuiz.isTrue ? '1px solid #10b981' : '1px solid var(--border-color)' }}>Falso</div>
                  </div>
                )}

                {previewQuiz.type === 'ordering' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p className="text-muted" style={{ marginBottom: '1rem' }}>Orden correcto esperado:</p>
                    {previewQuiz.correctOrder.map((step, i) => (
                      <div key={i} style={{ padding: '0.75rem', background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', marginRight: '1rem' }}>{i + 1}.</span> {step}
                      </div>
                    ))}
                  </div>
                )}

                {previewQuiz.type === 'drag_and_drop' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p className="text-muted" style={{ marginBottom: '1rem' }}>Pares correctos esperados:</p>
                    {previewQuiz.pairs.map((pair, i) => (
                      <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                        <strong style={{ flex: 1, color: 'var(--accent-primary)' }}>{pair.term}</strong>
                        <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
                        <span style={{ flex: 1 }}>{pair.definition}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
