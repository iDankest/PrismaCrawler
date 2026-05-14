// tests/integrations/api.test.js
const request = require('supertest');
const app = require('../../src/index.js');
const prisma = require('../../src/config/db');

describe('Rutas de Mapas - Game API', () => {
  let adminToken; // Guardaremos el token aquí

    let mapaId;
  beforeAll(async () => {

    // 1. Limpiamos la base de datos
    await prisma.map.deleteMany();
    await prisma.user.deleteMany();
    
    // 2. Registramos un usuario de prueba usando tu API
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'Admin Boss',
        email: 'admin@boss.com',
        password: 'password123'
      });

    // 3. (OPCIONAL) Si tu sistema requiere que sea ADMIN, lo forzamos directamente en la BD
    await prisma.user.update({
      where: { email: 'admin@boss.com' },
      data: { role: 'ADMIN' }
    });

    // 4. Hacemos Login para conseguir el token real
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'admin@boss.com',
        password: 'password123'
      });

    // Guardamos el token para usarlo en los tests de abajo
    adminToken = loginResponse.body.token; 
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Debería crear un nuevo mapa correctamente con permisos de Admin', async () => {
    const newMap = {
      name: "Mazmorra de Inicio",
      level: 1,
      layout: ["######", "#_M__#", "#_D__#", "######"],
      dictionary: {
        "M": { "type": "enemy", "name": "Slime", "hp": 30 },
        "D": { "type": "door" }
      }
    };

    const response = await request(app)
      .post('/api/game/map')
      // AÑADIDO: Le inyectamos el token en las cabeceras simulando estar logueados
      .set('Authorization', `Bearer ${adminToken}`) 
      .send(newMap);

    // Ahora sí esperamos un 201 porque estamos autorizados
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe("Mazmorra de Inicio");
    mapaId = response.body.data.id;
  });

  it('Debería rechazar la creación del mapa si no se envía Token (401)', async () => {
    const newMap = { name: "Mapa Pirata", level: 2, layout: [], dictionary: {} };

    const response = await request(app)
      .post('/api/game/map')
      // No le enviamos el .set('Authorization') a propósito
      .send(newMap);

    // Verificamos que tu seguridad funciona y da un error 401
    expect(response.status).toBe(401);
  });

  it('Debería recibir un mapa', async () => {
    const response = await request(app).get(`/api/game/map/${mapaId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: mapaId,
      name: "Mazmorra de Inicio",
      level: 1,
      layout: ["######", "#_M__#", "#_D__#", "######"],
      dictionary: {
        "M": { "type": "enemy", "name": "Slime", "hp": 30 },
        "D": { "type": "door" }
      }
    });
  });
});