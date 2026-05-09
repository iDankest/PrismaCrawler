// ./src/controllers/userController.js
// La lógica que habla con prisma para contenido register y login req res...

const prisma = require('../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// En un entorno real, esta clave secreta debería venir de tu archivo .env (ej. process.env.JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura';

const userController = {
  
  // --- REGISTRO DE USUARIO ---
  register: async (req, res) => {
    try {
      const { email, password, name } = req.body;

      // 1. Validar que el usuario no exista previamente
      const userExists = await prisma.user.findUnique({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
      }

      // 2. Encriptar (hashear) la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 3. Crear el nuevo usuario en la base de datos
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword, // ¡Guardamos la contraseña encriptada, nunca en texto plano!
          name,
        },
      });

      // 4. (Opcional) Generar un token para que el usuario inicie sesión automáticamente al registrarse
      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '24h' });

      // 5. Devolver la respuesta excluyendo la contraseña por seguridad
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
      console.error('Error en register:', error);
      res.status(500).json({ error: 'Error interno del servidor al registrar usuario' });
    }
  },

  // --- LOGIN DE USUARIO ---
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Buscar al usuario por email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Si no existe, devolvemos error genérico por seguridad
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // 2. Comparar la contraseña enviada con la contraseña encriptada de la BD
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // 3. Generar el Token (JWT)
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

      // 4. Enviar respuesta exitosa
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
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error interno del servidor al iniciar sesión' });
    }
  }
};

module.exports = userController;