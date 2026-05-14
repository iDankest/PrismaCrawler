// src/components/GameStatsPanel.jsx

import { useState, useEffect } from 'react'

export function GameStatsPanel({ gameState }) {
  if (!gameState) return null

  // ✅ Detectar cambios en multiplicadores para animación
  const [prevSpeed, setPrevSpeed] = useState(gameState.speedMultiplier)
  const [speedChanged, setSpeedChanged] = useState(false)
  const [damageChanged, setDamageChanged] = useState(false)
  const [hpChanged, setHpChanged] = useState(false)

  useEffect(() => {
    // Detectar cambio de velocidad
    if (gameState.speedMultiplier !== prevSpeed) {
      setSpeedChanged(true)
      setPrevSpeed(gameState.speedMultiplier)
      setTimeout(() => setSpeedChanged(false), 500)
    }
  }, [gameState.speedMultiplier, prevSpeed])

  useEffect(() => {
    // Detectar cambio de daño
    setDamageChanged(true)
    setTimeout(() => setDamageChanged(false), 500)
  }, [gameState.damageMultiplier])

  useEffect(() => {
    // Detectar cambio de HP
    setHpChanged(true)
    setTimeout(() => setHpChanged(false), 500)
  }, [gameState.hp])

  return (
    <div className="absolute left-4 top-4 z-50 flex flex-col gap-2">
      <h3 className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest ml-1">Stats</h3>
      
      {/* Contenedor Grid Estilo Isaac */}
      <div className="bg-slate-900/40 p-2 rounded-lg border border-white/5 backdrop-blur-sm space-y-1">
        
        {/* HP - Barra visual */}
        <div className={`flex items-center gap-2 text-[11px] transition-all ${hpChanged ? 'scale-105' : 'scale-100'}`}>
          <span className="text-red-400 font-bold">❤️</span>
          <div className="flex-1 h-3 bg-slate-800/80 border border-red-500/50 rounded-sm overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300"
              style={{ width: `${(gameState.hp / gameState.maxHp) * 100}%` }}
            />
          </div>
          <span className="text-red-300 font-mono w-14 text-right">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
        </div>

        {/* Floor */}
        <div className="flex items-center justify-between text-[11px] px-2 py-1 bg-slate-800/50 rounded border border-white/10">
          <span>
            <span className="text-yellow-400">🏰</span> Floor
          </span>
          <span className="text-yellow-300 font-bold">{gameState.floor}</span>
        </div>

        {/* Kills */}
        <div className="flex items-center justify-between text-[11px] px-2 py-1 bg-slate-800/50 rounded border border-white/10">
          <span>
            <span className="text-cyan-400">💀</span> Kills
          </span>
          <span className="text-cyan-300 font-bold">{gameState.kills}</span>
        </div>

        {/* Money/Crystals */}
        <div className="flex items-center justify-between text-[11px] px-2 py-1 bg-slate-800/50 rounded border border-white/10">
          <span>
            <span className="text-purple-400">💎</span> Crystals
          </span>
          <span className="text-purple-300 font-bold">{gameState.money}</span>
        </div>

        {/* Multiplicadores en una fila compacta */}
        <div className="mt-2 pt-2 border-t border-white/10 text-[9px] space-y-0.5">
          
          {/* Damage */}
          <div className={`flex items-center justify-between px-2 transition-all ${damageChanged ? 'scale-110 text-orange-200' : 'scale-100'}`}>
            <span className="text-orange-400">⚡ DMG</span>
            <span className="text-orange-300 font-mono">{gameState.damageMultiplier.toFixed(2)}x</span>
          </div>

          {/* Speed - CON INDICADOR VISUAL DE LENTITUD */}
          <div className={`flex items-center justify-between px-2 transition-all ${speedChanged ? 'scale-110' : 'scale-100'}`}>
            <span className={`${gameState.speedMultiplier < 1 ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
              💨 SPD
            </span>
            <span className={`font-mono ${gameState.speedMultiplier < 1 ? 'text-red-300 font-bold' : 'text-green-300'}`}>
              {gameState.speedMultiplier.toFixed(2)}x
              {gameState.speedMultiplier < 1 && ' 🐌'}
            </span>
          </div>

          {/* AttackSpeed */}
          <div className="flex items-center justify-between px-2">
            <span className="text-blue-400">⚙️ ATK</span>
            <span className="text-blue-300 font-mono">{gameState.attackSpeedMultiplier.toFixed(2)}x</span>
          </div>
        </div>
      </div>
    </div>
  )
}