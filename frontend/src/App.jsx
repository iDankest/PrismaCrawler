// ./frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from './api/axios' 
import Login from './pages/Login'
import Game from './pages/Game'
import { Leaderboard } from './pages/Leaderboard' 
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Usamos axios para obtener los items iniciales del juego
    api.get('/game/items')
      .then(res => {
        // Accedemos a res.data.data según la estructura de tu controlador
        setItems(res.data.data || []);
      })
      .catch(err => console.error("Error cargando items iniciales:", err.message));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Ruta pública de acceso */}
        <Route path="/" element={<Login />} />
        
        {/* Ruta principal del juego protegida */}
        <Route 
          path="/game" 
          element={
            <ProtectedRoute>
              <Game items={items} />
            </ProtectedRoute>
          } 
        />

        {/* Ruta para el Salón de la Infamia (Leaderboard) */}
        <Route 
          path="/leaderboard" 
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App