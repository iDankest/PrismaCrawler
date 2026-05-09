// ./src/controllers/gameController.js
const gameLogicService = require('../services/gameLogic.js');
const AppError = require('../utils/AppError');
const gameLogicService = require('../services/gameLogic.js');
const AppError = require('../utils/AppError.js'); // <-- 1. Importamos AppError

const gameController = {
  // <-- 2. Añadimos 'next' a los parámetros
  attackPlayer: async (req, res, next) => { 
    try {
      const { attackerId, defenderId, power } = req.body;

      // 3. Uso de AppError para validaciones básicas del cliente
      if (!attackerId || !defenderId || power === undefined) {
        return next(new AppError('Faltan datos para procesar el ataque (attackerId, defenderId, power)', 400));
      }

      if (typeof power !== 'number' || power < 0) {
        return next(new AppError('El poder de ataque debe ser un número positivo', 400));
      }

      // 4. Llamada a nuestro servicio (si el servicio lanza un throw, irá directo al catch)
      const result = await gameLogicService.applyDamageToPlayer(attackerId, defenderId, power);
      
      // 5. Las respuestas exitosas se quedan igual
      res.status(200).json({ 
        success: true, 
        matchInfo: result 
      });

    } catch (error) {
      // 6. Si Prisma falla o el servicio lanza un error ("Jugador no encontrado")
      // se lo pasamos al middleware global de errores.
      next(error);
    }
  }

  // Aquí irían otras funciones del juego, ej. movePlayer, healPlayer, etc.
};

module.exports = gameController;