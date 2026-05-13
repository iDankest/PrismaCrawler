// src/components/StatsPanel.jsx

export function StatsPanel({ gameState }) {
  if (!gameState) return null

  return (
    <div className="absolute right-0 top-0 w-64 h-auto p-4 space-y-2 z-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-cyan-500 rounded-lg p-3"
        style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}>
        <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-wider">⚔️ Stats</h3>
      </div>

      {/* FILA 1: HP */}
      <div className="flex items-center gap-3 bg-slate-900/60 border border-cyan-500 rounded p-2 backdrop-blur-sm hover:bg-slate-900/80 transition-colors"
        style={{ boxShadow: 'inset 0 0 10px rgba(6, 182, 212, 0.1)' }}>
        <span className="text-lg">❤️</span>
        <div className="flex-1">
          <div className="h-2 bg-slate-700 rounded overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all"
              style={{ width: `${(gameState.hp / gameState.maxHp) * 100}%` }}
            />
          </div>
          <span className="text-xs text-red-300 font-mono">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
        </div>
      </div>

      {/* FILA 2: FLOOR */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-cyan-500 rounded p-2 backdrop-blur-sm hover:bg-slate-900/80 transition-colors"
        style={{ boxShadow: 'inset 0 0 10px rgba(6, 182, 212, 0.1)' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🏰</span>
          <span className="text-xs text-slate-300 font-mono">Floor</span>
        </div>
        <span className="text-sm font-bold text-cyan-400">{gameState.floor}</span>
      </div>

      {/* FILA 3: KILLS */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-cyan-500 rounded p-2 backdrop-blur-sm hover:bg-slate-900/80 transition-colors"
        style={{ boxShadow: 'inset 0 0 10px rgba(6, 182, 212, 0.1)' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">💀</span>
          <span className="text-xs text-slate-300 font-mono">Kills</span>
        </div>
        <span className="text-sm font-bold text-cyan-400">{gameState.kills}</span>
      </div>

      {/* FILA 4: DINERO */}
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

        {/* Speed */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-green-500/50 rounded p-2 hover:border-green-500 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-sm">💨</span>
            <span className="text-xs text-slate-300">Speed</span>
          </div>
          <span className="text-xs font-mono text-green-400">{gameState.speedMultiplier.toFixed(2)}x</span>
        </div>
      </div>
    </div>
  )
}