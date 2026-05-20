import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, ArrowUp, ArrowDown, Shuffle } from 'lucide-react';
import useStore from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Quiz.css';

// Función para mezclar arreglos (Fisher-Yates)
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function Quiz() {
  const { category } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const quizQuestionsStore = useStore(state => state.quizQuestions);
  const fetchQuizQuestions = useStore(state => state.fetchQuizQuestions);
  const setQuizScore = useStore(state => state.setQuizScore);

  useEffect(() => {
    if (quizQuestionsStore.length === 0) {
      fetchQuizQuestions();
    }
  }, [quizQuestionsStore, fetchQuizQuestions]);

  // Filtrar preguntas por categoría
  const questions = useMemo(() => {
    if (!category) return quizQuestionsStore;
    return quizQuestionsStore.filter(q => q.category.toLowerCase() === category.toLowerCase());
  }, [quizQuestionsStore, category]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // States para diferentes tipos de preguntas
  const [selectedOption, setSelectedOption] = useState(null); // multiple_choice & true_false
  const [currentOrder, setCurrentOrder] = useState([]); // ordering
  const [selectedPairs, setSelectedPairs] = useState({}); // drag_and_drop
  
  // Opciones barajadas (memoizadas para evitar re-renders innecesarios)
  const shuffledDefinitions = useMemo(() => {
    if (questions.length === 0) return [];
    const q = questions[currentQuestion];
    if (q && q.type === 'drag_and_drop') {
      return shuffleArray(q.pairs.map(p => p.definition));
    }
    return [];
  }, [questions, currentQuestion]);

  // Inicializar estados dinámicos al cambiar de pregunta
  useEffect(() => {
    if (questions.length === 0 || currentQuestion >= questions.length) return;
    const q = questions[currentQuestion];
    
    setIsAnswered(false);
    setSelectedOption(null);
    
    if (q.type === 'ordering') {
      setCurrentOrder(shuffleArray(q.correctOrder));
    } else if (q.type === 'drag_and_drop') {
      const initialPairs = {};
      q.pairs.forEach(p => { initialPairs[p.term] = ''; });
      setSelectedPairs(initialPairs);
    }
  }, [currentQuestion, questions]);

  if (questions.length === 0) {
    return (
      <div className="quiz-container flex-center">
        <motion.div className="glass-card quiz-card">
          <h2>Cargando preguntas...</h2>
        </motion.div>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-container flex-center">
        <motion.div 
          className="glass-card quiz-card result-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2>¡Quiz de {category || 'Desarrollo'} Completado!</h2>
          <div className="score-display">
            <span className="score-number">{score}</span>
            <span className="score-total">/ {questions.length}</span>
          </div>
          <p>{percentage >= 60 ? '¡Felicidades, has demostrado tus conocimientos!' : 'Buen intento, te recomendamos repasar un poco más.'}</p>
          <button className="btn-primary" onClick={() => navigate('/course/1')}>
            Volver al Curso <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  // Handlers para respuestas
  const checkAnswer = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    let isCorrect = false;

    if (q.type === 'multiple_choice') {
      isCorrect = selectedOption === q.correctIndex;
    } else if (q.type === 'true_false') {
      const isTrueSelected = selectedOption === 0; // 0 is Verdadero, 1 is Falso
      isCorrect = isTrueSelected === q.isTrue;
    } else if (q.type === 'ordering') {
      isCorrect = currentOrder.join('|') === q.correctOrder.join('|');
    } else if (q.type === 'drag_and_drop') {
      isCorrect = q.pairs.every(p => selectedPairs[p.term] === p.definition);
    }

    if (isCorrect) setScore(s => s + 1);
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    } else {
      const finalScorePercentage = Math.round((score / questions.length) * 100);
      setQuizScore(score);
      setIsSaving(true);
      
      try {
        if (currentUser) {
          await addDoc(collection(db, 'quiz_results'), {
            studentId: currentUser.uid,
            studentName: currentUser.displayName,
            studentEmail: currentUser.email,
            category: category || 'general',
            score: finalScorePercentage,
            rawScore: score,
            totalQuestions: questions.length,
            timestamp: serverTimestamp()
          });
        }
      } catch (error) {
        console.error("Error saving score:", error);
      }
      setIsSaving(false);
      setIsFinished(true);
    }
  };

  // Renderizadores de tipos de pregunta
  const renderMultipleChoice = () => (
    <div className="options-grid">
      {q.options.map((option, index) => {
        let className = "quiz-option";
        if (isAnswered) {
          if (index === q.correctIndex) className += " correct";
          else if (index === selectedOption) className += " incorrect";
        } else if (selectedOption === index) {
          className += " selected";
        }
        return (
          <button 
            key={index} className={className} 
            onClick={() => !isAnswered && setSelectedOption(index)} 
            disabled={isAnswered}
          >
            {option}
            {isAnswered && index === q.correctIndex && <CheckCircle2 size={20} color="#10b981" className="status-icon" />}
            {isAnswered && index === selectedOption && index !== q.correctIndex && <XCircle size={20} color="#ef4444" className="status-icon" />}
          </button>
        );
      })}
    </div>
  );

  const renderTrueFalse = () => {
    const options = ["Verdadero", "Falso"];
    const correctIdx = q.isTrue ? 0 : 1;
    return (
      <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {options.map((option, index) => {
          let className = "quiz-option";
          if (isAnswered) {
            if (index === correctIdx) className += " correct";
            else if (index === selectedOption) className += " incorrect";
          } else if (selectedOption === index) {
            className += " selected";
          }
          return (
            <button key={index} className={className} onClick={() => !isAnswered && setSelectedOption(index)} disabled={isAnswered} style={{ textAlign: 'center', justifyContent: 'center' }}>
              {option}
            </button>
          );
        })}
      </div>
    );
  };

  const renderOrdering = () => {
    const moveItem = (index, dir) => {
      if (isAnswered) return;
      const newOrder = [...currentOrder];
      if (dir === 'up' && index > 0) {
        [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      } else if (dir === 'down' && index < newOrder.length - 1) {
        [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
      }
      setCurrentOrder(newOrder);
    };

    return (
      <div className="ordering-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {currentOrder.map((item, index) => {
          let bg = 'rgba(255,255,255,0.05)';
          let border = '1px solid var(--border-color)';
          if (isAnswered) {
            if (item === q.correctOrder[index]) {
              border = '1px solid #10b981';
              bg = 'rgba(16, 185, 129, 0.1)';
            } else {
              border = '1px solid #ef4444';
              bg = 'rgba(239, 68, 68, 0.1)';
            }
          }
          return (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: bg, border, borderRadius: 'var(--radius-md)', transition: 'all 0.3s ease' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)', minWidth: '20px' }}>{index + 1}.</span>
              <span style={{ flex: 1 }}>{item}</span>
              {!isAnswered && (
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button className="icon-btn" onClick={() => moveItem(index, 'up')} disabled={index === 0}><ArrowUp size={18} /></button>
                  <button className="icon-btn" onClick={() => moveItem(index, 'down')} disabled={index === currentOrder.length - 1}><ArrowDown size={18} /></button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDragAndDrop = () => (
    <div className="drag-drop-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {q.pairs.map((pair, index) => {
        let isCorrect = false;
        if (isAnswered) {
          isCorrect = selectedPairs[pair.term] === pair.definition;
        }
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: isAnswered ? (isCorrect ? '1px solid #10b981' : '1px solid #ef4444') : '1px solid var(--border-color)' }}>
            <strong style={{ flex: 1, color: 'var(--accent-primary)' }}>{pair.term}</strong>
            <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
            <select 
              style={{ flex: 1, padding: '0.5rem', background: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
              value={selectedPairs[pair.term] || ''}
              onChange={(e) => !isAnswered && setSelectedPairs({ ...selectedPairs, [pair.term]: e.target.value })}
              disabled={isAnswered}
            >
              <option value="" disabled>Selecciona definición...</option>
              {shuffledDefinitions.map((def, i) => (
                <option key={i} value={def}>{def}</option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="quiz-container flex-center">
      <AnimatePresence mode="wait">
        <motion.div 
          className="glass-card quiz-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          key={currentQuestion}
        >
          <div className="quiz-header">
            <span>{category ? `Quiz de ${category}` : 'Quiz Final'}</span>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem' }}>
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>
          </div>
          
          <h2 className="question-text">{q.question}</h2>
          
          <div className="question-content" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            {q.type === 'multiple_choice' && renderMultipleChoice()}
            {q.type === 'true_false' && renderTrueFalse()}
            {q.type === 'ordering' && renderOrdering()}
            {q.type === 'drag_and_drop' && renderDragAndDrop()}
          </div>

          {!isAnswered ? (
            <motion.div className="next-btn-container">
              <button 
                className="btn-primary" 
                onClick={checkAnswer}
                disabled={
                  (q.type === 'multiple_choice' && selectedOption === null) ||
                  (q.type === 'true_false' && selectedOption === null) ||
                  (q.type === 'drag_and_drop' && Object.values(selectedPairs).some(v => v === ''))
                }
              >
                Responder
              </button>
            </motion.div>
          ) : (
            <motion.div className="next-btn-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-main)' }}>
                  {(() => {
                    if (q.type === 'multiple_choice') return selectedOption === q.correctIndex ? '¡Correcto!' : 'Incorrecto.';
                    if (q.type === 'true_false') return (selectedOption === 0) === q.isTrue ? '¡Correcto!' : 'Incorrecto.';
                    if (q.type === 'ordering') return currentOrder.join('|') === q.correctOrder.join('|') ? '¡Orden Correcto!' : 'El orden es incorrecto.';
                    if (q.type === 'drag_and_drop') return q.pairs.every(p => selectedPairs[p.term] === p.definition) ? '¡Todas las asociaciones son correctas!' : 'Hay asociaciones incorrectas.';
                  })()}
                </p>
              </div>
              <button className="btn-primary" onClick={handleNext} disabled={isSaving}>
                {isSaving ? 'Guardando...' : (currentQuestion < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados')} <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
