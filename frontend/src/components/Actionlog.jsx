import { useEffect, useState, useRef } from 'react'

export function ActionLog({ gameState }) {
  const [logs, setLogs] = useState([
    { id: 0, text: 'SYSTEM_INITIALIZED: Welcome to the abyss...', color: '#4D61FF' },
    { id: 1, text: 'GEAR_CHECK: Pulse-blade equipped.', color: '#74768B' },
  ])
  const scrollRef = useRef(null)

  // Sincronizar logs con los eventos del juego
  useEffect(() => {
    if (gameState?.lastAction) {
      const color = gameState.lastActionColor || '#BBC3FF'
      addLog(gameState.lastAction, color)
    }
  }, [gameState?.lastAction])

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const addLog = (text, color) => {
    const newLog = {
      id: Date.now(),
      text: `> ${text.toUpperCase()}`,
      color: color,
    }
    setLogs(prev => [...prev.slice(-14), newLog]) // Mantenemos 15 líneas para que se vea lleno
  }

  return (
    <div className="absolute bottom-4 left-4 w-72 z-50 group pointer-events-none">
      {/* Decoración de esquina superior izquierda */}
      <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#4D61FF] z-20"></div>

      <div className="bg-[#1D2240]/80 border-2 border-[#74768B]/40 backdrop-blur-sm p-3 shadow-2xl relative overflow-hidden">
        
        {/* Efecto de línea de escaneo (Scanline) */}
        <div className="absolute inset-0 bg-scanline pointer-events-none opacity-10"></div>
        
        {/* Header del Log */}
        <div className="flex justify-between items-center mb-2 border-b border-[#74768B]/20 pb-1">
          <span className="text-[9px] font-black text-[#4D61FF] tracking-[0.2em]">EVENT_LOG</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-green-500 animate-pulse rounded-full"></div>
            <span className="text-[7px] text-[#74768B] font-mono">LIVE_FEED</span>
          </div>
        </div>

        {/* Lista de Mensajes */}
        <div 
          ref={scrollRef}
          className="h-32 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1"
        >
          {logs.map((log) => (
            <div
              key={log.id}
              style={{ color: log.color }}
              className="text-[10px] font-mono leading-tight tracking-tight animate-in slide-in-from-left-2 duration-200"
            >
              <span className="opacity-40 mr-1">[{new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}]</span>
              {log.text}
            </div>
          ))}
        </div>

        {/* Footer decorativo con coordenadas (fake) */}
        <div className="mt-2 flex justify-between opacity-30">
          <span className="text-[6px] text-[#74768B] font-mono">LOC: 34.99 // -12.04</span>
          <span className="text-[6px] text-[#74768B] font-mono">SIGNAL: STABLE</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4D61FF; }
        .bg-scanline {
          background: linear-gradient(to bottom, transparent 50%, rgba(77, 97, 255, 0.1) 50%);
          background-size: 100% 4px;
        }
      `}} />
    </div>
  )
}