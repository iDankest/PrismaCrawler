// src/components/PhaserGame.jsx
import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { GameScene } from '../Scenes/gameScene'
import { StatsPanel } from './StatsPanel'
import { InventoryPanel } from './inventoryPanel'
import { ControlsPanel } from './ControlPanel'
import { ActionLog } from './Actionlog'
import { useNavigate } from 'react-router-dom'

function PhaserGame() {
  const gameContainer = useRef(null)
  const gameRef = useRef(null)
  const sceneRef = useRef(null)
  const navigate = useNavigate()

  const [gameState, setGameState] = useState(null)
  const [inventory, setInventory] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [finalStats, setFinalStats] = useState(null)
  const [mapData, setMapData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Carga de mapas
  const loadMap = async (mapId) => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/api/game/map/${mapId}`)
      if (!response.ok) throw new Error("Error al cargar mapa")
      const data = await response.json()
      setMapData(data)
      if (sceneRef.current) sceneRef.current.setupBackendMap(data)
    } catch (error) {
      console.error("Fallo al cargar mapa", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/game/map/1")
        const data = await response.json()
        setMapData(data)
      } catch (error) {
        setMapData({
          layout: ["##########","#P_______#","#___M____#","##########"],
          dictionary: { M: { hp: 30, damage: 5 } }
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchMap()
  }, [])

  useEffect(() => {
    if (isLoading || !mapData || !gameContainer.current || gameRef.current) return

    class CustomGameScene extends GameScene {
      create() {
        super.create()
        sceneRef.current = this
        if (typeof this.setupBackendMap === "function") this.setupBackendMap(mapData)

        this.onGameStateUpdate = (state) => setGameState(state)
        this.onGameOver = (stats) => { setGameOver(true); setFinalStats(stats); }
        this.onInventoryUpdate = (items) => setInventory([...items])
        this.onLevelExit = () => loadMap(mapData.id + 1)
      }
    }

    const config = {
      type: Phaser.AUTO,
      parent: gameContainer.current,
      width: 640,
      height: 360,
      render: { pixelArt: true, antialias: false },
      physics: { default: "arcade", arcade: { gravity: { y: 0 } } },
      scene: CustomGameScene,
    }

    gameRef.current = new Phaser.Game(config)
    return () => { if (gameRef.current) { gameRef.current.destroy(true); gameRef.current = null; } }
  }, [isLoading, mapData])

  return (
    <div className="relative w-full h-full bg-[#10121D] bg-grid flex items-center justify-center p-4 overflow-hidden">
      
      {/* 1. CONTENEDOR DEL JUEGO (CAPA BASE) */}
      <div className="relative border-4 border-[#41424D] shadow-[0_0_30px_rgba(0,0,0,0.5)] leading-[0]">
        <div ref={gameContainer} />
        
        {/* 2. HUD: PANELES FLOTANTES SOBRE EL JUEGO */}
        {!gameOver && gameState && (
          <>
            {/* Esquina Superior Derecha: Stats */}
            <div className="absolute top-4 right-4 pointer-events-auto">
              <StatsPanel gameState={gameState} />
            </div>

            {/* Esquina Inferior Derecha: Inventario */}
            <div className="absolute bottom-4 right-4 pointer-events-auto">
              <InventoryPanel inventory={inventory} />
            </div>

            {/* Esquina Inferior Izquierda: Log de Acciones */}
            <div className="absolute bottom-4 left-4 pointer-events-auto">
              <ActionLog gameState={gameState} />
            </div>

            {/* Parte Inferior Central: Controles */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
              <ControlsPanel />
            </div>
          </>
        )}
      </div>

      {/* 3. MODAL DE GAME OVER (OCUPA TODA LA PANTALLA) */}
      {gameOver && finalStats && (
        <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#1D2240] border-2 border-[#74768B] p-8 max-w-sm w-full shadow-[0_0_50px_rgba(255,0,0,0.2)]">
            <h1 className="text-red-500 text-3xl font-black text-center mb-8 tracking-tighter uppercase italic">
              Unit_Terminated
            </h1>
            
            <div className="space-y-2 mb-8 font-mono">
              {[
                { label: 'Floor', val: finalStats.floor, color: 'text-blue-400' },
                { label: 'Kills', val: finalStats.kills, color: 'text-red-400' },
                { label: 'Gold', val: finalStats.money, color: 'text-yellow-400' },
                { label: 'Items', val: finalStats.itemsCollected, color: 'text-purple-400' }
              ].map((s) => (
                <div key={s.label} className="flex justify-between bg-black/40 p-2 border border-white/5 text-xs">
                  <span className="text-gray-500 uppercase">{s.label}</span>
                  <span className={`${s.color} font-bold`}>{s.val}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={() => window.location.reload()} className="flex-1 bg-[#4D61FF] text-white py-3 font-black text-[10px] uppercase tracking-widest hover:bg-[#BBC3FF] hover:text-black transition-all">
                Re-Initialize
              </button>
              <button onClick={() => navigate('/leaderboard')} className="flex-1 border border-[#4D61FF] text-[#4D61FF] py-3 font-black text-[10px] uppercase tracking-widest hover:bg-[#4D61FF]/10 transition-all">
                Rankings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhaserGame