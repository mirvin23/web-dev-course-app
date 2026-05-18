import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Quiz.css';

const questions = [
  {
    question: "¿Qué etiqueta debe ir al principio de un documento HTML5 para que el navegador lo reconozca?",
    options: ["<html5>", "<body>", "<!DOCTYPE html>", "<head>"],
    answer: 2
  },
  {
    question: "¿Para qué sirve la etiqueta <article>?",
    options: ["Para envolver todo el sitio web", "Para contenido independiente como una noticia o post", "Para colocar anuncios a los lados", "Para escribir texto en cursiva"],
    answer: 1
  },
  {
    question: "¿Qué selector de CSS se usa para apuntar a un elemento con un id específico?",
    options: ["#id", ".id", "id", "*id"],
    answer: 0
  },
  {
    question: "¿Qué propiedad de Flexbox centra los elementos horizontalmente?",
    options: ["align-items: center", "text-align: center", "justify-content: center", "vertical-align: middle"],
    answer: 2
  },
  {
    question: "¿Cuál es la forma correcta de declarar una variable que no cambiará su valor en JS?",
    options: ["let nombre = 'Juan';", "var nombre = 'Juan';", "const nombre = 'Juan';", "constant nombre = 'Juan';"],
    answer: 2
  },
  {
    question: "¿Qué método de JS usamos para seleccionar un elemento del HTML?",
    options: ["document.getElementById()", "document.querySelector()", "Ambas opciones anteriores", "Ninguna de las anteriores"],
    answer: 2
  }
];

export default function Quiz() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const setQuizScore = useStore(state => state.setQuizScore);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === questions[currentQuestion].answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const finalScoreRaw = score + (selectedOption === questions[currentQuestion].answer ? 1 : 0);
      const finalScorePercentage = Math.round((finalScoreRaw / questions.length) * 100);
      
      setQuizScore(finalScoreRaw);
      setIsSaving(true);
      
      try {
        if (currentUser) {
          await addDoc(collection(db, 'quiz_results'), {
            studentId: currentUser.uid,
            studentName: currentUser.displayName,
            studentEmail: currentUser.email,
            score: finalScorePercentage,
            rawScore: finalScoreRaw,
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

  if (isFinished) {
    return (
      <div className="quiz-container flex-center">
        <motion.div 
          className="glass-card quiz-card result-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2>¡Quiz Completado!</h2>
          <div className="score-display">
            <span className="score-number">{score}</span>
            <span className="score-total">/ {questions.length}</span>
          </div>
          <p>Has demostrado tus conocimientos básicos.</p>
          <button className="btn-primary" onClick={() => navigate('/project')}>
            Ir al Proyecto Final <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="quiz-container flex-center">
      <motion.div 
        className="glass-card quiz-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        key={currentQuestion}
      >
        <div className="quiz-header">
          <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
        </div>
        
        <h2 className="question-text">{q.question}</h2>
        
        <div className="options-grid">
          {q.options.map((option, index) => {
            let className = "quiz-option";
            if (isAnswered) {
              if (index === q.answer) className += " correct";
              else if (index === selectedOption) className += " incorrect";
            } else if (selectedOption === index) {
              className += " selected";
            }

            return (
              <button 
                key={index}
                className={className}
                onClick={() => handleOptionClick(index)}
                disabled={isAnswered}
              >
                {option}
                {isAnswered && index === q.answer && <CheckCircle2 size={20} color="#10b981" className="status-icon" />}
                {isAnswered && index === selectedOption && index !== q.answer && <XCircle size={20} color="#ef4444" className="status-icon" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <motion.div 
            className="next-btn-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button className="btn-primary" onClick={handleNext}>
              {currentQuestion < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'} <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
