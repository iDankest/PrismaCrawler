// ./src/routes/userRoutes.js

//Definir endpoints del usario Post(login, regiter)

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Definimos las rutas y les pasamos las funciones del controlador
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;