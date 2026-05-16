import { useState } from 'react'
import api from '../api/axios'
import { Sword, BookOpen } from 'pixelarticons/react'

export function ControlsPanel() {
  const [activeTab, setActiveTab] = useState('controls')
  const [allItems, setAllItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(false)
  const [selectedItemIdx, setSelectedItemIdx] = useState(0)

  const loadAllItems = async () => {
    if (allItems.length > 0) return
    setLoadingItems(true)
    try {
      const res = await api.get('/game/items')
      setAllItems(res.data.data || [])
    } catch (err) {
      console.error('Error_Loading_Database:', err)
    } finally {
      setLoadingItems(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'items') loadAllItems()
  }

  const currentItem = allItems[selectedItemIdx]

  return (
    <div className=" bg-[#1D2240]/95 border-2 border-[#74768B] shadow-[0_0_25px_rgba(0,0,0,0.8)] z-60 overflow-hidden backdrop-blur-md">
      
      {/* HEADER / PESTAÑAS */}
      <div className="flex bg-black/40 border-b border-[#74768B]/30">
        <TabButton 
          active={activeTab === 'controls'} 
          onClick={() => handleTabChange('controls')}
          label="Manual_Combate"
          icon={<Sword size={16} />}
        />
        <TabButton 
          active={activeTab === 'items'} 
          onClick={() => handleTabChange('items')}
          label="Archivo_Datos"
          icon={<BookOpen size={16} />}
        />
      </div>

      {/* ÁREA DE CONTENIDO */}
      <div className="p-4 h-48 overflow-y-auto custom-scrollbar">
        {activeTab === 'controls' ? (
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 animate-in fade-in duration-300">
            <ControlRow label="Navegación" value="WASD" />
            <ControlRow label="Ataque_Principal" value="L-CLICK / J" />
            <ControlRow label="Modo_Especial" value="R-CLICK / K" />
            <ControlRow label="Interacción" value="E" />
            <ControlRow label="Inventario" value="I" />
            <ControlRow label="Secuencia_Escape" value="ESC" />
          </div>
        ) : (
          <div className="flex gap-4 animate-in slide-in-from-bottom-2 duration-300">
            {/* Barra lateral de lista */}
            <div className="w-1/3 border-r border-[#74768B]/20 pr-2 space-y-1 overflow-y-auto h-40">
              {loadingItems ? (
                <div className="text-[10px] text-[#74768B] animate-pulse">Sincronizando_Base_Datos...</div>
              ) : (
                allItems.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    onClick={() => setSelectedItemIdx(idx)}
                    className={`w-full text-left px-2 py-1 text-[10px] uppercase transition-colors ${
                      selectedItemIdx === idx 
                      ? 'bg-[#4D61FF] text-white' 
                      : 'text-[#74768B] hover:bg-[#4D61FF]/10'
                    }`}
                  >
                    {item.name}
                  </button>
                ))
              )}
            </div>

            {/* Detalles del objeto */}
            {currentItem && (
              <div className="flex-1 flex gap-4">
                {/* Previsualización del Sprite */}
                <div className="w-16 h-16 bg-black/60 border border-[#74768B]/50 flex items-center justify-center p-2 self-start shrink-0">
                   <span className="text-3xl grayscale-[0.5]">{itemIcon(currentItem)}</span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <h4 className="text-[#BBC3FF] font-black text-sm uppercase leading-none">{currentItem.name}</h4>
                    <span className="text-[8px] text-cyan-400 opacity-70">ID_REF: {currentItem.id || 'N/A'}</span>
                  </div>
                  <p className="text-[10px] text-[#74768B] italic leading-tight">"{currentItem.description}"</p>
                  
                  {currentItem.stats && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {Object.entries(currentItem.stats).map(([key, val]) => (
                        <div key={key} className="text-[8px] bg-[#4D61FF]/20 text-[#BBC3FF] px-2 py-0.5 border border-[#4D61FF]/30">
                          {key.toUpperCase()}: +{val}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pie Decorativo */}
      <div className="bg-[#4D61FF]/10 py-1 px-4 flex justify-between items-center">
        <span className="text-[7px] text-[#4D61FF] font-black tracking-widest uppercase">Vínculo_Sistema_Activo</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-[#4D61FF] animate-pulse"></div>
          <div className="w-1 h-1 bg-[#4D61FF]/40"></div>
        </div>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTES AUXILIARES ---

function TabButton({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 px-4 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2
        ${active ? 'bg-[#1D2240] text-[#BBC3FF] border-b-2 border-[#4D61FF]' : 'text-[#74768B] hover:bg-[#4D61FF]/5'}
      `}
    >
      <span>{icon}</span> {label}
    </button>
  )
}

function ControlRow({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b border-[#74768B]/10 py-1">
      <span className="text-[10px] text-[#74768B] uppercase">{label}</span>
      <span className="text-[10px] text-[#BBC3FF] font-bold bg-[#4D61FF]/10 px-2 rounded border border-[#4D61FF]/20">{value}</span>
    </div>
  )
}

function itemIcon(item) {
  if (item.spriteKey?.includes('sword')) return '⚔️'
  if (item.spriteKey?.includes('potion')) return '🧪'
  if (item.spriteKey?.includes('ring')) return '💍'
  return '📦'
}