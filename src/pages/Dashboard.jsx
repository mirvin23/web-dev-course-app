import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Users, Trophy, Clock, LogOut, Download, Award, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('progress'); // 'progress' or 'quiz'
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

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

    return () => {
      unsubscribeQuiz();
      unsubscribeStudents();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

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

  return (
    <div className="dashboard-container container">
      <div className="dashboard-header flex-between">
        <div>
          <h1>Panel del Profesor</h1>
          <p className="text-muted">Gestión de Progreso y Evaluaciones - Academia Tarapacá</p>
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
        </div>

        {activeTab === 'progress' ? (
          <button 
            className="btn-primary" 
            onClick={downloadProgressCSV}
            disabled={students.length === 0}
            style={{ fontSize: '0.875rem' }}
          >
            <Download size={18} /> Descargar Reporte de Avance
          </button>
        ) : (
          <button 
            className="btn-primary" 
            onClick={downloadQuizCSV}
            disabled={results.length === 0}
            style={{ fontSize: '0.875rem' }}
          >
            <Download size={18} /> Descargar Calificaciones
          </button>
        )}
      </div>

      {activeTab === 'progress' ? (
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
                          Módulo {maxModule} de 15
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
      ) : (
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
    </div>
  );
}
