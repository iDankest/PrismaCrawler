// .backend/src/controllers/userController.js

const prisma = require('../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura';

const userController = {
  
  register: async (req, res, next) => {
    try {
      console.log('📝 [REGISTER] Request recibido:', req.body); // ← AÑADE ESTO
      
      const { email, password, name } = req.body;

      const userExists = await prisma.user.findUnique({
        where: { email },
      });

      console.log('✅ [REGISTER] User search completado'); // ← AÑADE ESTO

      if (userExists) {
        return next(new AppError('El correo electrónico ya está en uso', 400));
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      console.log('✅ [REGISTER] Usuario creado:', newUser.id); // ← AÑADE ESTO

      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '24h' });

      res.status(201).json({
        message: 'Usuario creado exitosamente',
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        }
      });

    } catch (error) {
      console.error('❌ [REGISTER] Error:', error.message); // ← AÑADE ESTO
      next(new AppError('Error interno del servidor al registrar usuario',500));
    }
  },

  login: async (req, res, next) => {
    try {
      console.log('🔑 [LOGIN] Request recibido:', req.body); // ← AÑADE ESTO
      
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      console.log('✅ [LOGIN] User search completado, usuario existe:', !!user); // ← AÑADE ESTO

      if (!user) {
        return next(new AppError('Credenciales inválidas',401));
      }

      const validPassword = await bcrypt.compare(password, user.password);

      console.log('✅ [LOGIN] Password check completado:', validPassword); // ← AÑADE ESTO

      if (!validPassword) {
        return next(new AppError('Credenciales inválidas', 401));
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn:'24h'});

      console.log('✅ [LOGIN] Token generado'); // ← AÑADE ESTO

      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      });

    } catch (error) {
      console.error('❌ [LOGIN] Error:', error.message); // ← AÑADE ESTO
      next(new AppError('Error interno del servidor al iniciar sesión',500));
    }
  },

  getProfile: async (req, res, next) => {
    res.status(200).json({ message: "Perfil del usuario (En construcción)" });
  }
};

module.exports = userController;