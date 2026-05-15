// ./src/controllers/gameController.js

const gameLogicService = require('../services/gameLogic.js');
const AppError = require('../utils/AppError.js');

const gameController = {
  
  /** Controlador HTTP para recuperar la estructura y semántica JSON de un nivel concreto */
  getMap: async (req, res, next) => {
    try {
      const mapId = parseInt(req.params.id, 10);

      if (isNaN(mapId)) {
        return next(new AppError('El ID del mapa debe ser un número válido', 400));
      }

      // Obtención del nivel procesado desde el servicio
      const map = await gameLogicService.getMap(mapId);
      
      // Parseo inverso de entidades almacenadas como String
      if (typeof map.layout === 'string') {
        map.layout = JSON.parse(map.layout);
      }
      if (typeof map.dictionary === 'string') {
        map.dictionary = JSON.parse(map.dictionary);
      }
      
      res.status(200).json(map);
    } catch (error) {
      next(error);
    }
  },

  /** Retorna los 10 mejores expedientes del Leaderboard global */
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

  /** Consagra las estadísticas de sesión de un jugador fallecido asociando el payload al token JWT provisto */
  saveScore: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const scoreData = req.body;

      if (scoreData.floor === undefined || scoreData.xp === undefined) {
        return next(new AppError('El piso (floor) y la experiencia (xp) son obligatorios', 400));
      }

      const newScore = await gameLogicService.saveScore(userId, scoreData);

      res.status(201).json({
        success: true,
        message: 'Puntuación guardada correctamente',
        data: newScore
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


  /** Inyección protegida de mapas en base de datos (Exclusivo administradores) */
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