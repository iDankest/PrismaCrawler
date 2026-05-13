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