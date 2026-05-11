// ./src/config/db.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'error'], // <-- Esto imprimirá el SQL en tu terminal
});

module.exports = prisma;
