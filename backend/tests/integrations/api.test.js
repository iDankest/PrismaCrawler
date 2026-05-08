const request = require('supertest');
const app = require('../../src/server'); // Tu servidor Express
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('API Integration Tests', () => {
  
  // Test de Integración: Endpoint + Base de Datos
  test('GET /api/leaderboard debería devolver el top de jugadores', async () => {
    const response = await request(app).get('/api/leaderboard');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // Verificamos que el primero tiene más daño que el segundo
    if (response.body.length > 1) {
      expect(response.body[0].totalDamageDone).toBeGreaterThanOrEqual(response.body[1].totalDamageDone);
    }
  });

  // Test de Integración: Creación y persistencia
  test('POST /api/items debería asignar un ítem a un personaje', async () => {
    const newItem = {
      name: "Escudo de madera",
      type: "ARMOR",
      value: 10,
      characterId: 1 // Asegúrate de que este ID existe en tu Seed
    };

    const response = await request(app)
      .post('/api/items')
      .send(newItem);

    expect(response.statusCode).toBe(201);
    
    // Verificación final en la DB real
    const dbItem = await prisma.item.findFirst({ where: { name: "Escudo de madera" } });
    expect(dbItem).toBeDefined();
  });
});