// ./src/utils/AppError.js

class AppError extends Error {
  constructor(message, statusCode) {
    // Llamamos al constructor de la clase padre (Error) con el mensaje
    super(message);

    this.statusCode = statusCode;
    // Si el código empieza por 4 (ej. 400, 404) es un 'fail' del cliente. 
    // Si empieza por 5 (ej. 500) es un 'error' del servidor.
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // isOperational indica que es un error previsto (ej. contraseña incorrecta).
    // Si es false, significa que es un bug desconocido del código (ej. variable no definida).
    this.isOperational = true;

    // Esto ayuda a que el "stack trace" (la ruta del error en la consola) 
    // no incluya la creación de esta clase, haciéndolo más limpio de leer.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;