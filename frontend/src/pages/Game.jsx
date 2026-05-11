// ./frontend/src/pages/Game.jsx
import { useState, useEffect } from "react";
import GameCanvas from "../components/GameCanvas";

function Game() {
  const [playerPos, setPlayerPos] = useState({ x: 5, y: 0 });
  const [map, setMap] = useState([]);

  // --- NUEVO: Estado para las estadísticas del jugador ---
  const [playerStats, setPlayerStats] = useState({
    hp: 100,
    maxHp: 100,
    xp: 0,
    attack: 15,
    defense: 5,
  });
  // --- NUEVO: Estado para los enemigos vivos en el mapa ---
  const [enemies, setEnemies] = useState([]);

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


  // --- NUEVO: Lógica pura matemática (Migrada del backend) ---
  const calculateDamage = (ataque, defensa) => {
    const damage = ataque - defensa;
    return damage > 0 ? damage : 0;
  };

  const handleCombat = (enemy) => {
    // 1. Calculamos cuánto daño le hacemos al enemigo
    const damageToEnemy = calculateDamage(playerStats.attack, enemy.defense);
    const newEnemyHp = enemy.hp - damageToEnemy;

    if (newEnemyHp <= 0) {
      // El enemigo muere: Lo quitamos del array y ganamos XP
      setEnemies((prevEnemies) => prevEnemies.filter((e) => e.id !== enemy.id));
      setPlayerStats((prev) => ({ ...prev, xp: prev.xp + 25 }));
      console.log("¡Enemigo derrotado! Ganaste 25 XP");
    } else {
      // El enemigo sobrevive: Actualizamos su HP
      setEnemies((prevEnemies) =>
        prevEnemies.map((e) =>
          e.id === enemy.id ? { ...e, hp: newEnemyHp } : e,
        ),
      );

      // 2. El enemigo contraataca
      const damageToPlayer = calculateDamage(enemy.attack, playerStats.defense);
      setPlayerStats((prev) => ({
        ...prev,
        hp: Math.max(0, prev.hp - damageToPlayer), // Evitamos que la vida baje de 0
      }));

      console.log(
        `Atacas por ${damageToEnemy}. El enemigo contraataca por ${damageToPlayer}.`,
      );
    }
  };

  // --- NUEVO: Lógica de Curación ---
  const healPlayer = () => {
    const healAmount = 20;
    setPlayerStats(prev => ({
      ...prev,
      hp: Math.min(prev.maxHp, prev.hp + healAmount) // Curamos sin pasarnos del máximo
    }));
    console.log(`Te has curado ${healAmount} HP`);
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

      // --- NUEVO: Comprobamos si hay un enemigo en la casilla destino ---
      const targetEnemy = enemies.find(e => e.x === newX && e.y === newY);

      if (targetEnemy) {
        // Si hay enemigo, no nos movemos, ¡ATACAMOS!
        handleCombat(targetEnemy);
      }
      else if (!isWall) {
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
      
      if (keys[e.key]) {
        e.preventDefault();
        movePlayer(keys[e.key]);
      }
      
      // --- NUEVO: Tecla 'H' o Espacio para curarse ---
      if (e.key === 'h' || e.key === 'H' || e.key === ' ') {
        e.preventDefault();
        healPlayer();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playerPos, map, enemies, playerStats.hp]); // Dependencias actualizadas

  return (
    <div className="flex h-screen bg-slate-900">
      <div className="flex-1 flex items-center justify-center relative">
        {/* Pasamos también los enemigos al Canvas por si quieres dibujarlos */}
        <GameCanvas map={map} playerPos={playerPos} enemies={enemies} onMove={movePlayer} />
        
        {/* Pantalla de Muerte */}
        {playerStats.hp <= 0 && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
            <h1 className="text-6xl text-red-600 font-bold mb-4">HAS MUERTO</h1>
            <p>Puntuación Final (XP): {playerStats.xp}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 rounded text-xl"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>

      <div className="w-64 bg-blue-900 border-l-4 border-blue-600 p-4">
        <h2 className="text-blue-300 font-bold mb-4">HERO_01</h2>
        {/* --- NUEVO: UI dinámica enlazada a nuestro estado --- */}
        <div className="text-blue-200 text-sm space-y-2">
          <p className="font-mono">
            HP: <span className={playerStats.hp < 30 ? "text-red-400 font-bold" : "text-green-400"}>
              {playerStats.hp}
            </span> / {playerStats.maxHp}
          </p>
          <p className="font-mono">XP: <span className="text-yellow-400">{playerStats.xp}</span></p>
          <hr className="border-blue-700 my-2"/>
          <p className="font-mono text-xs text-gray-400">Atk: {playerStats.attack} | Def: {playerStats.defense}</p>
          <p className="text-xs text-gray-400 mt-4">[H] o [Espacio] para Curar</p>
        </div>
      </div>
    </div>
  );
}

export default Game;
