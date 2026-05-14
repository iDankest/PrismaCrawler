// ./frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from './api/axios' // Importa tu instancia de Axios
import Login from './pages/Login'
import Game from './pages/Game'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Usamos axios para evitar líos de URL y duplicados de /api
    api.get('/game/items')
      .then(res => {
        // Accedemos a .data.data porque tu controller devuelve { success: true, data: [...] }
        setItems(res.data.data || []);
      })
      .catch(err => console.error("Error cargando items iniciales:", err.message));
  }, []); // El array vacío [] hace que solo se ejecute al cargar la web

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/game" 
          element={
            <ProtectedRoute>
              <Game items={items} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App