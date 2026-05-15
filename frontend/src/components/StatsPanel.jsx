// src/components/StatsPanel.jsx

import { useState, useEffect } from 'react'

export function StatsPanel({ gameState }) {
  if (!gameState) return null

  const [speedChanged, setSpeedChanged] = useState(false)

  useEffect(() => {
    setSpeedChanged(true)
    const timer = setTimeout(() => setSpeedChanged(false), 500)
    return () => clearTimeout(timer)
  }, [gameState.speedMultiplier])

 return (
    <div className="relative  w-64 z-50 group">
      {/* Picos de acentuación del HUD */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-[#BBC3FF] z-20"></div>
      <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#BBC3FF] z-20"></div>
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-[#BBC3FF] z-20"></div>
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-[#BBC3FF] z-20"></div>

      <div className="bg-[#1D2240]/90 border-2 border-[#74768B] p-4 backdrop-blur-sm shadow-2xl">
        <h3 className="text-[#BBC3FF] font-black text-[10px] uppercase tracking-[0.3em] mb-4 border-b border-[#74768B]/30 pb-2">
          &gt; System_Stats
        </h3>
        
        {/* Barra de Vida Estilo Dungeon */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-[9px] font-mono text-blue-300">
            <span>VITAL_SIGNS</span>
            <span>{gameState.hp}/{gameState.maxHp}</span>
          </div>
          <div className="w-full h-3 bg-slate-900 border border-[#74768B]/50 p-[2px]">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
              style={{ width: `${(gameState.hp / gameState.maxHp) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Otros stats en rejilla */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/40 p-2 border border-[#2A2C3E]">
             <p className="text-[8px] text-[#74768B]">ATK_PWR</p>
             <p className="text-[#BBC3FF] font-mono font-bold">{gameState.damageMultiplier}x</p>
          </div>
          <div className="bg-black/40 p-2 border border-[#2A2C3E]">
             <p className="text-[8px] text-[#74768B]">VELOCITY</p>
             <p className="text-[#BBC3FF] font-mono font-bold">{gameState.speedMultiplier}x</p>
          </div>
        </div>
      </div>
    </div>
  )
}