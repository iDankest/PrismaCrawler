import { useState, useEffect } from 'react'

export function StatsPanel({ gameState }) {
  if (!gameState) return null

  const [speedChanged, setSpeedChanged] = useState(false)

  // Efecto visual cuando cambia la velocidad
  useEffect(() => {
    setSpeedChanged(true)
    const timer = setTimeout(() => setSpeedChanged(false), 500)
    return () => clearTimeout(timer)
  }, [gameState.speedMultiplier])

  return (
    <div className="absolute right-4 top-4 w-64 z-50 group">
      {/* Picos de acentuación del HUD (Estética Cyber-Dungeon) */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-[#BBC3FF] z-20"></div>
      <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#BBC3FF] z-20"></div>
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-[#BBC3FF] z-20"></div>
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-[#BBC3FF] z-20"></div>

      <div className="bg-[#1D2240]/90 border-2 border-[#74768B] p-4 backdrop-blur-sm shadow-2xl">
        <h3 className="text-[#BBC3FF] font-black text-[10px] uppercase tracking-[0.3em] mb-4 border-b border-[#74768B]/30 pb-2 flex justify-between">
          <span>{'>'} System_Stats</span>
          <span className="animate-pulse text-cyan-400">●</span>
        </h3>
        
        {/* Barra de Vida Estilo Dungeon */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-[9px] font-mono text-blue-300">
            <span>VITAL_SIGNS</span>
            <span className={gameState.hp < (gameState.maxHp || 100) * 0.3 ? 'text-red-500 animate-pulse' : ''}>
              {gameState.hp}/{gameState.maxHp || 100}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-900 border border-[#74768B]/50 p-[2px] relative">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500 relative"
              style={{ width: `${((gameState.hp || 0) / (gameState.maxHp || 100)) * 100}%` }}
            >
              {/* Brillo de la barra */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20"></div>
            </div>
          </div>
        </div>

        {/* Rejilla de Atributos */}
        <div className="grid grid-cols-2 gap-2">
          {/* Daño */}
          <div className="bg-black/40 p-2 border border-[#2A2C3E] hover:border-[#4D61FF] transition-colors">
             <p className="text-[8px] text-[#74768B] uppercase">Atk_Power</p>
             <p className="text-[#BBC3FF] font-mono font-bold text-xs">
               {(gameState.damageMultiplier || 1).toFixed(2)}x
             </p>
          </div>

          {/* Velocidad */}
          <div className={`bg-black/40 p-2 border transition-all duration-300 ${
            speedChanged ? 'border-cyan-400 scale-105' : 'border-[#2A2C3E]'
          }`}>
             <p className="text-[8px] text-[#74768B] uppercase">Velocity</p>
             <p className={`font-mono font-bold text-xs ${(gameState.speedMultiplier || 1) < 1 ? 'text-red-400' : 'text-green-400'}`}>
               {(gameState.speedMultiplier || 1).toFixed(2)}x
             </p>
          </div>

          {/* Cadencia / Attack Speed */}
          <div className="bg-black/40 p-2 border border-[#2A2C3E] col-span-2 flex justify-between items-center">
             <p className="text-[8px] text-[#74768B] uppercase">Sync_Rate</p>
             <p className="text-blue-400 font-mono font-bold text-[10px]">
               {gameState.attackSpeed || '1.00'}ms
             </p>
          </div>
        </div>

        {/* Footer del panel */}
        <div className="mt-3 text-[7px] text-[#74768B] font-mono flex justify-between items-center opacity-50">
          <span>SEC_LEVEL: 04</span>
          <span className="uppercase">OPERATOR_UNIT</span>
        </div>
      </div>
    </div>
  )
}