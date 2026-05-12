// .backend/src/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Respuesta unificada para toda la app
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // (Opcional) Puedes añadir err.stack si estás en modo desarrollo para ver la línea exacta del fallo
  });
};

module.exports = errorHandler;