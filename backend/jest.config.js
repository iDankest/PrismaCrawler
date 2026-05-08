module.exports = {
  // Indica que el entorno de ejecución es Node.js
  testEnvironment: 'node',

  // Busca archivos que terminen en .test.js o .spec.js
  testMatch: ['**/tests/**/*.test.js'],

  // Para que no se vuelva loco con la carpeta node_modules
  testPathIgnorePatterns: ['/node_modules/'],

  // Muestra mensajes detallados durante la ejecución
  verbose: true,

  // (Opcional) Si usas carpetas de origen específicas
  moduleDirectories: ['node_modules', 'src'],
};