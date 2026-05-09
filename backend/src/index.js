// ./src/index.js
const express = require('express');
const app = express();

// 1. Importar Rutas
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes'); // <-- Añadido

// 2. Importar Middlewares y Utils
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError'); // <-- ¡IMPORTANTE! Faltaba importarlo aquí

app.use(express.json());

// 3. Montar las Rutas
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes); // <-- Todas las rutas del juego empezarán por /api/game/...

// 4. Manejador de rutas no encontradas (404)
app.all('*', (req, res, next) => {
  next(new AppError(`No se puede encontrar ${req.originalUrl} en este servidor!`, 404));
});

// 5. MIDDLEWARE DE ERRORES (Siempre va al final)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}...`));