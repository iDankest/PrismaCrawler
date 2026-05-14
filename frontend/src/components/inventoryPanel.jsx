// src/components/InventoryPanel.jsx
export function InventoryPanel({ inventory = [] }) {
  return (
    <div className="absolute left-4 bottom-4 z-50 flex flex-col gap-2">
      <h3 className="text-cyan-500 text-[10px] font-bold uppercase tracking-widest ml-1">Items</h3>
      
      {/* Contenedor Grid Estilo Isaac */}
      <div className="grid grid-cols-8 gap-1 bg-slate-900/40 p-2 rounded-lg border border-white/5 backdrop-blur-sm">
        {inventory.map((item, index) => (
          <div 
            key={index}
            title={item.name} // Al pasar el ratón se ve el nombre
            className="w-8 h-8 bg-slate-800/80 border border-slate-700 flex items-center justify-center rounded-sm hover:scale-110 transition-transform cursor-help group relative"
          >
            {/* Aquí podrías poner el sprite real, por ahora usamos un placeholder */}
            <span className="text-lg grayscale group-hover:grayscale-0">
              {item.spriteKey.includes('sword') ? '⚔️' : 
               item.spriteKey.includes('potion') ? '🧪' : 
               item.spriteKey.includes('beer') ? '🍺' : '📦'}
            </span>
            
            {/* Mini Tooltip que aparece al hacer hover */}
            <div className="absolute bottom-10 left-0 hidden group-hover:block bg-slate-900 text-cyan-400 text-[9px] p-2 rounded border border-cyan-500 w-32 z-50 shadow-2xl">
              <p className="font-bold">{item.name}</p>
              <p className="text-white/60 leading-tight">{item.description}</p>
            </div>
          </div>
        ))}
        
        {/* Rellenar slots vacíos (opcional, para mantener el grid) */}
        {[...Array(Math.max(0, 16 - inventory.length))].map((_, i) => (
          <div key={i} className="w-8 h-8 border border-white/5 rounded-sm" />
        ))}
      </div>
    </div>
  )
}