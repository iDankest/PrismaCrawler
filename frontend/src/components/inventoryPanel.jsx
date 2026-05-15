// src/components/InventoryPanel.jsx

import { ITEMS_DB } from "../data/itemsDatabase";
import { ItemTooltip } from "./ItemTooltip";

export function InventoryPanel({ inventory = [] }) {
  return (
    <div className=" flex flex-col gap-2">
      <h3 className="text-cyan-500 text-[10px] font-bold uppercase tracking-widest ml-1">
        Items ({inventory.length})
      </h3>

      {/* Contenedor Grid Estilo Isaac */}
      <div className="grid grid-cols-6 gap-1 bg-slate-900/40 p-2 rounded-lg border border-white/5 backdrop-blur-sm">
      <div className="grid grid-cols-6 gap-1 bg-slate-900/40 p-2 rounded-lg border border-white/5 backdrop-blur-sm">
        {inventory.map((itemId, index) => {
          const item = ITEMS_DB[itemId];
          if (!item) return null;

          return (
            <div
              key={`${itemId}-${index}`}
              title={item.name}
              className="w-8 h-8 bg-slate-800/80 border border-slate-700 flex items-center justify-center rounded-sm hover:scale-110 transition-transform cursor-help"
            >
              {/* EMOJI ICONO */}
              <span className="text-lg grayscale group-hover:grayscale-0">
                {item.spriteKey.includes("sword")
                  ? "⚔️"
                  : item.spriteKey.includes("potion")
                    ? "🧪"
                    : item.spriteKey.includes("beer")
                      ? "🍺"
                      : item.spriteKey.includes("mug")
                        ? "☕"
                        : item.spriteKey.includes("sack")
                          ? "🎒"
                          : "📦"}
              </span>

              {/* TOOLTIP */}
              <div className="hidden group-hover:block">
                <ItemTooltip item={item} isVisible={true} />
              </div>
            </div>
          );
        })}

        {/* Rellenar slots vacíos */}
        {[...Array(Math.max(0, 12 - inventory.length))].map((_, i) => (
          <div
            key={`empty-${i}`}
            className="w-8 h-8 border border-white/5 rounded-sm "
          />
        ))}
      </div>
    </div>
  );
}
