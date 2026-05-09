// ./src/controllers/gameController.js
const gameLogicService = require("../services/gameLogic.js");
const AppError = require("../utils/AppError");
const gameLogicService = require("../services/gameLogic.js");
const AppError = require("../utils/AppError.js"); // <-- 1. Importamos AppError

const gameController = {
  // <-- 2. Añadimos 'next' a los parámetros
  attackPlayer: async (req, res, next) => {
    try {
      const { attackerId, defenderId, power } = req.body;

      // 3. Uso de AppError para validaciones básicas del cliente
      if (!attackerId || !defenderId || power === undefined) {
        return next(
          new AppError(
            "Faltan datos para procesar el ataque (attackerId, defenderId, power)",
            400,
          ),
        );
      }

      if (typeof power !== "number" || power < 0) {
        return next(
          new AppError("El poder de ataque debe ser un número positivo", 400),
        );
      }

      // 4. Llamada a nuestro servicio (si el servicio lanza un throw, irá directo al catch)
      const result = await gameLogicService.applyDamageToPlayer(
        attackerId,
        defenderId,
        power,
      );

      // 5. Las respuestas exitosas se quedan igual
      res.status(200).json({
        success: true,
        matchInfo: result,
      });
    } catch (error) {
      // 6. Si Prisma falla o el servicio lanza un error ("Jugador no encontrado")
      // se lo pasamos al middleware global de errores.
      next(error);
    }
  },

  // --- MOVER JUGADOR (Placeholder) ---
  movePlayer: async (req, res, next) => {
    try {
      // Supongamos que el movimiento se basa en coordenadas X e Y
      const { playerId, targetX, targetY } = req.body;

      // 1. Validaciones básicas
      if (!playerId || targetX === undefined || targetY === undefined) {
        return next(
          new AppError(
            "Faltan datos para el movimiento (playerId, targetX, targetY)",
            400,
          ),
        );
      }

      // 2. Llamada al servicio (Esta función la crearás en gameLogic.js más adelante)
      const result = await gameLogicService.updatePlayerPosition(
        playerId,
        targetX,
        targetY,
      );
      res.status(200).json({
        success: true,
        movementInfo: result,
      });
      // Simulamos una respuesta temporal mientras no existe la lógica real
      const mockResult = {
        newX: targetX,
        newY: targetY,
        message: "Movimiento simulado",
      };

      // 3. Respuesta exitosa
      res.status(200).json({
        success: true,
        movementInfo: mockResult, // Cambiar a 'result' cuando actives el servicio
      });
    } catch (error) {
      next(error);
    }
  },

  // --- CURAR JUGADOR (Placeholder) ---
  healPlayer: async (req, res, next) => {
    try {
      const { playerId, healAmount, itemId } = req.body;

      // 1. Validaciones básicas
      if (!playerId || !healAmount) {
        return next(
          new AppError(
            "Faltan datos para la curación (playerId, healAmount)",
            400,
          ),
        );
      }

      if (typeof healAmount !== "number" || healAmount <= 0) {
        return next(
          new AppError(
            "La cantidad de curación debe ser un número mayor a cero",
            400,
          ),
        );
      }

      // 2. Llamada al servicio (A programar en gameLogic.js después)
      // Podría descontar un item del inventario y subir la vida
      const result = await gameLogicService.applyHealing(
        playerId,
        healAmount,
        itemId,
      );

      res.status(200).json({
        success: true,
        healingInfo: result,
      });

      // 3. Respuesta exitosa
      res.status(200).json({
        success: true,
        healingInfo: mockResult, // Cambiar a 'result' cuando actives el servicio
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = gameController;
