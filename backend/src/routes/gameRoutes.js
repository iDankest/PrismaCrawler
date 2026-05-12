// ./src/routes/gameRoutes.js

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Importamos el middleware de autenticación (si lo tienes configurado)
const verifyToken = require('../middlewares/authMiddleware');

// --- RUTAS PÚBLICAS (Opcional: puedes requerir token si quieres) ---
// El ':id' captura el número de la URL (ej. /map/1) y lo mete en req.params.id
router.get('/map/:id', gameController.getMap); 
router.get('/leaderboard', gameController.getTopScores);

// --- RUTAS PRIVADAS (Requieren estar logueado) ---
router.post('/score', verifyToken, gameController.saveScore);

// --- RUTAS DE ADMINISTRADOR ---
// Podrías añadir un middleware extra "verifyAdmin" en el futuro
router.post('/map', verifyToken, gameController.createMap);

module.exports = router;