export function StatsPanel({ gameState }) {
  if (!gameState) return null;

  return (
    <div className="bg-slate-900/80 border-2 border-cyan-500 p-4 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] backdrop-blur-sm text-white font-mono w-full pointer-events-none">
      <h2 className="text-cyan-400 font-black text-xl mb-2 text-center uppercase tracking-widest border-b border-cyan-500/50 pb-2">
        Hero Stats
      </h2>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center bg-slate-800/50 p-1 px-2 rounded">
          <span>❤️ HP:</span>
          <span className={gameState.hp <= 30 ? "text-red-400 font-bold animate-pulse" : "text-green-400 font-bold"}>
            {Math.round(gameState.hp)} / {gameState.maxHp}
          </span>
        </div>
        <div className="flex justify-between items-center bg-slate-800/50 p-1 px-2 rounded">
          <span>✨ XP:</span>
          <span className="text-yellow-400 font-bold">{gameState.xp}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-800/50 p-1 px-2 rounded">
          <span>🏰 Floor:</span>
          <span className="text-purple-400 font-bold">{gameState.floor}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-800/50 p-1 px-2 rounded">
          <span>💀 Kills:</span>
          <span className="text-red-500 font-bold">{gameState.kills}</span>
        </div>
      </div>

      <h3 className="text-cyan-500 text-xs font-bold mt-4 mb-2 uppercase text-center">Bonuses</h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-800/50 p-2 rounded text-center border border-slate-700">
          <div className="text-slate-400 mb-1">⚔️ Damage</div>
          <div className="font-bold text-orange-400">x{gameState.damageMultiplier.toFixed(2)}</div>
        </div>
        <div className="bg-slate-800/50 p-2 rounded text-center border border-slate-700">
          <div className="text-slate-400 mb-1">💨 Speed</div>
          <div className="font-bold text-blue-400">x{gameState.speedMultiplier.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}