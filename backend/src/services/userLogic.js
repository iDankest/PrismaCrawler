// ./backend/src/services/userLogic.js

const prisma = require('../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError.js');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura';

const userService = {
  
  // Lógica para registrar un usuario
  registerUser: async ({ email, password, name }) => {
    // 1. Verificamos si el usuario ya existe
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new AppError('El correo electrónico ya está en uso', 400);
    }

    // 2. Encriptamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Creamos el usuario en la BD
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // 4. Generamos el token JWT
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '24h' });

    // 5. Devolvemos los datos limpios al controlador
    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      }
    };
  },

  // Lógica para el login de un usuario
  loginUser: async ({ email, password }) => {
    // 1. Buscamos al usuario
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // 2. Comparamos las contraseñas
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // 3. Generamos el token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    // 4. Devolvemos los datos
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    };
  },

  // Lógica para obtener el perfil y sus mejores puntuaciones
  getUserProfile: async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, email: true, name: true, role: true,
        scores: {
          orderBy: [{ floor: 'desc' }, { xp: 'desc' }],
          take: 5 // Traeremos el top 5 personal del usuario
        }
      }
    });

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return user;
  }
};

module.exports = userService;