// ./src/tests/user.test.js
const request = require('supertest');
const app = require('../src/index.js'); // Importamos nuestra app de Express
const prisma = require('../src/config/db.js'); // Importamos Prisma para limpiar la BD

describe('Rutas de Usuario - Autenticación', () => {
  
  // 1. ANTES DE TODOS LOS TESTS: Limpiamos la base de datos de pruebas
  beforeAll(async () => {
    // Borramos todos los usuarios para que la prueba sea siempre predecible
    await prisma.user.deleteMany();
  });

  // 2. AL TERMINAR LOS TESTS: Desconectamos Prisma para que Jest pueda cerrarse
  afterAll(async () => {
    await prisma.$disconnect();
  });

  // --- TEST 1: Registro Exitoso ---
  it('Debería registrar un usuario correctamente y devolver un token', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Heroe Test',
        email: 'test@ejemplo.com',
        password: 'password123'
      });

    // Comprobamos que el servidor responda con 201 (Creado)
    expect(response.status).toBe(201);
    
    // Comprobamos que devuelva el mensaje correcto
    expect(response.body.message).toBe('Usuario creado exitosamente');
    
    // Comprobamos que devuelva los datos del usuario (y que no envíe la contraseña)
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.email).toBe('test@ejemplo.com');
    expect(response.body.user).not.toHaveProperty('password');
    
    // Comprobamos que haya generado el Token JWT
    expect(response.body).toHaveProperty('token');
  });

  // --- TEST 2: Error por duplicidad ---
  it('No debería permitir registrar un correo que ya existe', async () => {
    // Intentamos registrar exactamente el mismo correo de nuevo
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Impostor',
        email: 'test@ejemplo.com', // El correo que ya usamos en el test 1
        password: 'password123'
      });

    // Comprobamos que el servidor nos rechace con un 400 (Bad Request)
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('El correo electrónico ya está en uso');
  });

});