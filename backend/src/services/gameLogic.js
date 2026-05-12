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
    const scores = await prisma.score.findMany({
      take: 10,
      orderBy: { xp: 'desc' },
      include: { user: { select: { name: true } } } // Traemos el nombre del jugador
    });
    return scores;
  },



    // ==========================================
  // RUTAS DE ADMINISTRADOR (POST / PUT)
  // ==========================================

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
  }


};

module.exports = gameLogicService;