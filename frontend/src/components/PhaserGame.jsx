// src/components/PhaserGame.jsx

import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { GameScene } from '../Scenes/gameScene'
import { StatsPanel } from './StatsPanel'
import { InventoryPanel } from './inventoryPanel'
import { useItemsCache } from '../hooks/useItemsCache'
import { initializeItemsDB } from '../data/itemsDatabase'
import { useNavigate } from 'react-router-dom'

function PhaserGame() {
  const gameContainer = useRef(null)
  const gameRef = useRef(null)
  const sceneRef = useRef(null)
  const navigate = useNavigate()

  const [gameState, setGameState] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [finalStats, setFinalStats] = useState(null);

  // --- NUEVO: Estados para manejar la carga del mapa desde el Backend ---
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Añadimos un estado para el ID del mapa actual
  const [currentMapId, setCurrentMapId] = useState(1);

  // Convertimos el fetch en una función reutilizable
  const loadMap = async (mapId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/game/map/${mapId}`,
      );
      if (!response.ok) throw new Error("Error al cargar mapa");
      const data = await response.json();

      setMapData(data);
      setCurrentMapId(mapId);

      // Si la escena ya existe, le pasamos los nuevos datos directamente
      if (sceneRef.current) {
        sceneRef.current.setupBackendMap(data);
      }
    } catch (error) {
      console.error("Fallo al cargar mapa del backend", error);
    } finally {
      setIsLoading(false);
    }
  };
  // --- NUEVO: Efecto para hacer el Fetch al Backend ---
  useEffect(() => {
    const fetchMap = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/game/map/1");

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        setMapData(data);
        console.log("Mapa cargado con éxito desde el servidor:", data);
      } catch (error) {
        console.warn(
          "No se pudo cargar el mapa. Generando mapa de fallback...",
          error.message,
        );
        // Fallback en caso de que el backend esté apagado para que no pete el frontend
        setMapData({
          layout: [
            "##########",
            "#P_______#",
            "#___M____#",
            "#_###____#",
            "#___M____#",
            "##########",
          ],
          dictionary: {
            M: { hp: 30, damage: 5 },
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMap();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Efecto para inicializar Phaser (Modificado para esperar al mapData)
  // Efecto para inicializar Phaser (Modificado para esperar al mapData)
  useEffect(() => {
    // Si está cargando o no hay contenedor/mapa, o si el juego ya existe, no hacemos nada
    if (isLoading || !mapData || !gameContainer.current || gameRef.current) return;

    // Crear escena personalizada
    class CustomGameScene extends GameScene {
      create() {
        super.create();
        sceneRef.current = this;

        // Enviamos el mapa descargado a la lógica de Phaser
        if (typeof this.setupBackendMap === "function") {
          this.setupBackendMap(mapData);
        }

        // Conectar callbacks
        this.onGameStateUpdate = (state) => setGameState(state);
        this.onGameOver = (stats) => {
          setGameOver(true);
          setFinalStats(stats);
        };
        this.onInventoryUpdate = (items) => setInventory([...items]);
        
        // --- AQUI ES DONDE DEBE IR EL CALLBACK DE SALIDA ---
        this.onLevelExit = () => {
          // Usamos el ID del mapa actual que nos devolvió Prisma para pedir el siguiente
          loadMap(mapData.id + 1); 
        };
      }
    }

    const config = {
      type: Phaser.AUTO,
      parent: gameContainer.current,
      width: 640,
      height: 360,
      render: {
        pixelArt: true,
        antialias: false,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: CustomGameScene,
    };

    gameRef.current = new Phaser.Game(config);
    
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [isLoading, mapData]); // IMPORTANTE: Solo depende de isLoading y mapData

  const handleRestart = () => {
    setGameOver(false);
    setFinalStats(null);
    setGameState(null);
    setInventory([]);

    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    window.location.reload();
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard')
  }

  return (
    <div className="m-4  flex">
      {/* CONTENEDOR DEL JUEGO */}
      <div className="">
        <div
          ref={gameContainer}
          className=""
         
        />
      </div>

      {/* PANELS FLOTANTES */}
      
      {gameState && !gameOver && (
        <div className="flex flex-col gap-2 ml-4" >
          <StatsPanel gameState={gameState} />
          <InventoryPanel inventory={inventory} />
        </div>
      )}

      {/* MODAL GAME OVER */}
      {gameOver && finalStats && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500 rounded-xl p-8 max-w-md w-full mx-4"
            style={{
              boxShadow:
                "0 0 40px rgba(6, 182, 212, 0.5), inset 0 0 30px rgba(59, 130, 246, 0.1)",
            }}
          >
            <h1
              className="text-4xl font-black text-center text-red-500 mb-8 animate-pulse"
              style={{ textShadow: "0 0 20px rgba(239, 68, 68, 0.8)" }}
            >
              💀 DEFEATED
            </h1>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 bg-slate-900/50 border-l-4 border-cyan-500 rounded hover:bg-slate-900/70 transition-colors">
                <span className="text-slate-300 font-mono text-sm">
                  Floor Reached
                </span>
                <span className="text-cyan-400 font-mono font-bold text-lg">
                  {finalStats.floor}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-900/50 border-l-4 border-cyan-500 rounded hover:bg-slate-900/70 transition-colors">
                <span className="text-slate-300 font-mono text-sm">
                  Enemies Slain
                </span>
                <span className="text-cyan-400 font-mono font-bold text-lg">
                  {finalStats.kills}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-900/50 border-l-4 border-cyan-500 rounded hover:bg-slate-900/70 transition-colors">
                <span className="text-slate-300 font-mono text-sm">
                  Crystals Found
                </span>
                <span className="text-cyan-400 font-mono font-bold text-lg">
                  {finalStats.money}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-900/50 border-l-4 border-cyan-500 rounded hover:bg-slate-900/70 transition-colors">
                <span className="text-slate-300 font-mono text-sm">
                  Items Collected
                </span>
                <span className="text-cyan-400 font-mono font-bold text-lg">
                  {finalStats.itemsCollected}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded hover:shadow-lg hover:-translate-y-1 transition-all text-sm uppercase tracking-wider"
                style={{ boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)" }}
              >
                🔄 Restart
              </button>
              <button
                onClick={handleViewLeaderboard}
                className="flex-1 px-4 py-3 bg-slate-700 text-cyan-400 font-bold rounded border border-cyan-500 hover:bg-slate-600 hover:-translate-y-1 transition-all text-sm uppercase tracking-wider"
              >
                🏆 Rankings
              </button>
            </div>
          </div>
        </div> 
       )} 
    </div>
  );
}

export default PhaserGame;
