import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Course from './pages/Course';
import Quiz from './pages/Quiz';
import Project from './pages/Project';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/course/:moduleId" 
            element={
              <ProtectedRoute>
                <Course />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project" 
            element={
              <ProtectedRoute>
                <Project />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quiz/:category" 
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute roleRequired="teacher">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
