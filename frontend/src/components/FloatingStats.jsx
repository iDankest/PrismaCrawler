// src/components/FloatingStats.jsx - INGAME, ESQUINA DERECHA DEL CANVAS

import { 
  Sword,
  Heart,
  Coins,
  Skull,
  Lightbulb,
  Castle,
  SpeedFast
} from 'pixelarticons/react'

export function FloatingStats({ gameState }) {
  if (!gameState) return null

  const healthPercentage = (gameState.hp / gameState.maxHp) * 100
  const healthColor = 
    healthPercentage > 50 ? 'text-green-400' : 
    healthPercentage > 25 ? 'text-amber-400' : 
    'text-red-400'

  return (
    <div className="
      absolute bottom-32 right-0
      text-[8px]
      text-white
      z-30
      min-w-[70px]
      pointer-events-none
      opacity-60
    ">
      {/* Fila 1: Multiplicador de daño */}
      <div className="flex justify-between items-center text-amber-400 pb-1 border-b border-blue-400/20">
        <Sword size={12} className="text-amber-400" />
        <span className="font-bold ">
          {gameState.damageMultiplier.toFixed(2)}
        </span>
      </div>

      {/* Fila 2: Multiplicador de velocidad */}
      <div className="flex justify-between items-center text-blue-400 pb-1 border-b border-blue-400/20">
        <SpeedFast size={12} className="text-blue-400" />
        <span className="font-bold">
          {gameState.speedMultiplier.toFixed(2)}
        </span>
      </div>

      {/* Fila 3: Multiplicador de velocidad de ataque */}
      <div className="flex justify-between items-center text-green-400 pb-1 border-b border-blue-400/20">
        <Lightbulb size={12} className="text-green-400" />
        <span className="font-bold">
          {gameState.attackSpeedMultiplier.toFixed(2)}
        </span>
      </div>

      {/* Fila 4: Vida */}
      <div className={`flex justify-between items-center pb-1 border-b border-blue-400/20 ${healthColor}`}>
        <Heart size={12} className={healthColor} />
        <span className="font-bold">
          {gameState.hp}
        </span>
      </div>

      {/* Fila 5: Dinero/Créditos */}
      <div className="flex justify-between items-center text-amber-400 pb-1 border-b border-blue-400/20">
        <Coins size={12} className="text-amber-400" />
        <span className="font-bold">
          {gameState.money}
        </span>
      </div>

      {/* Fila 6: Kills */}
      <div className="flex justify-between items-center text-red-400 pb-1 border-b border-blue-400/20">
        <Skull size={12} className="text-red-400" />
        <span className="font-bold">
          {gameState.kills}
        </span>
      </div>

      {/* Fila 7: Floor/Depth */}
      <div className="flex justify-between items-center text-blue-400">
        <Castle size={12} className="text-blue-400" />
        <span className="font-bold">
          {gameState.floor}
        </span>
      </div>
    </div>
  )
}