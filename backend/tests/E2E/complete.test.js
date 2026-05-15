const request = require('supertest');
const app = require('../../src/index.js');
const prisma = require('../../src/config/db.js');

describe('Flujo E2E (User Journey API)', () => {
  let adminToken;
  let playerToken;
  let mapId;

  // 1. Limpieza inicial
  beforeAll(async () => {
    await prisma.map.deleteMany();
    await prisma.score.deleteMany();
    await prisma.user.deleteMany();
  });

  // 2. Desconexión final
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('1. Debería registrar un Admin y un Jugador', async () => {
    // Creamos al Administrador
    await request(app).post('/api/users/register').send({
      email: 'admin@journey.com',
      password: 'password123',
      name: 'Admin Supremo'
    });
    // Forzamos el rol de ADMIN en la base de datos
    await prisma.user.update({
      where: { email: 'admin@journey.com' },
      data: { role: 'ADMIN' }
    });
    
    // Creamos al Jugador
    await request(app).post('/api/users/register').send({
      email: 'player@journey.com',
      password: 'password123',
      name: 'Jugador Novato'
    });
  });

  it('2. Deberían hacer login y obtener tokens válidos', async () => {
    const resAdmin = await request(app).post('/api/users/login')
      .send({ email: 'admin@journey.com', password: 'password123' });
    adminToken = resAdmin.body.token;

    const resPlayer = await request(app).post('/api/users/login')
      .send({ email: 'player@journey.com', password: 'password123' });
    playerToken = resPlayer.body.token;

    expect(adminToken).toBeDefined();
    expect(playerToken).toBeDefined();
  });

  it('3. El Admin debería crear un nivel (Mapa)', async () => {
    const res = await request(app)
      .post('/api/game/map')
      .set('Authorization', `Bearer ${adminToken}`) // Usa permisos de admin
      .send({ name: 'Nivel E2E', level: 1, layout: ['#####'], dictionary: {} });
    
    expect(res.status).toBe(201);
    mapId = res.body.data.id; // Guardamos el ID del mapa para el jugador
  });

  it('4. El Jugador debería poder pedir el mapa para jugar', async () => {
    const res = await request(app).get(`/api/game/map/${mapId}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Nivel E2E');
  });

  it('5. El Jugador termina la partida y guarda su puntuación', async () => {
    const res = await request(app)
      .post('/api/game/score')
      .set('Authorization', `Bearer ${playerToken}`) // Usa token de jugador
      .send({ xp: 2500 }); // Simulamos que ganó mucha experiencia
      
    expect(res.status).toBe(201);
  });
});