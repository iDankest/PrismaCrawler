// src/data/itemsDatabase.js

/**
 * 💾 ITEMS LOCALES (FALLBACK cuando no hay conexión)
 */
export const LOCAL_ITEMS = {
  /* item_sword: {
    id: 'item_sword',
    name: 'Iron Sword',
    description: '+50% Damage',
    rarity: 'rare',
    effects: [{ type: 'damageMultiplier', value: 1.5 }],
    spriteKey: 'item_sword',
    consumable: false
  },
  item_beer: {
    id: 'item_beer',
    name: 'Ale of Haste',
    description: '+30% Attack Speed',
    rarity: 'uncommon',
    effects: [{ type: 'attackSpeedMultiplier', value: 1.3 }],
    spriteKey: 'item_beer',
    consumable: false
  },
  item_mug: {
    id: 'item_mug',
    name: 'Mug of Swiftness',
    description: '+40% Movement Speed',
    rarity: 'uncommon',
    effects: [{ type: 'speedMultiplier', value: 1.4 }],
    spriteKey: 'item_mug',
    consumable: false
  },
  item_sack: {
    id: 'item_sack',
    name: 'Sack of Vitality',
    description: '+50 Max HP',
    rarity: 'common',
    effects: [{ type: 'maxHpBoost', value: 50 }],
    spriteKey: 'item_sack',
    consumable: false
  },
  item_potion: {
    id: 'item_potion',
    name: 'Health Potion',
    description: 'Restore 30 HP',
    rarity: 'common',
    effects: [{ type: 'heal', value: 30 }],
    spriteKey: 'item_potion',
    consumable: true
  } */
}

/**
 * 🎲 ESTADO GLOBAL
 */
let ITEMS_DB = { ...LOCAL_ITEMS }

/**
 * 📌 INICIALIZAR CON ITEMS CACHEADOS (llamado desde PhaserGame)
 */
export const initializeItemsDB = (cachedItems) => {
  if (cachedItems && Object.keys(cachedItems).length > 0) {
    ITEMS_DB = cachedItems
    console.log('✅ ItemsDB inicializado con cache')
    return
  }
  
  // Si no hay cache, usar locales
  ITEMS_DB = { ...LOCAL_ITEMS }
  console.log('⚠️ ItemsDB usando items locales')
}

/**
 * 🎲 OBTENER ITEM ALEATORIO
 */
export const getRandomItem = () => {
  const itemKeys = Object.keys(ITEMS_DB)
  if (itemKeys.length === 0) {
    console.warn('⚠️ No items disponibles, usando potion')
    return LOCAL_ITEMS.item_potion
  }
  
  const randomKey = itemKeys[Math.floor(Math.random() * itemKeys.length)]
  return ITEMS_DB[randomKey]
}

/**
 * 📋 OBTENER UN ITEM POR SPRITEKEY
 */
export const getItemBySpriteKey = (spriteKey) => {
  return ITEMS_DB[spriteKey] || LOCAL_ITEMS.item_potion
}

/**
 * 📋 OBTENER TODOS
 */
export const getAllItems = () => {
  return Object.values(ITEMS_DB)
}

/**
 * 📤 EXPORTAR DB GLOBAL
 */
export { ITEMS_DB }
// src/data/itemDatabase.js

export const ITEM_TYPES = {
  SWORD: 'sword',
  BEER: 'beer',
  MUG: 'mug',
  SACK: 'sack',
  POTION: 'potion' 
}

export const ITEMS_DB = {
  [ITEM_TYPES.SWORD]: {
    id: 'sword',
    name: 'Iron Sword',
    icon: '⚔️',
    description: '+50% Damage',
    rarity: 'rare',
    color: 0xFF6B6B,
    effect: {
      type: 'damageMultiplier',
      value: 1.5
    },
    spriteKey: 'item_sword',
    width: 32,
    height: 32
  },
  
  [ITEM_TYPES.BEER]: {
    id: 'beer',
    name: 'Ale of Haste',
    icon: '🍺',
    description: '+30% Attack Speed',
    rarity: 'uncommon',
    color: 0xFFB347,
    effect: {
      type: 'attackSpeedMultiplier',
      value: 1.3
    },
    spriteKey: 'item_beer',
    width: 32,
    height: 32
  },

  [ITEM_TYPES.MUG]: {
    id: 'mug',
    name: 'Mug of Swiftness',
    icon: '🍵',
    description: '+40% Movement Speed',
    rarity: 'uncommon',
    color: 0x87CEEB,
    effect: {
      type: 'speedMultiplier',
      value: 1.4
    },
    spriteKey: 'item_mug',
    width: 32,
    height: 32
  },

  [ITEM_TYPES.SACK]: {
    id: 'sack',
    name: 'Sack of Vitality',
    icon: '🎒',
    description: '+50 Max HP',
    rarity: 'common',
    color: 0xB8860B,
    effect: {
      type: 'maxHpBoost',
      value: 50
    },
    spriteKey: 'item_sack',
    width: 32,
    height: 32
  },

   [ITEM_TYPES.POTION]: {
    id: 'potion',
    name: 'Health Potion',
    icon: '🧪',
    description: 'Restore 30 HP',
    rarity: 'common',
    color: 0xFF1493,
    effect: {
      type: 'heal',
      value: 30
    },
    spriteKey: 'item_potion',
    width: 32,
    height: 32,
    consumable: true
  } 
}

// Drop rates por rarity
export const DROP_RATES = {
  common: 0.5,      // 50%
  uncommon: 0.35,   // 35%
  rare: 0.15        // 15%
}

// Función helper para obtener item aleatorio
export function getRandomItem() {
  const itemKeys = Object.keys(ITEMS_DB)
  const randomKey = itemKeys[Math.floor(Math.random() * itemKeys.length)]
  return ITEMS_DB[randomKey]
}

// Función para aplicar efecto del item
export function applyItemEffect(item, playerStats) {
  const effect = item.effect
  
  switch(effect.type) {
    case 'damageMultiplier':
      playerStats.damageMultiplier *= effect.value
      break
    case 'attackSpeedMultiplier':
      playerStats.attackSpeedMultiplier *= effect.value
      break
    case 'speedMultiplier':
      playerStats.speedMultiplier *= effect.value
      break
    case 'maxHpBoost':
      playerStats.maxHp += effect.value
      playerStats.hp = Math.min(playerStats.hp + effect.value, playerStats.maxHp)
      break
    case 'heal':
      playerStats.hp = Math.min(playerStats.hp + effect.value, playerStats.maxHp)
      break
    default:
      break
  }
  
  return playerStats
}