// src/components/ItemTooltip.jsx

export function ItemTooltip({ item, isVisible }) {
  if (!isVisible) return null;

  // --- PLACEHOLDER POR DEFECTO ---
  const defaultItem = {
    name: "UNKNOWN_OBJECT",
    rarity: "common",
    description: "No data available for this sector unit.",
    id: "000",
    stats: {}
  };

  // Combinamos los datos: si falta algo en 'item', usamos el 'defaultItem'
  const data = { ...defaultItem, ...item };

  const rarityColors = {
    common: 'text-slate-400 border-slate-500',
    rare: 'text-blue-400 border-blue-500',
    epic: 'text-purple-400 border-purple-500',
    legendary: 'text-yellow-400 border-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.3)]'
  };

  const colorClass = rarityColors[data.rarity] || rarityColors.common;
  const statsEntries = Object.entries(data.stats || {});

  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 z-10 pointer-events-none animate-in fade-in zoom-in duration-150">
      <div className="bg-[#1D2240]/95 border-2 border-[#74768B] p-3 backdrop-blur-md shadow-2xl relative">
        
        {/* Picos decorativos */}
        <div className="absolute top-1 left-1 w-1 h-1 border-t border-l border-[#BBC3FF]"></div>
        <div className="absolute top-1 right-1 w-1 h-1 border-t border-r border-[#BBC3FF]"></div>

        {/* Nombre y Rareza */}
        <div className="border-b border-[#74768B]/30 pb-2 mb-2">
          <h4 className={`text-[11px] font-black uppercase tracking-tighter ${colorClass}`}>
            {data.name}
          </h4>
          <p className="text-[7px] text-[#74768B] tracking-[0.2em] font-mono">
            ID_{data.id} | {data.rarity.toUpperCase()}
          </p>
        </div>

        {/* Descripción */}
        <p className="text-[10px] text-[#BBC3FF] leading-tight mb-3 italic">
          "{data.description}"
        </p>

        {/* Stats del ítem / Placeholder de Stats */}
        <div className="grid grid-cols-1 gap-1">
          {statsEntries.length > 0 ? (
            statsEntries.map(([key, value]) => (
              <div key={key} className="flex justify-between items-center bg-black/40 px-2 py-1 border border-[#2A2C3E]">
                <span className="text-[8px] text-[#74768B] uppercase">{key.replace('_', ' ')}</span>
                <span className="text-[9px] font-mono text-[#4D61FF]">
                  {value > 0 ? `+${value}` : value}
                </span>
              </div>
            ))
          ) : (
            /* Placeholder si no hay stats */
            <div className="flex justify-center items-center py-1 border border-dashed border-[#2A2C3E] opacity-50">
              <span className="text-[7px] text-[#74768B] uppercase tracking-widest">No_Modifications</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Triangulito inferior */}
      <div className="w-3 h-3 bg-[#1D2240] border-r-2 border-b-2 border-[#74768B] rotate-45 mx-auto -mt-[7px]"></div>
    </div>
  );
}