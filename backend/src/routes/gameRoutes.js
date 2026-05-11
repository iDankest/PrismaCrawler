// ./src/routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Importamos el middleware de autenticación
const verifyToken = require('../middlewares/authMiddleware');

// Todas las rutas del juego son PRIVADAS (requieren token)
router.post('/attack', verifyToken, gameController.attackPlayer);
router.post('/move', verifyToken, gameController.movePlayer);
router.post('/heal', verifyToken, gameController.healPlayer);

module.exports = router;