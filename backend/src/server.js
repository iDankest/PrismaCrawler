// ./src/server.js
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());

// Tus rutas normales
app.use('/api/users', userRoutes);

// Manejador de rutas no encontradas (404)
app.all('*', (req, res, next) => {
  next(new AppError(`No se puede encontrar ${req.originalUrl} en este servidor!`, 404));
});

// MIDDLEWARE DE ERRORES (Siempre va al final)
app.use(errorHandler);

app.listen(3000, () => console.log('Servidor corriendo...'));