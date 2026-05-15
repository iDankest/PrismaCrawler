// .backend/src/controllers/userController.js

const userService = require('../services/userLogic.js'); // Asegúrate de que la ruta sea correcta
const AppError = require('../utils/AppError.js');

const userController = {
  
  register: async (req, res, next) => {
    try {
      console.log('📝 [REGISTER] Request recibido:', req.body);
      
      const { email, password, name } = req.body;

      // Delegamos toda la lógica pesada a userLogic.js
      const { token, user } = await userService.registerUser({ email, password, name });

      console.log('✅ [REGISTER] Usuario creado:', user.id);

      // Enviamos la respuesta
      res.status(201).json({
        message: 'Usuario creado exitosamente',
        token,
        user
      });

    } catch (error) {
      console.error('❌ [REGISTER] Error:', error.message);
      // Si el error viene de nuestra lógica (ej. correo duplicado), lo pasamos tal cual
      if (error instanceof AppError) return next(error);
      // Si es un error desconocido (ej. fallo de BD), mandamos un 500
      next(new AppError('Error interno del servidor al registrar usuario', 500));
    }
  },

  login: async (req, res, next) => {
    try {
      console.log('🔑 [LOGIN] Request recibido:', req.body);
      
      const { email, password } = req.body;

      // Delegamos la validación a userLogic.js
      const { token, user } = await userService.loginUser({ email, password });

      console.log('✅ [LOGIN] Login exitoso para:', user.email);

      res.json({
        message: 'Login exitoso',
        token,
        user
      });

    } catch (error) {
      console.error('❌ [LOGIN] Error:', error.message);
      if (error instanceof AppError) return next(error);
      next(new AppError('Error interno del servidor al iniciar sesión', 500));
    }
  },

  getProfile: async (req, res, next) => {
    res.status(200).json({ message: "Perfil del usuario (En construcción)" });
  }
};

module.exports = userController;