import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Users, Trophy, Clock, LogOut, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'quiz_results'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResults(data);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const downloadCSV = () => {
    if (results.length === 0) return;

    const headers = ['Alumno', 'Email', 'Puntaje (%)', 'Aciertos', 'Total Preguntas', 'Fecha de Termino'];
    
    const csvRows = results.map(r => {
      const dateStr = r.timestamp ? new Date(r.timestamp.toDate()).toLocaleString() : 'N/A';
      return `"${r.studentName}","${r.studentEmail}",${r.score},${r.rawScore},${r.totalQuestions},"${dateStr}"`;
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    
    // Add BOM for Excel UTF-8 compatibility
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); 
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `notas_academia_tarapaca_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-container container">
      <div className="dashboard-header flex-between">
        <div>
          <h1>Panel del Profesor</h1>
          <p className="text-muted">Resultados del Quiz Final - Academia Tarapacá</p>
        </div>
        <div className="user-controls flex-center" style={{ gap: '1rem' }}>
          <span>Hola, {currentUser?.name || 'Profesor'}</span>
          <button 
            className="btn-primary" 
            onClick={downloadCSV}
            disabled={results.length === 0}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            <Download size={18} /> Descargar Notas
          </button>
          <button className="btn-secondary" onClick={handleLogout}>
            <LogOut size={18} /> Salir
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="glass-card stat-card">
          <Users size={32} color="var(--accent-primary)" />
          <div className="stat-info">
            <h3>{results.length}</h3>
            <p>Alumnos Evaluados</p>
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
            <p>Promedio del Curso</p>
          </div>
        </div>
      </div>

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
                  Aún no hay resultados de alumnos.
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
    </div>
  );
}
