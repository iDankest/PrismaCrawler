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
    <div className="absolute right-0 top-0 w-64 h-auto p-4 space-y-2 z-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-cyan-500 rounded-lg p-3"
        style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}>
        <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-wider">⚔️ Stats</h3>
      </div>

      {/* HP BAR */}
      <div className="flex items-center gap-3 bg-slate-900/60 border border-cyan-500 rounded p-2 backdrop-blur-sm hover:bg-slate-900/80 transition-colors"
        style={{ boxShadow: 'inset 0 0 10px rgba(6, 182, 212, 0.1)' }}>
        <span className="text-lg">❤️</span>
        <div className="flex-1">
          <div className="h-2 bg-slate-700 rounded overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
              style={{ width: `${(gameState.hp / gameState.maxHp) * 100}%` }}
            />
          </div>
          <span className="text-xs text-red-300 font-mono">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
        </div>
      </div>

      {/* FLOOR */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-cyan-500 rounded p-2 backdrop-blur-sm hover:bg-slate-900/80 transition-colors"
        style={{ boxShadow: 'inset 0 0 10px rgba(6, 182, 212, 0.1)' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🏰</span>
          <span className="text-xs text-slate-300 font-mono">Floor</span>
        </div>
        <span className="text-sm font-bold text-cyan-400">{gameState.floor}</span>
      </div>

      {/* KILLS */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-cyan-500 rounded p-2 backdrop-blur-sm hover:bg-slate-900/80 transition-colors"
        style={{ boxShadow: 'inset 0 0 10px rgba(6, 182, 212, 0.1)' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">💀</span>
          <span className="text-xs text-slate-300 font-mono">Kills</span>
        </div>
        <span className="text-sm font-bold text-cyan-400">{gameState.kills}</span>
      </div>

      {/* CRYSTALS */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-cyan-500 rounded p-2 backdrop-blur-sm hover:bg-slate-900/80 transition-colors"
        style={{ boxShadow: 'inset 0 0 10px rgba(6, 182, 212, 0.1)' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">💎</span>
          <span className="text-xs text-slate-300 font-mono">Crystals</span>
        </div>
        <span className="text-sm font-bold text-cyan-400">{gameState.money}</span>
      </div>

      {/* MULTIPLICADORES */}
      <div className="border-t border-cyan-500/30 pt-2 mt-2">
        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Multipliers</div>
        
        {/* Damage */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-red-500/50 rounded p-2 mb-1 hover:border-red-500 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚡</span>
            <span className="text-xs text-slate-300">Damage</span>
          </div>
          <span className="text-xs font-mono text-red-400">{gameState.damageMultiplier.toFixed(2)}x</span>
        </div>

        {/* Speed - CON INDICADOR VISUAL */}
        <div className={`flex items-center justify-between bg-slate-900/60 border rounded p-2 transition-all ${
          gameState.speedMultiplier < 1 
            ? 'border-red-500/50 hover:border-red-500' 
            : 'border-green-500/50 hover:border-green-500'
        }`}>
          <div className="flex items-center gap-2">
            <span className={gameState.speedMultiplier < 1 ? 'text-red-400 animate-pulse' : 'text-green-400'}>💨</span>
            <span className="text-xs text-slate-300">Speed</span>
          </div>
          <span className={`text-xs font-mono ${gameState.speedMultiplier < 1 ? 'text-red-400 font-bold' : 'text-green-400'}`}>
            {gameState.speedMultiplier.toFixed(2)}x {gameState.speedMultiplier < 1 && '🐌'}
          </span>
        </div>

        {/* AttackSpeed */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-blue-500/50 rounded p-2 hover:border-blue-500 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚙️</span>
            <span className="text-xs text-slate-300">AtkSpd</span>
          </div>
          <span className="text-xs font-mono text-blue-400">{gameState.attackSpeedMultiplier.toFixed(2)}x</span>
        </div>
      </div>
    </div>
  )
}