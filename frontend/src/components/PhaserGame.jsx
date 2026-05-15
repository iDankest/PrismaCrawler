// src/components/PhaserGame.jsx

import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { GameScene } from '../Scenes/gameScene'
import { StatsPanel } from './StatsPanel'
import { InventoryPanel } from './inventoryPanel'
import { useItemsCache } from '../hooks/useItemsCache'
import { initializeItemsDB } from '../data/itemsDatabase'
import { useNavigate } from 'react-router-dom'

// Resolución de URL base del servidor según entorno (Desarrollo local / Producción)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function PhaserGame() {
  const gameContainer = useRef(null)
  const gameRef = useRef(null)
  const sceneRef = useRef(null)
  const navigate = useNavigate()

  const [gameState, setGameState] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [finalStats, setFinalStats] = useState(null);

  // Estados y gestión de datos de nivel remoto
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Referencias para inyección segura de dependencias asíncronas en el motor gráfico
  const initialMapDataRef = useRef(null);
  const currentMapIdRef = useRef(1);

  /** Solicita el siguiente nivel a la API REST y actualiza el estado inyectándolo a Phaser */
  const loadMap = async (mapId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/game/map/${mapId}`,
      );
      if (!response.ok) throw new Error("Error al cargar mapa");
      const data = await response.json();

      setMapData(data);
      currentMapIdRef.current = mapId;

      // Delegación de matriz hacia la escena activa o encolamiento pre-render
      if (sceneRef.current) {
        sceneRef.current.setupBackendMap(data);
      } else {
        initialMapDataRef.current = data;
      }
    } catch (error) {
      console.error("Fallo al cargar mapa del backend", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Ciclo de vida inicial: Sincronización de caché remota y obtención de Nivel 1
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Sincronización del catálogo de objetos
        try {
          const itemsRes = await fetch(`${API_URL}/api/game/items`);
          if (itemsRes.ok) {
            const itemsJson = await itemsRes.json();
            const itemsObj = {};
            itemsJson.data.forEach(item => {
              itemsObj[item.spriteKey] = item;
            });
            initializeItemsDB(itemsObj);
            console.log("✅ Items cargados con éxito desde la BD:", itemsObj);
          }
        } catch (itemErr) {
          console.warn("⚠️ No se pudieron cargar los items, usando los locales.");
        }

        // Obtención de mapa inicial
        const response = await fetch(`${API_URL}/api/game/map/1`);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        setMapData(data);
        console.log("✅ Mapa cargado con éxito desde el servidor:", data);
        
        if (sceneRef.current) {
          sceneRef.current.setupBackendMap(data);
        } else {
          initialMapDataRef.current = data;
        }
      } catch (error) {
        console.error("❌ Fetch falló (Revisa la consola por si hay errores de CORS):", error.message);
        console.warn("Iniciando capa de respaldo (Fallback Procedural)...");
        
        // Matriz de respaldo en caso de desconexión del servidor principal
        const fallbackMap = {
          layout: [
            "####DD####",
            "#M____M__#",
            "#___M____#",
            "#_###__T_#",
            "#____P___#",
            "####DD####",
          ],
          dictionary: {
            M: { hp: 30, damage: 5 },
          },
        };
        setMapData(fallbackMap);
        if (sceneRef.current) {
          sceneRef.current.setupBackendMap(fallbackMap);
        } else {
          initialMapDataRef.current = fallbackMap;
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Inicialización del Canvas y montaje del framework Phaser
  useEffect(() => {
    if (!gameContainer.current || gameRef.current) return;

    class CustomGameScene extends GameScene {
      create() {
        super.create();
        sceneRef.current = this;

        // Inyección de entorno de red a la inicialización gráfica
        if (initialMapDataRef.current && typeof this.setupBackendMap === "function") {
          this.setupBackendMap(initialMapDataRef.current);
        } else if (mapData && typeof this.setupBackendMap === "function") {
          this.setupBackendMap(mapData);
        }

        // Conectar callbacks
        this.onGameStateUpdate = (state) => setGameState(state);
        this.onGameOver = async (stats) => {
          setGameOver(true);
          setFinalStats(stats);

          // Persistencia de los resultados de sesión mediante JWT
          try {
            const token = localStorage.getItem('token');
            if (token) {
              const response = await fetch(`${API_URL}/api/game/score`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  floor: stats.floor || 1,
                  kills: stats.kills || 0,
                  xp: stats.xp || 0,
                  totalDamageDealt: stats.totalDamageDealt || 0,
                  totalDamageTaken: stats.totalDamageTaken || 0
                })
              });
              
              if (response.ok) console.log('🏆 Puntuación guardada en la base de datos con éxito');
            }
          } catch (error) {
            console.error('❌ Error al guardar la puntuación:', error);
          }
        };
        this.onInventoryUpdate = (items) => setInventory([...items]);
        
        // Solicitud de carga y transición de siguiente área
        this.onLevelExit = () => {
          loadMap(currentMapIdRef.current + 1); 
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
  }, []);

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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-8 gap-8">
      
      {/* PANEL IZQUIERDO: STATS */}
      <div className="w-64 flex-shrink-0">
        {gameState && !gameOver && <StatsPanel gameState={gameState} />}
      </div>

      {/* CONTENEDOR DEL JUEGO */}
      <div className="relative flex-shrink-0">
        <div
          ref={gameContainer}
          className="border-4 border-cyan-500 rounded-lg overflow-hidden shadow-2xl bg-black"
          style={{
            boxShadow:
              "0 0 30px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.1)",
          }}
        />

      {/* MODAL GAME OVER */}
      {gameOver && finalStats && (
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50">
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

      {/* PANEL DERECHO: INVENTARIO */}
      <div className="w-64 flex-shrink-0">
        {gameState && !gameOver && <InventoryPanel inventory={inventory} />}
      </div>
    </div>
  );
}

export default PhaserGame;
