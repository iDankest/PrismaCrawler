import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { GameScene } from '../Scenes/gameScene'
import { FloatingStats } from './FloatingStats'
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

  const handleRestart = () => {
    setGameOver(false)
    setFinalStats(null)
    setGameState(null)
    setInventory([])
    if (gameRef.current) {
      gameRef.current.destroy(true)
      gameRef.current = null
    }
    window.location.reload()
  }

  return (
    <div className="flex m-auto">
      
      {/* CONTENEDOR MAESTRO: Layout de Rejilla/Flex */}
      <div className="flex relative">
        
        {/* COLUMNA DERECHA: JUEGO + CONTROLES ABAJO */}
        <main className="flex-1 flex flex-col gap-4 mt-8">
          
          {/* ÁREA DE JUEGO - CON FLOATING STATS DENTRO */}
          <div className="relative border-4 border-[#74768B] bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
             <div ref={gameContainer} className="flex justify-center items-center relative" />
             
             {/* FLOATING STATS - DENTRO DEL CANVAS, ESQUINA DERECHA INFERIOR */}
             {gameState && !gameOver && (
               <div className="absolute bottom-4 right-4 z-30">
                 <FloatingStats gameState={gameState} />
               </div>
             )}
             
             {/* Superposición de Carga */}
             {isLoading && (
               <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                 <div className="text-[#4D61FF] animate-pulse font-black tracking-widest text-xl">
                   INICIALIZANDO_ENLACE_NEURAL...
                 </div>
               </div>
             )}
          </div>
         <div className="absolute top-2/3 left-0 right-74">
            <div className="">
              <ControlsPanel />
            </div>
          </div>

        </main>
                  {/* CONTROLES (Debajo del juego) */}
 

            {/* COLUMNA IZQUIERDA: GESTIÓN (Stats + Inventario + Logs) */}
        <aside className=" relative flex flex-col gap-4 justify-center items-center ml-2 ">
 
            {/* Los componentes se posicionan de forma estática en la barra lateral */}
            <div className="relative">
              <StatsPanel gameState={gameState} />
              </div>
              <div className="relative">
              <InventoryPanel inventory={inventory} />
              </div>
              <div className="relative">
              <ActionLog gameState={gameState} />
              </div>
            

        </aside>

      </div>

      {/* PANTALLA DE FIN DE JUEGO (Modal) */}
      {gameOver && finalStats && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-[#1D2240] border-4 border-red-900/50 p-10 max-w-md w-full shadow-[0_0_100px_rgba(255,0,0,0.3)] text-center">
            <h1 className="text-red-600 text-5xl font-black mb-8 tracking-tighter uppercase italic animate-pulse">
              CONEXIÓN_PERDIDA
            </h1>
            
            <div className="grid grid-cols-2 gap-4 mb-10 text-left">
              <StatEntry label="Nivel" val={finalStats.floor} />
              <StatEntry label="Eliminaciones" val={finalStats.kills} />
              <StatEntry label="Créditos" val={finalStats.money} />
              <StatEntry label="Núcleos_Datos" val={finalStats.itemsCollected} />
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleRestart} 
                className="bg-[#4D61FF] hover:bg-white hover:text-black text-white py-4 font-black uppercase tracking-widest transition-all"
                style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}
              >
                Reiniciar Terminal
              </button>
              <button onClick={() => navigate('/leaderboard')} className="border border-[#74768B] text-[#74768B] hover:text-white py-2 text-xs uppercase tracking-widest transition-all">
                Acceder_Rankings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatEntry({ label, val }) {
  return (
    <div className="bg-black/40 border border-white/5 p-3 flex flex-col">
      <span className="text-[8px] text-[#74768B] uppercase tracking-widest mb-1">{label}</span>
      <span className="text-xl font-black text-[#BBC3FF]">{val}</span>
    </div>
  )
}

export default PhaserGame