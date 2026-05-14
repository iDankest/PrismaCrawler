// src/data/itemsDatabase.js

import api from '../api/axios'

/**
 * ✅ ITEMS LOCALES (FALLBACK si Supabase no responde)
 */
export const LOCAL_ITEMS_DB = {
  item_sword: {
    id: 'item_sword',
    name: 'Iron Sword',
    icon: '⚔️',
    description: '+50% Damage',
    rarity: 'rare',
    color: 0xFF6B6B,
    effects: [{ type: 'damageMultiplier', value: 1.5 }],
    spriteKey: 'item_sword'
  },
  item_beer: {
    id: 'item_beer',
    name: 'Ale of Haste',
    icon: '🍺',
    description: '+30% Attack Speed',
    rarity: 'uncommon',
    color: 0xFFB347,
    effects: [{ type: 'attackSpeedMultiplier', value: 1.3 }],
    spriteKey: 'item_beer'
  },
  item_mug: {
    id: 'item_mug',
    name: 'Mug of Swiftness',
    icon: '🍵',
    description: '+40% Movement Speed',
    rarity: 'uncommon',
    color: 0x87CEEB,
    effects: [{ type: 'speedMultiplier', value: 1.4 }],
    spriteKey: 'item_mug'
  },
  item_sack: {
    id: 'item_sack',
    name: 'Sack of Vitality',
    icon: '🎒',
    description: '+50 Max HP',
    rarity: 'common',
    color: 0xB8860B,
    effects: [{ type: 'maxHpBoost', value: 50 }],
    spriteKey: 'item_sack'
  },
  item_potion: {
    id: 'item_potion',
    name: 'Health Potion',
    icon: '🧪',
    description: 'Restore 30 HP',
    rarity: 'common',
    color: 0xFF1493,
    effects: [{ type: 'heal', value: 30 }],
    spriteKey: 'item_potion',
    consumable: true
  },
  item_tea: {
    id: 'item_tea',
    name: 'Magical Tea',
    icon: '🍃',
    description: '+10% Movement Speed',
    rarity: 'common',
    color: 0x4EAF4E,
    effects: [{ type: 'speedMultiplier', value: 1.1 }],
    spriteKey: 'item_tea'
  }
}

/**
 * ✅ ESTADO GLOBAL DE ITEMS (sincronizado con DB)
 */
let ITEMS_DB = { ...LOCAL_ITEMS_DB }

/**
 * 📡 CARGAR ITEMS DESDE SUPABASE
 */
export const loadItemsFromDatabase = async () => {
  try {
    console.log('📡 Cargando items desde Supabase...')
    
    // 1. Hacer request a tu backend
    const response = await api.get('/game/items')
    
    // 2. Tu controller devuelve { success: true, data: [...] }
    const dbItems = response.data.data || []
    
    if (dbItems.length === 0) {
      console.warn('⚠️ No hay items en la BD, usando items locales')
      return ITEMS_DB
    }
    
    // 3. Convertir items de DB al formato que espera Phaser
    const itemsMap = {}
    dbItems.forEach(item => {
      itemsMap[item.spriteKey] = {
        id: item.id,
        name: item.name,
        icon: getIconForItem(item.spriteKey),
        description: item.description,
        rarity: item.rarity,
        color: getRarityColor(item.rarity),
        effects: item.effects || [], // Ya viene del JSON en la DB
        spriteKey: item.spriteKey,
        consumable: item.isConsumable || false
      }
    })
    
    // 4. Guardar en variable global
    ITEMS_DB = itemsMap
    console.log('✅ Items cargados desde Supabase:', Object.keys(ITEMS_DB))
    
    return ITEMS_DB
  } catch (error) {
    console.error('❌ Error cargando items desde BD:', error.message)
    console.warn('⚠️ Usando items locales como fallback')
    ITEMS_DB = { ...LOCAL_ITEMS_DB }
    return ITEMS_DB
  }
}

/**
 * 🎲 OBTENER ITEM ALEATORIO
 */
export const getRandomItem = () => {
  const itemKeys = Object.keys(ITEMS_DB)
  if (itemKeys.length === 0) {
    console.error('❌ No hay items cargados')
    return LOCAL_ITEMS_DB.item_potion // Fallback
  }
  
  const randomKey = itemKeys[Math.floor(Math.random() * itemKeys.length)]
  return ITEMS_DB[randomKey]
}

/**
 * 📋 OBTENER TODOS LOS ITEMS
 */
export const getAllItems = () => {
  return Object.values(ITEMS_DB)
}

/**
 * 🎨 HELPERS
 */
const getIconForItem = (spriteKey) => {
  const iconMap = {
    'item_sword': '⚔️',
    'item_beer': '🍺',
    'item_mug': '☕',
    'item_tea': '🍃',
    'item_sack': '🎒',
    'item_potion': '🧪'
  }
  return iconMap[spriteKey] || '📦'
}

const getRarityColor = (rarity) => {
  const colorMap = {
    'common': 0x808080,
    'uncommon': 0x0ea5e9,
    'rare': 0xfbbf24,
    'epic': 0xd946ef
  }
  return colorMap[rarity] || 0xffffff
}

/**
 * ✅ EXPORTAR LA DB GLOBAL
 */
export { ITEMS_DB }