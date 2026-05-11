// ./src/routes/userRoutes.js

//Definir endpoints del usario Post(login, regiter)

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Importamos el middleware
const verifyToken = require('../middlewares/authMiddleware');

// Rutas PÚBLICAS (No necesitan middleware, cualquiera puede entrar)
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rutas PRIVADAS (Añadimos verifyToken ANTES del controlador)
// Fíjate cómo va: Ruta -> Middleware -> Controlador
router.get('/perfil', verifyToken, userController.getProfile); 

module.exports = router;