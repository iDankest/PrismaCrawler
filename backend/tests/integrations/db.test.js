// tests/db.test.js
const prisma = require('../../src/config/db.js');

describe('Pruebas de Base de Datos (Integración de Modelos)', () => {
  
  // 1. Limpiamos la base de datos antes de probar para evitar falsos positivos
  beforeAll(async () => {
    await prisma.score.deleteMany();
    await prisma.user.deleteMany();
  });

  // 2. Cerramos la conexión de Prisma al terminar
  afterAll(async () => {
    await prisma.$disconnect();
  });

  let userId;

  test('Debería crear y encontrar a un usuario en la base de datos', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Hades el diablo',
        email: 'hades@inframundo.com',
        password: 'hashed_password_mock'
      }
    });
    
    expect(user).toBeDefined();
    expect(user.name).toBe('Hades el diablo');
    userId = user.id; // Guardamos su ID para el siguiente test
  });

  test('Debería poder registrar puntuaciones (Scores) asociados al usuario', async () => {
    const score = await prisma.score.create({
      data: {
        userId: userId,
        xp: 500
      }
    });
    
    expect(score).toBeDefined();
    expect(typeof score.xp).toBe('number');
    expect(score.xp).toBe(500);
  });

});