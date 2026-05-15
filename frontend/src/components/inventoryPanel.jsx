// src/components/InventoryPanel.jsx

import { ITEMS_DB } from '../data/itemsDatabase'

export function InventoryPanel({ inventory = [] }) {
  return (
<<<<<<< HEAD
    <div className="left-4 bottom-4 z-50 flex flex-col gap-2">
      <h3 className="text-cyan-500 text-[10px] font-bold uppercase tracking-widest ml-1">
        Items ({inventory.length})
      </h3>
      
      {/* Contenedor Grid Estilo Isaac */}
      <div className="grid grid-cols-8 gap-1 bg-slate-900/40 p-2 rounded-lg border border-white/5 backdrop-blur-sm">
        {inventory.map((itemId, index) => {
          const item = ITEMS_DB[itemId]
          if (!item) return null

          return (
            <div 
              key={`${itemId}-${index}`}
              title={item.name}
              className="w-8 h-8 bg-slate-800/80 border border-slate-700 flex items-center justify-center rounded-sm hover:scale-110 transition-transform cursor-help"
            >
              {/* EMOJI ICONO */}
              <span className="text-lg grayscale group-hover:grayscale-0">
                {item.spriteKey.includes('sword') ? '⚔️' : 
                 item.spriteKey.includes('potion') ? '🧪' : 
                 item.spriteKey.includes('beer') ? '🍺' :
                 item.spriteKey.includes('mug') ? '☕' :
                 item.spriteKey.includes('sack') ? '🎒' : '📦'}
              </span>
              
              {/* TOOLTIP */}
              <div className="absolute bottom-10 left-0 hidden group-hover:block bg-slate-900 text-cyan-400 text-[9px] p-2 rounded border border-cyan-500 w-32 z-50 shadow-2xl">
                <p className="font-bold">{item.name}</p>
                <p className="text-white/60 leading-tight text-[8px]">{item.description}</p>
                <p className="text-yellow-400 text-[8px] mt-1 capitalize">{item.rarity}</p>
              </div>
            </div>
          )
        })}
        
        {/* Rellenar slots vacíos */}
        {[...Array(Math.max(0, 16 - inventory.length))].map((_, i) => (
          <div key={`empty-${i}`} className="w-8 h-8 border border-white/5 rounded-sm " />
        ))}
=======
    <div className="absolute right-0 bottom-0 w-64 h-auto p-4 z-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-cyan-500 rounded-lg p-3 mb-3"
        style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}>
        <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-wider">🎒 Inventory</h3>
        <span className="text-xs text-slate-400">{inventory.length} items</span>
>>>>>>> origin/main
      </div>

      {/* INVENTARIO VACIO */}
      {inventory.length === 0 && (
        <div className="bg-slate-900/60 border border-slate-700 rounded p-6 text-center">
          <p className="text-slate-400 text-xs">Derrota enemigos y abre cofres</p>
          <p className="text-slate-500 text-xs">para obtener items</p>
        </div>
      )}

      {/* ITEMS */}
      {inventory.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {inventory.map((itemId, index) => {
            const itemData = ITEMS_DB[itemId]
            if (!itemData) return null

            return (
              <div 
                key={`${itemId}-${index}`}
                className="bg-slate-900/60 border-2 rounded p-3 hover:bg-slate-900/80 transition-all hover:shadow-lg cursor-pointer group"
                style={{ 
                  borderColor: `#${itemData.color.toString(16).padStart(6, '0')}`,
                  boxShadow: `inset 0 0 10px rgba(${(itemData.color >> 16) & 255}, ${(itemData.color >> 8) & 255}, ${itemData.color & 255}, 0.1)`
                }}
              >
                <div className="flex items-start gap-2">
                  {/* ICONO */}
                  <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {itemData.icon}
                  </div>

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-100 truncate">
                      {itemData.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {itemData.description}
                    </p>
                    
                    {/* RARITY BADGE */}
                    <div className="mt-1 inline-block">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                        itemData.rarity === 'rare' ? 'bg-yellow-900/50 text-yellow-400' :
                        itemData.rarity === 'uncommon' ? 'bg-blue-900/50 text-blue-400' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {itemData.rarity.toUpperCase()}
                      </span>
                    </div>

                    {/* USAR BUTTON (solo para consumibles) */}
                    {itemData.consumable && (
                      <button className="mt-2 w-full px-2 py-1 text-xs bg-cyan-600/50 hover:bg-cyan-600 text-cyan-100 rounded border border-cyan-500 transition-colors">
                        Use
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* STATS */}
      {inventory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 uppercase font-bold mb-2">Perks</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>📊 {inventory.length} activos</p>
            <p>⭐ Sigue recolectando items</p>
          </div>
        </div>
      )}
    </div>
  )
}