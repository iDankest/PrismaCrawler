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