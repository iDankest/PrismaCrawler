// ./frontend/src/pages/Game.jsx
import { useState, useEffect } from "react";
import GameCanvas from "../components/GameCanvas";

function Game() {
  const [playerPos, setPlayerPos] = useState({ x: 5, y: 0 });
  const [map, setMap] = useState([]);

  useEffect(() => {
    // Genera el mapa al entrar
    generateMap();
  }, []);

  const generateMap = () => {
    const newMap = Array(10)
      .fill()
      .map(() =>
        Array(10)
          .fill()
          .map(() => (Math.random() > 0.8 ? 1 : 0)),
      );
    // Nos aseguramos de que el jugador no aparezca dentro de una pared al inicio
    newMap[5][0] = 0;
    setMap(newMap);
  };

  const movePlayer = (direction) => {
    // Si el mapa aún no ha cargado, no hacemos nada
    if (map.length === 0) return;

    const { x, y } = playerPos;
    let newX = x,
      newY = y;

    switch (direction) {
      case "up":
        newY--;
        break;
      case "down":
        newY++;
        break;
      case "left":
        newX--;
        break;
      case "right":
        newX++;
        break;
      default:
        return;
    }

    // --- LÓGICA DE JUEGO (MIGRADA DEL BACKEND) ---

    // 1. Validar límites del mapa (que no se salga de la cuadrícula de 10x10)
    const isWithinBounds = newX >= 0 && newX < 10 && newY >= 0 && newY < 10;

    if (isWithinBounds) {
      // 2. Validar colisión con paredes (Revisamos si la celda destino es 1)
      // OJO al orden: map[fila][columna] equivale a map[Y][X]
      const isWall = map[newY][newX] === 1;

      if (!isWall) {
        // Movimiento válido: actualizamos la posición
        setPlayerPos({ x: newX, y: newY });
      } else {
        // (Opcional) Aquí podrías reproducir un sonido de "golpe" o sacudir la pantalla
        console.log("¡Chocaste con una pared!");
      }
    }
  };

  // Listeners de teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      const keys = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      // Solo movemos si la tecla pulsada está en nuestro diccionario
      if (keys[e.key]) {
        // Prevenir que la página haga scroll al usar las flechas
        e.preventDefault();
        movePlayer(keys[e.key]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playerPos, map]); // Añadimos map a las dependencias para tener la última versión

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Canvas principal */}
      <div className="flex-1 flex items-center justify-center">
        <GameCanvas map={map} playerPos={playerPos} onMove={movePlayer} />
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
  );
}

export default Game;
