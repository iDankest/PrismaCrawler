// .backend/src/index.js
const express = require('express');
const cors = require('cors'); // 1. Importamos cors

// 2. Importar Rutas
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

// 3. Importar Middlewares y Utils
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');

// 4. Inicializar la app
const app = express();

// 5. Middlewares globales (¡El orden importa, siempre después de crear 'app'!)
app.use(cors()); // Permite peticiones desde el frontend (React)
app.use(express.json()); // Permite a Express entender los JSON que mandamos en el req.body

// 6. Montar las Rutas

app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);


// 7. Manejador de rutas no encontradas (404)
app.use((req, res, next) => {
  next(new AppError(`No se puede encontrar ${req.originalUrl} en este servidor!`, 404));
});

// 8. MIDDLEWARE DE ERRORES (Siempre va al final)
app.use(errorHandler);

app.use(cors())

// Exportamos la app para que Supertest pueda usarla en las pruebas
module.exports = app;

// Solo encendemos el servidor si este archivo se ejecuta directamente (ej. npm run dev)
// Si lo está ejecutando Jest para las pruebas, esta parte se ignora.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}...`));
}
