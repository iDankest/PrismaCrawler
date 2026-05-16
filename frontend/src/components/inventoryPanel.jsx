// src/components/inventoryPanel.jsx

import { ITEMS_DB } from '../data/itemsDatabase'
import { useState } from 'react'

export function InventoryPanel({ inventory = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  // --- LÓGICA DE STACKING ---
  // Transformamos el array plano [id1, id1, id2] en [{id: id1, count: 2}, {id: id2, count: 1}]
  const stackedInventory = inventory.reduce((acc, itemId) => {
    const existingItem = acc.find(slot => slot.id === itemId)
    if (existingItem) {
      existingItem.count += 1
    } else {
      acc.push({ id: itemId, count: 1 })
    }
    return acc
  }, [])

  return (
    <div className="relative w-56 z-50 group pointer-events-auto">
      {/* Decoración de esquinas (Picos) */}
      <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#BBC3FF] z-20"></div>
      <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#BBC3FF] z-20"></div>

      <div className="bg-[#1D2240]/90 border-2 border-[#74768B] p-3 backdrop-blur-sm shadow-2xl">
        {/* Header estilo Sistema */}
        <div className="flex justify-between items-center mb-3 border-b border-[#74768B]/30 pb-2">
          <span className="text-[#BBC3FF] font-black text-[9px] uppercase tracking-[0.2em]">
             Storage_Unit
          </span>
          <span className="text-[9px] font-mono text-[#74768B]">
            {stackedInventory.length}/16
          </span>
        </div>

        {/* Grid 4x4 */}
        <div className="grid grid-cols-4 gap-2">
          {Array(16).fill(null).map((_, idx) => {
            const slot = stackedInventory[idx]
            const item = slot ? ITEMS_DB[slot.id] : null

            // Colores por rareza
            const rarityBorder = {
              common: 'border-[#74768B]/30',
              rare: 'border-blue-500/50',
              epic: 'border-purple-500/50',
              legendary: 'border-yellow-500/50 shadow-[0_0_5px_rgba(250,204,21,0.2)]'
            }

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`
                  relative w-10 h-10 flex items-center justify-center rounded-sm transition-all duration-200
                  ${item ? 'bg-black/40 cursor-help border' : 'bg-black/10 border border-dashed border-[#74768B]/20'}
                  ${item ? rarityBorder[item.rarity] || rarityBorder.common : ''}
                  hover:scale-105 hover:border-[#BBC3FF]
                `}
              >
                {item ? (
                  <>
                    {/* EMOJI O ICONO */}
                    <span className="text-lg grayscale-[0.5] hover:grayscale-0">
                      {item.spriteKey?.includes('sword') ? '⚔️' : 
                       item.spriteKey?.includes('potion') ? '🧪' : '📦'}
                    </span>

                    {/* CONTADOR DE STACK (El "x2") */}
                    {slot.count > 1 && (
                      <div className="absolute -bottom-1 -right-1 bg-[#4D61FF] text-white text-[8px] font-bold px-1 rounded-sm border border-white/20 shadow-lg">
                        {slot.count}
                      </div>
                    )}

                    {/* TOOLTIP MINIMALISTA */}
                    {hoveredIdx === idx && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 z-[100] pointer-events-none animate-in fade-in zoom-in duration-150">
                        <div className="bg-[#1D2240] border border-[#BBC3FF] p-2 shadow-2xl">
                          <p className="text-[9px] font-black text-[#BBC3FF] uppercase truncate">{item.name}</p>
                          <p className="text-[7px] text-cyan-400 font-mono italic">x{slot.count} unidades</p>
                        </div>
                        <div className="w-2 h-2 bg-[#1D2240] border-r border-b border-[#BBC3FF] rotate-45 mx-auto -mt-[5px]"></div>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-[#74768B]/20 text-[10px]">+</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}