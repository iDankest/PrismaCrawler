// ./frontend/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Game from './pages/Game'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useState } from 'react'

function App() {
  const [items, setItems] = useState([]);

  fetch('/api/game/items')
    .then(res => res.json())
    .then(data => setItems(data))
    .catch(err => console.error(err));

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
