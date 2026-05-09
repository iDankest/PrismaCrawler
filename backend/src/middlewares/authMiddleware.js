// ./src/middlewares/authMiddleware.js
//Control de rutas del usuario

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura';

const verifyToken = (req, res, next) => {
  // 1. Buscamos el token en las cabeceras de la petición
  const token = req.header('Authorization');

  // Si no hay token, cortamos el paso aquí mismo
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No hay token.' });
  }

  try {
    // 2. Verificamos que el token sea válido (le quitamos el "Bearer " si lo trae)
    const tokenLimpio = token.replace('Bearer ', '');
    const verified = jwt.verify(tokenLimpio, JWT_SECRET);
    
    // 3. Guardamos los datos del usuario en la petición (req)
    req.user = verified; 
    
    // 4. NEXT() es la magia: le dice a Express "Todo bien, pasa al controlador"
    next(); 
  } catch (error) {
    res.status(400).json({ error: 'Token no válido' });
  }
};

module.exports = verifyToken;