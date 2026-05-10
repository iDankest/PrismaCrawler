import { useState, useEffect } from 'react'
import GameCanvas from '../components/GameCanvas'

function Game() {
  const [playerPos, setPlayerPos] = useState({ x: 5, y: 5 })
  const [map, setMap] = useState([])

  useEffect(() => {
    // Genera el mapa al entrar
    generateMap()
  }, [])

  const generateMap = () => {
    const newMap = Array(10).fill().map(() =>
      Array(10).fill().map(() => Math.random() > 0.8 ? 1 : 0)
    )
    setMap(newMap)
  }

  const movePlayer = (direction) => {
    const { x, y } = playerPos
    let newX = x, newY = y

    switch(direction) {
      case 'up': newY--; break
      case 'down': newY++; break
      case 'left': newX--; break
      case 'right': newX++; break
      default: return
    }

    // Validar límites
    if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10) {
      setPlayerPos({ x: newX, y: newY })
    }
  }

  // Listeners de teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      const keys = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right'
      }
      if (keys[e.key]) movePlayer(keys[e.key])
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [playerPos])

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Canvas principal */}
      <div className="flex-1 flex items-center justify-center">
        <GameCanvas 
          map={map} 
          playerPos={playerPos}
          onMove={movePlayer}
        />
      </div>

      {/* UI derecha (stats, inventory, etc) */}
      <div className="w-64 bg-blue-900 border-l-4 border-blue-600 p-4">
        <h2 className="text-blue-300 font-bold mb-4">HERO_01</h2>
        <div className="text-blue-200 text-sm">
          <p>HP: 100/100</p>
          <p>XP: 50/200</p>
        </div>
      </div>
    </div>
  )
}

export default Game