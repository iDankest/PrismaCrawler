// .backend/src/services/gameLogic.js
//Esto se usuara para no ensuciar Controllers y añadir la logica del juego ejemplo calculateDamage() o checkCollision().

const prisma = require('../config/db.js');
const AppError = require('../utils/AppError.js');

const gameLogicService = { // Implementación sólo IA
// Cargar mapas, objetos enemgios --> GET
// ==========================================
  // RUTAS PÚBLICAS / JUGADORES (GET)
  // ==========================================

  getMap: async (mapId) => {
    const map = await prisma.map.findUnique({
      where: { id: mapId }
    });

    if (!map) throw new AppError("Mapa no encontrado", 404);
    return map;
  },

  // Cargar puntuación, topscore, usuarios --> GET
  // 2. Cargar Leaderboard (Top 10 puntuaciones)
getTopScores: async () => {
    return await prisma.score.findMany({
      take: 10,
      orderBy: {
        xp: 'desc' 
      },
      include: {
        user: { 
          select: { name: true } 
        }
      }
    });
  },


  getItems: async () => {
    // Retornamos un array local (Opción 2 - Sin Base de Datos)
    return [
      {
        id: 'item_sword',
        name: 'Iron Sword',
        description: '+50% Damage',
        rarity: 'rare',
        color: 0xFF6B6B,
        effects: [{ type: 'damageMultiplier', value: 1.5 }],
        spriteKey: 'item_sword',
        consumable: false
      },
      {
        id: 'item_potion',
        name: 'Health Potion',
        description: 'Restore 30 HP',
        rarity: 'common',
        color: 0xFF1493,
        effects: [{ type: 'heal', value: 30 }],
        spriteKey: 'item_potion',
        consumable: true
      }
    ];
  },



    // ==========================================
  // RUTAS DE ADMINISTRADOR (POST / PUT)
  // ==========================================

    saveScore: async (userId, data) => {
    return await prisma.score.create({
      data: {
        userId: userId,
        xp: data.xp || 0
      }
    });
  },
  // 3. Crear un nuevo mapa en la base de datos
  // Implementar mapas, nuevos items. --> POST
  createMap: async (mapData) => {
    // mapData recibiría el array de strings y la configuración
    const { name, level, layout, dictionary } = mapData;

    if (!layout || !Array.isArray(layout)) {
      throw new AppError("El layout del mapa debe ser un array de strings", 400);
    }

    const newMap = await prisma.map.create({
      data: {
        name,
        level,
        layout: JSON.stringify(layout), // Prisma guarda el array como JSON
        dictionary: JSON.stringify(dictionary)
      }
    });

    return newMap;
  },

// Actualizar mapas, stats de items y enemgios --> PUT
// 4. Actualizar las estadísticas de un enemigo global
  updateEnemyStats: async (enemyId, newData) => {
    // Imagina que tienes una tabla de plantillas de enemigos
    const updatedEnemy = await prisma.enemyTemplate.update({
      where: { id: enemyId },
      data: newData
    });
    return updatedEnemy;
  },

  
 /**
   * --- LÓGICA DE COMBATE ---
   */
  calculateDamage: (baseAtk, multiplier) => {
    const mult = (multiplier !== undefined && multiplier !== null) ? multiplier : 1;
    return Math.floor(baseAtk * mult);
  }
};


module.exports = gameLogicService;