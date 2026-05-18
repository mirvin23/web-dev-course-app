import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Course from './pages/Course';
import Quiz from './pages/Quiz';
import Project from './pages/Project';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:moduleId" element={<Course />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/project" element={<Project />} />
      </Routes>
    </div>
  );
}

export default App;
