// tests/db.test.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Pruebas de Base de Datos', () => {
  
  test('Debería encontrar al personaje Hades', async () => {
    const character = await prisma.character.findFirst({
      where: { name: 'Hades el diablo' }
    });
    
    expect(character).toBeDefined();
    expect(character.name).toBe('Hades el diablo');
  });

  test('El daño total acumulado debe ser un número', async () => {
    const character = await prisma.character.findFirst();
    expect(typeof character.totalDamageDone).toBe('number');
  });

});