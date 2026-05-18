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
        <div className="fixed inset-0 z-200 bg-[#0D1230] backdrop-blur-md flex items-center justify-center p-6 bg-grid">
          <div className="absolute inset-0 bg-linear-to-t from-[#0A0B14] via-transparent to-transparent opacity-80"></div>
          
          {/* Envoltorio con posicionamiento relativo y grupo para controlar hover si se desea */}
          <div className="w-full max-w-md z-50 group relative">
            
            {/* Picos de acentuación del HUD adaptados al tamaño del Modal */}
            <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#BBC3FF] z-20"></div>
            <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#BBC3FF] z-20"></div>
            <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#BBC3FF] z-20"></div>
            <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#BBC3FF] z-20"></div>

            {/* Contenedor principal con el mismo fondo, borde y padding del HUD */}
            <div className="bg-[#1D2240]/90 border-2 border-[#74768B] p-6 backdrop-blur-sm shadow-2xl">
              
              {/* Header estilo HUD de vida */}
              <h3 className="text-[#BBC3FF] font-black text-[10px] uppercase tracking-[0.3em] mb-6 border-b border-[#74768B]/30 pb-3 flex justify-between items-center">
                <span>{'>'} Partida Terminada</span>
                <span className="animate-pulse text-red-500">●</span>
              </h3>

              <div className="text-center mb-6">
                <h1 className="text-2xl font-black uppercase tracking-widest text-[#BBC3FF] drop-shadow-[0_0_10px_rgba(185,193,253,0.3)]">
                  GAME OVER
                </h1>
                <p className="text-[9px] text-[#74768B] tracking-[0.15em] uppercase mt-2">
                  La unidad operativa ha sufrido daños catastróficos.
                </p>
              </div>
              
              {/* Lista de estadísticas con el estilo de bloque plano e idéntico espaciado */}
              <div className="grid grid-cols-2 gap-3 mb-6 text-left">
                <StatEntry label="Sector" val={`SEC_${String(finalStats.floor || 1).padStart(2, '0')}`} />
                <StatEntry label="Eliminaciones" val={finalStats.kills || 0} />
                <StatEntry label="Daño Infligido" val={(finalStats.totalDamageDealt || 0).toLocaleString()} />
                <StatEntry label="Daño Recibido" val={(finalStats.totalDamageTaken || 0).toLocaleString()} />
              </div>

              {/* Botonera adaptada con los botones de la estética plano-cyber */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => window.location.reload()} 
                  className="w-full py-3 bg-[#BBC3FF] hover:bg-[#B9C1FD] text-[#0A0B14] font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-150 shadow-[0_0_15px_rgba(185,193,253,0.2)] active:scale-98"
                >
                  Reiniciar
                </button>
                
                <button 
                  onClick={() => navigate('/leaderboard')} 
                  className="w-full py-2.5 bg-transparent hover:bg-[#74768B]/10 text-[#74768B] hover:text-[#BBC3FF] border border-[#74768B]/40 hover:border-[#BBC3FF]/60 font-black uppercase text-[9px] tracking-[0.2em] transition-all"
                >
                  Ver Ranking
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

/**
 * Componente interno de estadísticas adaptado para el nuevo estilo plano de Prisma.
 */
function StatEntry({ label, val }) {
  return (
    <div className="bg-[#12162E]/50 border border-[#74768B]/20 p-3 flex flex-col justify-between">
      <span className="text-[7px] text-[#74768B] uppercase tracking-[0.15em] mb-1">{label}</span>
      <span className="text-xs font-black text-[#BBC3FF]">{val}</span>
    </div>
  )
}


export default PhaserGame