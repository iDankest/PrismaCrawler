// .backend/src/services/gameLogic.js
/**
 * Capa de Servicio: Gestiona las transacciones con el ORM de Prisma
 * y encapsula la lógica de negocio central del juego.
 */
const prisma = require('../config/db.js');
const AppError = require('../utils/AppError.js');

const gameLogicService = { // Implementación sólo IA

  getMap: async (mapId) => {
    const map = await prisma.map.findUnique({
      where: { id: mapId }
    });

    if (!map) throw new AppError("Mapa no encontrado", 404);
    return map;
  },

  /** Obtiene el Top 10 de mejores partidas globales jerarquizadas por progreso y mérito */
getTopScores: async () => {
    return await prisma.score.findMany({
      take: 10,
      orderBy: [
        { floor: 'desc' },
        { xp: 'desc' },
        { kills: 'desc' }
      ],
      include: {
        user: { 
          select: { name: true } 
        }
      }
    });
  },


  getItems: async () => {
    // Traemos TODOS los items de forma dinámica desde PostgreSQL
    return await prisma.item.findMany();
  },



    // ==========================================
  // RUTAS DE ADMINISTRADOR (POST / PUT)
  // ==========================================

    saveScore: async (userId, data) => {
    return await prisma.score.create({
      data: {
        userId: userId,
        floor: data.floor || 1,
        kills: data.kills || 0,
        totalDamageDealt: data.totalDamageDealt || 0,
        totalDamageTaken: data.totalDamageTaken || 0,
        xp: data.xp || 0
      }
    });
  },

  /** Persistencia de matriz de niveles mediante deserialización JSON */
  createMap: async (mapData) => {
    const { name, level, layout, dictionary } = mapData;

    if (!layout || !Array.isArray(layout)) {
      throw new AppError("El layout del mapa debe ser un array de strings", 400);
    }

    const newMap = await prisma.map.create({
      data: {
        name,
        level,
        layout: JSON.stringify(layout),
        dictionary: JSON.stringify(dictionary)
      }
    });

    return newMap;
  },

  updateEnemyStats: async (enemyId, newData) => {
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