// ./src/controllers/gameController.js

const gameLogicService = require('../services/gameLogic.js');
const AppError = require('../utils/AppError.js');

const gameController = {
  
  // --- OBTENER UN MAPA ---
  getMap: async (req, res, next) => {
    try {
      const mapId = parseInt(req.params.id, 10);

      if (isNaN(mapId)) {
        return next(new AppError('El ID del mapa debe ser un número válido', 400));
      }

      const map = await gameLogicService.getMap(mapId);
      
      res.status(200).json(map);
    } catch (error) {
      next(error);
    }
  },

  // --- OBTENER EL TOP DE PUNTUACIONES ---
  getTopScores: async (req, res, next) => {
    try {
      const scores = await gameLogicService.getTopScores();
      
      res.status(200).json({
        success: true,
        data: scores
      });
    } catch (error) {
      next(error);
    }
  },

  // --- GUARDAR PUNTUACIÓN (XP) AL MORIR ---
  saveScore: async (req, res, next) => {
    try {
      const { xp } = req.body;
      const userId = req.user.userId; // Obtenido del token JWT gracias al authMiddleware

      if (xp === undefined || typeof xp !== 'number') {
        return next(new AppError('La puntuación (xp) es obligatoria y debe ser un número', 400));
      }

      // (Nota: Esta función saveScore habría que añadirla a gameLogic.js para que hable con Prisma)
      // const newScore = await gameLogicService.saveScore(userId, xp);

      res.status(201).json({
        success: true,
        message: 'Puntuación guardada correctamente',
        // data: newScore
      });
    } catch (error) {
      next(error);
    }
  },
  getItems: async (req, res, next) => {
    try {
      const items = await gameLogicService.getItems();
      
      res.status(200).json({
        success: true,
        data: items
      });
    } catch (error) {
      next(error);
    }
  },


  // --- CREAR UN MAPA NUEVO (ADMIN) ---
  createMap: async (req, res, next) => {
    try {
      const { name, level, layout, dictionary } = req.body;

      if (!name || !layout || !dictionary) {
        return next(new AppError('Faltan datos obligatorios para crear el mapa', 400));
      }

      const newMap = await gameLogicService.createMap(req.body);

      res.status(201).json({
        success: true,
        message: 'Mapa creado con éxito',
        data: newMap
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = gameController;